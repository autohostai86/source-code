/** @format */

/* eslint-disable @nrwl/nx/enforce-module-boundaries */

// import '@bootstrap-min';
// import '@bootstrap-rtl-min';
// import '@sass-light-red-theme';
import "./assets/plugins/nucleo/css/nucleo.css";
// import "@fortawesome/fontawesome-free/css/all.min.css";
// import "assets/scss/argon-dashboard-react.scss";
import "./assets/css/argon-dashboard-react.min.css";
import 'react-circular-progressbar/dist/styles.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';


import { isMultiColorActive, defaultColor, themeColorStorageKey, isDarkSwitchActive } from './constants/defaultValues';
import 'react-table-6/react-table.css';

// disable logs in production
// eslint-disable-next-line no-console
// if (process.env['NODE_ENV'] !== 'development') console.log = () => {};


const color: any =
    (isMultiColorActive || isDarkSwitchActive) && localStorage.getItem(themeColorStorageKey)
        ? localStorage.getItem(themeColorStorageKey)
        : defaultColor;

localStorage.setItem(themeColorStorageKey, color);

const render = () => {
    // disabled dynamic import
    // import(`./assets/css/sass/themes/gogo.${color}.scss`).then((x) => {
    //     require('./AppRenderer');
    // });
    // eslint-disable-next-line global-require
    require('./AppRenderer');
};
render();
