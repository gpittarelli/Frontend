(function () {
  'use strict';

  angular
    .module('tf2stadium.controllers')
    .controller('UserProfileController', UserProfileController);

  /** @ngInject */
  function UserProfileController($state, User) {
    var vm = this;

    vm.steamId = $state.params.userID;
    vm.steamUrl = 'http://steamcommunity.com/profiles/' + vm.steamId;

    vm.profile = {};
    vm.loadingError = false;

    User
      .getProfile(vm.steamId)
      .then(function (profile) {
        vm.profile = profile;
        vm.loadingError = false;

        vm.profile.createdAt = moment(vm.profile.createdAt * 1000);

        vm.profile.lobbyTypes = [
          {key: 'playedSixesCount',
           abbr: '6s',
           name: '6v6' },
          {key: 'playedHighlanderCount',
           abbr: 'HL',
           name: 'Highlander' },
          {key: 'PlayedFoursCount',
           abbr: '4s',
           name: '4v4'},
          {key: 'PlayedBballCount',
           abbr: 'BB',
           name: 'BBall'},
          {key: 'PlayedUltiduoCount',
           abbr: 'UD',
           name: 'Ultiduo'}
        ].map(function (o) {
          o.cnt = vm.profile.stats[o.key];
          return o;
        });

        vm.profile.classes = [
          'scout',
          'soldier',
          'pyro',
          'demoman',
          'heavy',
          'engineer',
          'medic',
          'sniper',
          'spy'
        ].map(function (className) {
          return {
            name: className,
            cnt: vm.profile.stats[className] || 0
          };
        });

        vm.profile.external_links = [
          { name: 'logstf',
            img: '/assets/img/logos/logstf.svg',
            description: 'Logs.TF Match Logs'},
          { name: 'ugc',
            img: '/assets/img/logos/ugc.png',
            description: 'United Gaming Clans' },
          { name: 'etf2l',
            img: '/assets/img/logos/etf2l.png',
            description: 'European TF2 League' }
        ].filter(function (l) {
          return vm.profile.external_links &&
            vm.profile.external_links.hasOwnProperty(l.name);
        }).map(function (l) {
          l.url = vm.profile.external_links[l];
          return l;
        });

        // TODO: TEST DATA, remove once the backend supplies this
        if (angular.isUndefined(vm.profile.stats.leaves)) {
          vm.profile.stats.leaves = 0;
        }

        vm.profile.lobbies = [{
          "id": 364,
          "gamemode": "unknown",
          "type": "Ultiduo",
          "players": 4,
          "map": "ultiduo_baloo",
          "league": "etf2l",
          "mumbleRequired": true,
          "maxPlayers": 4,
          "whitelisted": false,
          "password": false,
          "region": {
            "name": "Europe",
            "code": "eu"
          },
          "classes": [
            {
              "blu": {
                "filled": true,
                "player": {
                  "avatar": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/b1/b10a6589c70ba4e54081899fffe6196b4c9aa0a2.jpg",
                  "gameHours": 661,
                  "profileUrl": "http://steamcommunity.com/id/Krakob/",
                  "lobbiesPlayed": 1,
                  "steamid": "76561198043385406",
                  "name": "|AMC| Krakob",
                  "tags": [
                    "player"
                  ],
                  "role": "player"
                },
                "ready": true,
                "ingame": true
              },
              "class": "soldier",
              "red": {
                "filled": true,
                "player": {
                  "avatar": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/47/47b336268d0fd06d1413abe9f34e4215f79eaa81.jpg",
                  "gameHours": 1270,
                  "profileUrl": "http://steamcommunity.com/id/vibhavp/",
                  "lobbiesPlayed": 9,
                  "steamid": "76561198038988384",
                  "name": "vibhavp",
                  "tags": [
                    "administrator"
                  ],
                  "role": "administrator"
                },
                "ready": true,
                "ingame": true
              }
            },
            {
              "blu": {
                "filled": true,
                "player": {
                  "avatar": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/8e/8e4b419bd8ce849dd919d8317ee374082138c92a.jpg",
                  "gameHours": 5460,
                  "profileUrl": "http://steamcommunity.com/id/Gcommer/",
                  "lobbiesPlayed": 29,
                  "steamid": "76561197993836391",
                  "name": "GC",
                  "tags": [
                    "administrator"
                  ],
                  "role": "administrator"
                },
                "ready": true,
                "ingame": true
              },
              "class": "medic",
              "red": {
                "filled": true,
                "player": {
                  "avatar": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/36/36c5ff66e7b3dfa4e3d2d37e64f1a9cb8c798f42.jpg",
                  "gameHours": 1334,
                  "profileUrl": "http://steamcommunity.com/id/canIhavealink/",
                  "lobbiesPlayed": 20,
                  "steamid": "76561198043745557",
                  "name": "Rand",
                  "tags": [
                    "administrator"
                  ],
                  "role": "administrator"
                },
                "ready": true,
                "ingame": true
              }
            }
          ],
          "leader": {
            "avatar": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/47/47b336268d0fd06d1413abe9f34e4215f79eaa81.jpg",
            "gameHours": 1270,
            "profileUrl": "http://steamcommunity.com/id/vibhavp/",
            "lobbiesPlayed": 9,
            "steamid": "76561198038988384",
            "name": "vibhavp",
            "tags": [
              "administrator"
            ],
            "role": "administrator"
          },
          "createdAt": 1454441320,
          "state": 5,
          "whitelistId": "ETF2L_ultiduo",
          "spectators": [
            {
              "name": "GC",
              "steamid": "76561197993836391",
              "$$hashKey": "object:821"
            }
          ]
        }];

        vm.profile.lobbies = vm.profile.lobbies.map(function (map) {
          map.createdAt = moment(map.createdAt * 1000);

          map.playerInfo = map.classes.map(function (klass) {
            if (klass.blu.player.steamid === vm.steamId) {
              return { 'team': 'blu', 'class': klass.class };
            } else if (klass.red.player.steamid === vm.steamId) {
              return { 'team': 'red', 'class': klass.class };
            }
            return false;
          }).filter(function (x) { return x; })[0];

          return map;
        });

        vm.profile.twitchChannel = "gcommer";

        vm.profile.stats.karma = vm.profile.stats.substitutes - vm.profile.stats.leaves;
      }, function (err) {
        vm.error = err;
        vm.loadingError = true;
      });
  }
})();
