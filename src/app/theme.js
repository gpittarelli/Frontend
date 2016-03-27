import darkRawTheme from 'material-ui/lib/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';

let theme = getMuiTheme(darkRawTheme, {
  fontFamily: 'FiraSansLight, sans-serif',
  palette: {
    canvasColor: '#333333',
    textColor: '#999999',
    alternateTextColor: '#333333',
  },
});

console.log('THEME', theme, darkRawTheme);

export default theme;
