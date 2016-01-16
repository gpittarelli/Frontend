(function () {
  'use strict';

  angular
    .module('tf2stadium.controllers')
    .controller('SettingsPageController', SettingsPageController);

  /** @ngInject */
  function SettingsPageController($rootScope, $scope, $mdEditDialog, SettingsPage,
                                  Settings, ngAudio, User, Notifications) {
    var vm = this;

    vm.sections = SettingsPage.getSections();

    vm.saveSetting = function (key, value, showNotification) {
      Settings.set(key, value, function () {
        if (showNotification) {
          var msg = 'Setting updated.';
          if (key ===  'siteAlias') {
            msg = 'Alias updated.';
          }

          Notifications.toast({message: msg});
        }
      });
    };

    vm.setCurrent = function (key) {
      vm.current = key;
    };

    vm.playSoundSample = function () {
      Settings.getSettings(function (settings) {
        ngAudio.play('/assets/sound/lobby-readyup.wav').volume = settings.soundVolume / 100;
      });
    };

    vm.logout = function () {
      User.logout();
    };

    /*
      Iterates through all the settings in the list and compares
      them to the stored settings.

      If a user setting exists for that element, it gets updated.
      If it doesn't, it defaults to true.
    */
    var populateFilters = function (userSettings) {
      for (var settingsGroupKey in vm.sections.filters) {
        var settingsGroup = vm.sections.filters[settingsGroupKey];
        for (var fieldKey in settingsGroup) {
          settingsGroup[fieldKey].selected = userSettings[fieldKey];
        }
      }
    };

    vm.selectedServerNames = [];
    vm.savedServers = [];
    vm.serverTableOrder = 'name';

    function saveServers(newSavedServers) {
      Settings.set('savedServers', serializeServers(newSavedServers));
    }

    vm.deleteSelectedServers = function () {
      vm.selectedServerNames = [];
      saveServers(vm.savedServers.filter(function (o) {
        return vm.selectedServerNames.indexOf(o.name) === -1;
      }));
    };

    vm.editServerField = function editServerField(e, server, field) {
      e.stopPropagation(); // prevent auto row-select

      console.log('edit', e, server, field);

      $mdEditDialog.small({
        modelValue: server[field],
        placeholder: 'Edit ' + field,
        save: function (input) {
          var newValue = input.$modelValue;

          // We do all of this mapping instead of just `server[field]
          // = newValue;` (the server arg is a reference to that
          // element in the savedServers array) because we aren't
          // doing speculative updates, and we want the same behavior
          // for both edits and deletes.
          saveServers(vm.savedServers.map(function (s) {
            if (s.name === server.name) {
              var newProps = {};
              newProps[field] = newValue;
              return angular.extend({}, server, newProps);
            } else {
              return s;
            }
          }));
        },
        targetEvent: e,
        title: 'Edit ' + field,
        validators: {
          'md-maxlength': 30
        }
      }).then(function (ctrl) {

      });
    };

    function receiveSettings(settings) {
      populateFilters(settings);
      vm.soundVolume = settings.soundVolume;
      vm.siteAlias = settings.siteAlias;

      vm.savedServers = deserializeServers(settings.savedServers);
    }

    function deserializeServers(str) {
      var serversObj = angular.fromJson(str);
      return Object.keys(serversObj).map(function (name) {
        var server = serversObj[name];
        return {
          name: name,
          url: server.url //,
          // password: server.password
        };
      });
    }

    function serializeServers(servers) {
      return angular.toJson(
        servers.reduce(function (acc, server) {
          acc[server.name] = { url: server.url };
          return acc;
        }, {})
      );
    }

    Settings.getSettings(receiveSettings);
    var handler = $rootScope.$on('settings-updated', function () {
      Settings.getSettings(receiveSettings);
    });
    $scope.$on('$destroy', handler);
  }
})();
