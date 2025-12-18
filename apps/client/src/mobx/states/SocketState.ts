/** @format */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { makeAutoObservable, toJS } from 'mobx';
import socketIoClient from 'socket.io-client';
// import { NotificationManager } from '../../components/common/react-notifications';
import {
    REPORT_CLEANUP_PROCESS_STATUS,
    INVOICE_COORDINATES,
    DOCS_PROCESS_STATUS,
    REPORT_PROCESS_STATUS,
    ERROR_STATUS,
    refreshClientData,
} from '../../constants';
import LogService from '../../services/LogService';
import { socketBaseURL } from '../../utils/API';
import UserState from './UserState';
import UiState from './UiState';

export default class SocketState {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket: any;

    socketId: string;

    UserState: UserState;

    UiState: UiState;

    constructor(userState, uiState) {
        // super();
        this.UserState = userState;
        this.UiState = uiState;

        makeAutoObservable(this);
    }

    socketInit() {
        const socket = socketIoClient(socketBaseURL);
        this.socket = socket;
        socket.on('connect', () => {
            this.socketId = socket.id;

            // create a user room for user specific notifications
            // console.log(this.UserState.userData.userId);
            // this.socket.emit('notificationRoom', { userId: this.UserState.userData.userId });
            // eslint-disable-next-line no-console
            //
            this.onSocketListen();
        });
    }

    // onSocketListen() {
    //     // on extracted process data response
    //     this.socket.on(INVOICE_COORDINATES, async (response) => {
    //         LogService.info('coordinate response', response);
    //

    //         if (Array.isArray(response)) {
    //             this.ProcessState.annotatePages[this.ProcessState.currentPageName] = [...response];
    //         }

    //         if (!Array.isArray(response)) {
    //             this.ProcessState.annotatePages = { ...response };
    //         }
    //     });
    // }

    onSocketListen() {
        this.socket.on('newMessage', async (response) => {
            this.UserState.currentBotNotifications.unshift(response);
        });

        this.socket.on('newOfflineMessage', () => {
            this.UiState.notify("You have recieved a new message", "success");
            this.UserState.setNotificationCount(1);
        })
    }
}
