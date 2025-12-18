/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/naming-convention */

import { makeAutoObservable, runInAction } from 'mobx';
import toast from "react-hot-toast";

export default class UiState {

    sidebarOpen = false;
    isMobile = window.innerWidth <= 470
    isIpad = window.innerWidth >= 768 && window.innerWidth <= 1024
    isDesktop = window.innerWidth > 1024

    constructor() {
        makeAutoObservable(this);
        this.setSidebarOpen = this.setSidebarOpen.bind(this);
    }

    
    setSidebarOpen() {
        this.sidebarOpen = !this.sidebarOpen;
        
    }

    notify = async (msg: any, type: any) => {
        if (type === "success") {
            toast.success(msg, {
                duration: 4000,
                position: "bottom-center",
                style: {
                    width: "100%",
                    fontSize: "18px",
                },
            });
        } else {
            toast.error(msg, {
                duration: 6000,
                position: "bottom-center",
                style: {
                    width: "100%",
                    fontSize: "18px",
                },
            });
        }
    };

    setIsMobile(flag: boolean) {
        this.isMobile = flag;
    }

    setIsIpad(flag: boolean) {
        this.isIpad = flag
    }

    setIsDesktop(flag: boolean) {
        this.isDesktop = flag
    }
}