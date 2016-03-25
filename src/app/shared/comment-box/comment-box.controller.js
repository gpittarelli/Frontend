import h from 'react-hyperscript';
import moment from 'moment';

angular
  .module('tf2stadium.controllers')
  .controller('CommentBoxController', CommentBoxController)
  .constant('CommentViewComponent', CommentViewComponent);

function CommentViewComponent(props) {
  return h('div', props.messages.map(
    (message) =>
      h('div.chat-message', [
        h('span.chat-message-time', moment(message.timestamp).format('H:mm')),
        h('span', message.player.name),
        h('span', message.rawMessage),
        JSON.stringify(message)
      ])));
}

/*
            <div ng-repeat="message in room.messages track by $index"
                 class="chat-message">
            </div>
              <span class="chat-message-time"
                    ng-if="$root.currentTimestampsOption !== 'none'">{{message.timestamp | date:($root.currentTimestampsOption === 'hours12'? 'shortTime' : 'H:mm')}}</span>
              <md-menu>
                <md-button
                   class="chat-player-name"
                   ng-class="[message.player.tags]"
                   ng-click="$mdOpenMenu($event)"
                   tabindex="-1"
                   md-menu-origin>
                  {{message.player.name}}:
                </md-button>
                <md-menu-content width="3">
                  <md-menu-item>
                    <md-button
                       ng-click="commentBox.goToSteamProfile(message.player.steamid)">
                      Steam profile
                    </md-button>
                  </md-menu-item>
                  <md-menu-item ui-sref="user-profile({userID: message.player.steamid})">
                    <md-button>
                      Stadium profile
                    </md-button>
                  </md-menu-item>
		              <md-menu-item
                     ng-if="($root.userProfile.role=='moderator' || $root.userProfile.role=='administrator') && !message.deleted">
		                <md-button
		                   ng-click="commentBox.deleteMessage(message)">
		                  Delete Message
		                </md-button>
		              </md-menu-item>
                </md-menu-content>
              </md-menu>
              <span ng-class="{'chat-message-text':true,
                               'chat-message-deleted':message.deleted}"
                    ng-bind-html="message.message"></span>

*/

/** @ngInject */
function CommentBoxController($rootScope, $scope, $window, $log, $timeout,
                              ChatService) {
  var vm = this;

  //The $timeout makes sure the last tab (lobbyJoined tab)
  //will get selected on load thanks to md-autoselect
  $timeout(function () {
    vm.rooms = ChatService.getRooms();

    $scope.$watch('currentTab', function (newVal) {
      if (angular.isUndefined(newVal)) {
        // On initialization, this callback will be called with
        // newVal === oldVal === undefined
        return;
      }

      var room = vm.rooms[currentTabId()];
      var msgs = room.messages;

      if (msgs.length > 0) {
        vm.lastSeenIds[room.id] = msgs[msgs.length - 1].id;
        vm.showRoomNotification[room.id] = false;
      }
    });
  }, 0);

  vm.lastSeenIds = Object.create(null);
  vm.showRoomNotification = Object.create(null);

  // The three tabs are:
  //  0 - global chat
  //  1 - spectated lobby chat
  //  2 - joined lobby chat
  // however, not all these tabs exist at all times, so
  // just directly reading currentTab isn't sufficient
  function currentTabId() {
    var tabId = $scope.currentTab;
    if (tabId === 1 && vm.rooms[1].id === -1) {
      // If we're on the main screen, and we're joined in a lobby
      // but not spectating one, then the only two visible tabs will
      // be general chat and "your lobby" chat, so the 2nd displayed
      // tab is the normally 3rd tab
      tabId = 2;
    }

    return tabId;
  }

  var clearChatMessage = $rootScope.$on('chat-message', function (e, message) {
    function isFresh(msg) {
      return msg.id > latest && msg.player.steamid !== steamid;
    }

    var roomId = message.room;
    if (angular.isUndefined(vm.lastSeenIds[roomId])) {
      vm.lastSeenIds[roomId] = 0;
    }

    if (!vm.rooms) {
      return;
    }

    if (roomId === vm.rooms[currentTabId()].id) {
      vm.lastSeenIds[roomId] = Math.max(vm.lastSeenIds[roomId], message.id);
    }

    if ($rootScope.userProfile) {
      var steamid = $rootScope.userProfile.steamid;
      var latest = vm.lastSeenIds[roomId];

      var room = vm.rooms.filter(function (r) {
        return roomId === r.id;
      })[0];

      console.log('viewtest', CommentViewComponent(room));

      if (room) {
        vm.showRoomNotification[roomId] =
          room.messages.filter(isFresh).length > 0;
      }
    }
  });

  $scope.$on('$destroy', clearChatMessage);

  vm.sendMessage = function (event) {
    if (event.keyCode !== 13) {
      return;
    }

    event.preventDefault();

    if (angular.isDefined(vm.messageBox) && vm.messageBox.trim() !== '') {
      ChatService.send(vm.messageBox, vm.rooms[currentTabId()].id);
      vm.messageBox = '';
    }
  };

  vm.goToSteamProfile = function (steamId) {
    $window.open('https://steamcommunity.com/profiles/' + steamId, '_blank');
  };

  vm.deleteMessage = function (message) {
    ChatService.deleteMessage(message.id, message.room);
  };
}
