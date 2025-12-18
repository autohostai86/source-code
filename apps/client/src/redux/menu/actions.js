/** @format */

/* eslint-disable no-param-reassign */
/* eslint-disable import/no-cycle */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable react/static-property-placement */
/* eslint-disable react/state-in-constructor */
/* eslint-disable react/sort-comp */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-bitwise */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-array-index-key */

import {
    MENU_SET_CLASSNAMES,
    MENU_CONTAINER_ADD_CLASSNAME,
    MENU_CLICK_MOBILE_MENU,
    MENU_CHANGE_DEFAULT_CLASSES,
    MENU_CHANGE_HAS_SUB_ITEM_STATUS,
} from '../actions';

export const changeSelectedMenuHasSubItems = (payload) => ({
    type: MENU_CHANGE_HAS_SUB_ITEM_STATUS,
    payload,
});

export const changeDefaultClassnames = (strCurrentClasses) => ({
    type: MENU_CHANGE_DEFAULT_CLASSES,
    payload: strCurrentClasses,
});

export const addContainerClassname = (classname, strCurrentClasses) => {
    const newClasses = !strCurrentClasses.indexOf(classname) > -1 ? `${strCurrentClasses} ${classname}` : strCurrentClasses;
    return {
        type: MENU_CONTAINER_ADD_CLASSNAME,
        payload: newClasses,
    };
};

export const clickOnMobileMenu = (strCurrentClasses) => {
    const currentClasses = strCurrentClasses ? strCurrentClasses.split(' ').filter((x) => x !== '' && x !== 'sub-show-temporary') : '';
    let nextClasses = '';
    if (currentClasses.includes('main-show-temporary')) {
        nextClasses = currentClasses.filter((x) => x !== 'main-show-temporary').join(' ');
    } else {
        nextClasses = `${currentClasses.join(' ')} main-show-temporary`;
    }
    return {
        type: MENU_CLICK_MOBILE_MENU,
        payload: { containerClassnames: nextClasses, menuClickCount: 0 },
    };
};

export const setContainerClassnames = (clickIndex, strCurrentClasses, selectedMenuHasSubItems) => {
    const currentClasses = strCurrentClasses ? strCurrentClasses.split(' ').filter((x) => x !== '') : '';
    let nextClasses = '';
    if (!selectedMenuHasSubItems) {
        if (currentClasses.includes('menu-default') && (clickIndex % 4 === 0 || clickIndex % 4 === 3)) {
            clickIndex = 1;
        }
        if (currentClasses.includes('menu-sub-hidden') && clickIndex % 4 === 2) {
            clickIndex = 0;
        }
        if (currentClasses.includes('menu-hidden') && (clickIndex % 4 === 2 || clickIndex % 4 === 3)) {
            clickIndex = 0;
        }
    }

    if (clickIndex % 4 === 0) {
        if (currentClasses.includes('menu-default') && currentClasses.includes('menu-sub-hidden')) {
            nextClasses = 'menu-default menu-sub-hidden';
        } else if (currentClasses.includes('menu-default')) {
            nextClasses = 'menu-default';
        } else if (currentClasses.includes('menu-sub-hidden')) {
            nextClasses = 'menu-sub-hidden';
        } else if (currentClasses.includes('menu-hidden')) {
            nextClasses = 'menu-hidden';
        }
        clickIndex = 0;
    } else if (clickIndex % 4 === 1) {
        if (currentClasses.includes('menu-default') && currentClasses.includes('menu-sub-hidden')) {
            nextClasses = 'menu-default menu-sub-hidden main-hidden sub-hidden';
        } else if (currentClasses.includes('menu-default')) {
            nextClasses = 'menu-default sub-hidden';
        } else if (currentClasses.includes('menu-sub-hidden')) {
            nextClasses = 'menu-sub-hidden main-hidden sub-hidden';
        } else if (currentClasses.includes('menu-hidden')) {
            nextClasses = 'menu-hidden main-show-temporary';
        }
    } else if (clickIndex % 4 === 2) {
        if (currentClasses.includes('menu-default') && currentClasses.includes('menu-sub-hidden')) {
            nextClasses = 'menu-default menu-sub-hidden sub-hidden';
        } else if (currentClasses.includes('menu-default')) {
            nextClasses = 'menu-default main-hidden sub-hidden';
        } else if (currentClasses.includes('menu-sub-hidden')) {
            nextClasses = 'menu-sub-hidden sub-hidden';
        } else if (currentClasses.includes('menu-hidden')) {
            nextClasses = 'menu-hidden main-show-temporary sub-show-temporary';
        }
    } else if (clickIndex % 4 === 3) {
        if (currentClasses.includes('menu-default') && currentClasses.includes('menu-sub-hidden')) {
            nextClasses = 'menu-default menu-sub-hidden sub-show-temporary';
        } else if (currentClasses.includes('menu-default')) {
            nextClasses = 'menu-default sub-hidden';
        } else if (currentClasses.includes('menu-sub-hidden')) {
            nextClasses = 'menu-sub-hidden sub-show-temporary';
        } else if (currentClasses.includes('menu-hidden')) {
            nextClasses = 'menu-hidden main-show-temporary';
        }
    }
    if (currentClasses.includes('menu-mobile')) {
        nextClasses += ' menu-mobile';
    }
    return {
        type: MENU_SET_CLASSNAMES,
        payload: { containerClassnames: nextClasses, menuClickCount: clickIndex },
    };
};
