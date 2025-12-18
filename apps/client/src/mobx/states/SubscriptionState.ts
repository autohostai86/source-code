/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/naming-convention */

// import { History } from "history";
import { makeAutoObservable } from 'mobx';


class SubscriptionState {

    usageStatistics = {
        planCategory: "",
        isExpired: false,
        availableBalance: 0
    }


    constructor() {
        makeAutoObservable(this);
    }
    

    setUsageStatistics(key: string | number, value: any) {
        console.log(key, value);
        this.usageStatistics[key] = value;
    }

    setUsageStatisticsBulk(data: any) {
        this.usageStatistics = data;
    }
}

export default new SubscriptionState();