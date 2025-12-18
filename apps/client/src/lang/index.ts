/** @format */

// REACT-INTL OLD VERSION CODE
// import { addLocaleData } from "react-intl";
// import enLang from "./entries/en-US";
// import esLang from "./entries/es-ES";
// import enRtlLang from "./entries/en-US-rtl";

// const AppLocale = {
//     en: enLang,
//     es: esLang,
//     enrtl: enRtlLang,
// };
// addLocaleData(AppLocale.en.data);
// addLocaleData(AppLocale.es.data);
// addLocaleData(AppLocale.enrtl.data);

import enLang from './translations/en.json';
import itLang from './translations/it.json';

const AppLocale = {
    en: enLang,
    it: itLang,
};

export default AppLocale;
