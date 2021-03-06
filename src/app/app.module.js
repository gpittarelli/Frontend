(function () {
  'use strict';

  angular.module('tf2stadium', [
    'tf2stadium.directives',
    'tf2stadium.controllers',
    'tf2stadium.services',
    'tf2stadium.filters',
    'ngAnimate',
    'ui.router',
    'ngMaterial',
    'luegg.directives',
    'ngAudio'
  ]);

  angular.module('tf2stadium.controllers', []);
  angular.module('tf2stadium.services', []);
  angular.module('tf2stadium.filters', []);
  angular.module('tf2stadium.directives', ['tf2stadium.filters']);

})();
