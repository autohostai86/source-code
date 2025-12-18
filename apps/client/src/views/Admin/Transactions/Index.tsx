/* eslint-disable prettier/prettier */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { toJS } from "mobx";
import { Observer, observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import Plan from '../Plan/Index'
// eslint-disable-next-line arrow-body-style

const Index: React.FC = () => {
    return (
        < Plan />
    )
}

export default observer(Index);
