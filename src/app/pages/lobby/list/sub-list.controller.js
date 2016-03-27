import h from 'react-hyperscript';
import RaisedButton from 'material-ui/lib/raised-button';
import { stripSlotNameNumber } from '../../../app.filter';
import theme from '../../../theme';
import MuiThemeProvider from 'material-ui/lib/MuiThemeProvider';

var scout = require('../../../../assets/img/icons/class/scout.svg');

angular
  .module('tf2stadium.controllers')
  .value('SubList', SubList)
  .controller('SubListController', SubListController);

function SubRequest(sub) {
  var { region, type, map, mumbleRequired } = sub;

  var klass = stripSlotNameNumber(sub.class);
  var icon = h('img', { src: scout, style: { height: '25px' } });

  // h('div', {className: 'icon lobby-icon-' + klass});

  return (
    h(RaisedButton, {
      className: 'substitute',
      tabIndex: 0,
      style: {
        width: '100%',
        height: '40px',
        marginBottom: '2em',
        textTranform: 'uppercase',
      },
    }, [
      icon,
      [
        region.name,
        type,
        klass,
        'needed in',
        map + '.',
        'Mumble ' + (mumbleRequired? '' : 'not ') + 'required',
      ].join(' '),
      icon,
    ])
  );
}

function SubList({ substitutes }) {
  var subs = substitutes.map(SubRequest);
  console.log(subs);
  return (
    h(MuiThemeProvider, { muiTheme: theme },
      h('div', { id: 'subList' }, subs))
  );
}

/** @ngInject */
function SubListController($scope, LobbyService) {
  var vm = this;

  vm.subList = LobbyService.getSubList();
  LobbyService.subscribe('sub-list-updated', $scope, function () {
    vm.subList = LobbyService.getSubList();
  });
}
