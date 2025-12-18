/** @format */

/* eslint-disable @nrwl/nx/enforce-module-boundaries */


const render = () => {
    // disabled dynamic import
    // import(`./assets/css/sass/themes/gogo.${color}.scss`).then((x) => {
    //     require('./AppRenderer');
    // });
    // eslint-disable-next-line global-require
    require('./AppRender');
};
export default render();
