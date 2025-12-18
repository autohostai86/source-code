/** @format */

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
/* eslint-disable react/prop-types */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-use-before-define */

import { defaultDirection } from '../constants/defaultValues';

export const mapOrder = (array, order, key) => {
    array.sort((a, b) => {
        const A = a[key];
        const B = b[key];
        if (order.indexOf(`${A}`) > order.indexOf(`${B}`)) {
            return 1;
        }
        return -1;
    });
    return array;
};

export const getDateWithFormat = () => {
    const today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; // January is 0!

    const yyyy = today.getFullYear();
    if (dd < 10) {
        dd = `0${dd}`;
    }
    if (mm < 10) {
        mm = `0${mm}`;
    }
    return `${dd}.${mm}.${yyyy}`;
};

export const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes()}`;
};

export const getDirection = () => {
    let direction = defaultDirection;
    if (localStorage.getItem('direction')) {
        const localValue = localStorage.getItem('direction');
        if (localValue === 'rtl' || localValue === 'ltr') {
            direction = localValue;
        }
    }
    return {
        direction,
        isRtl: direction === 'rtl',
    };
};

export const setDirection = (localValue) => {
    let direction = 'ltr';
    if (localValue === 'rtl' || localValue === 'ltr') {
        direction = localValue;
    }
    localStorage.setItem('direction', direction);
};
