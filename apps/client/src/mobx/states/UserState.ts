/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/naming-convention */

// import { History } from "history";
import { makeAutoObservable, runInAction, toJS } from 'mobx';
import { CLASS_LIST } from '../../constants';

import setAuthToken from '../../utils/setAuthToken';
import { baseURL } from '../../utils/API';
import profileImg from '../../assets/img/defaultUser.png';
import BotService from '../../services/BotService';
import { any } from 'prop-types';
import SocketState from './SocketState';
import jwt_decode from "jwt-decode";
import AuthService from '../../services/AuthService';

export default class UserState {

    socketState: SocketState;

    userData = {
        userId: '',
        email: '',
        name: '',
        userType: '',
        roles: [],
        contactNo: '',
        profileImg: '',
        isAuthenticated: false,
    };

    currentBotId = '';
    isOfflineStatus = '';
    currentBotData = {}
    selectedListing = {}

    currentPMS = {}

    currentFile: any = false;

    currentBotNotifications = [];

    currentAction = '';

    listingData = {
        currentIndex: -1,
        propertyType: '',
        typeOfPlace: '',
        selectedLocation: {
            label: '',
            value: { description: '' },
        },
        location: '',
        lat: '',
        lng: '',
        basicInfo: {
            maximumGuestAllowed: 4,
            bedroom: 1,
            bed: 1,
            bathroom: 1,
            partyAllowed: 'No',
            smokingAllowed: 'No',
            petAllowed: 'No',
            unmarriedCoupleAllowed: 'No',
            alcoholAllowed: 'No',
            wifiDetail: {userName: '', password: ''},
            helpLineNumber: ''
        },
        favourite: [],
        ameniti: [],
        safety: [],
        listingName: '',
        hostawayListId: '',
        images: [],
        qrImg: "",
        link: ""
    }

    mode = 'add';

    notificationCount = 0;

    currentRoute = '';

    currentListingIndex = -1;

    currentPlan = {};

    hydrated = false;

    constructor(socketState) {
        makeAutoObservable(this);
        this.socketState = socketState;
        this.onLogout = this.onLogout.bind(this);
    }
    onLogout() {
        localStorage.removeItem("jwtToken");
        this.socketState.socket.emit('userOffline', { userId: this.userData.userId });
        this.userData.isAuthenticated = false;
        this.userData.name = '';
        this.userData.userType = '';
        this.userData.email = '';
        this.userData.userId = '';
        this.userData.roles = [];
        this.userData.contactNo = '';
        this.userData.profileImg = '';
        this.currentBotData = {}
        this.selectedListing = {}
        this.currentAction = '';
        this.notificationCount = 0;
        this.currentPMS = {};
        setAuthToken(false);
        this.setCurrentPlan({});
        // window.location.reload()
        

    }

    async setCurrentUserState(payload) {
        const { id, email, name, userType, isAuthenticated, rules_data, profileImg, contactNo } = payload;
        this.userData.isAuthenticated = isAuthenticated;
        this.userData.name = name;
        this.userData.userType = userType;
        this.userData.email = email;
        this.userData.userId = id;
        this.userData.roles = rules_data || [];
        this.userData.profileImg = profileImg ? profileImg : "";
        this.userData.contactNo = contactNo;
        console.log(contactNo)
    }

    setCurrentBotId(id) {
        this.currentBotId = id;
    }
    setIsOfflineStatus(data) {
        this.isOfflineStatus = data;
    }

    setCurrentFile(data) {
        this.currentFile = data;
    }

    setCurrentBotData(data) {
        this.currentBotData = data;
    }

    setCurrentNotifications(data) {
        this.currentBotNotifications = data;
    }

    setSelectedListing(data) {
        this.selectedListing = data;
    }

    async getNotifications() {
        const { error, data } = await BotService.getAllNotification();

        if (!error) {
            this.setCurrentNotifications(data);
        }
    }

    setCurrentPMS(data) {
        this.currentPMS = data;
    }

    setCurrentAction(data: string) {
        this.currentAction = data;
    }

    setUserOnlineStatus(status){
        if (status === true) {
            this.socketState.socket.emit('userOnline', { userId: this.userData.userId });
        } else {
            this.socketState.socket.emit('userOffline', { userId: this.userData.userId });
        }
    }

    // below functions are related with add or update listing
    handleSelect(type: string, key: string) {
        this.listingData = { ...this.listingData, [key]: type };
    }

    handleCheckboxSelect(label: string, key: keyof typeof this.listingData) {
        const currentList = this.listingData[key] as string[] || [];
        const isSelected = currentList.includes(label);

        const updatedList = isSelected
            ? currentList.filter((item) => item !== label)
            : [...currentList, label];

        this.listingData = { ...this.listingData, [key]: updatedList };
    }

    async setSelectLocation(e: any, type = 'location', data={}) {
        const destination = e.label;
        const currentSelectedLocation = { label: destination, value: { description: destination } };

        if (type === 'lat') {
            this.listingData = {
                ...this.listingData,
                lat: data?.['lat'],
                lng: data?.['lng'],
            };
        } else {
            this.listingData = {
                ...this.listingData,
                location: destination,
                selectedLocation: currentSelectedLocation,
            };

        }
    }

    handleBasicInfo(value: any, key: keyof typeof this.listingData.basicInfo) {
        this.listingData.basicInfo = {
            ...this.listingData.basicInfo,
            [key]: value,
        };
    }

    setListingName(name) {
        this.listingData.listingName = name;
    }

    setListingData(data) {
        this.listingData = data;
    }

    setMode(mode) {
        this.mode = mode;
    }

    setImages(images) {
        this.listingData.images = images;
    }

    setWifiDetail(field, value) {
        this.listingData.basicInfo.wifiDetail = {
            ...this.listingData.basicInfo.wifiDetail,
            [field]: value,
        };
    }

    setNotificationCount(data:number){
        if (data === 0) {
            this.notificationCount = data;
        } else {
            this.notificationCount = this.notificationCount + data;
        }
    }

    setCurrentRoute(route) {
        this.currentRoute = route;
    }

    setCurrentListingIndex(index) {
        this.currentListingIndex = index;
    }

    setCurrentPlan(data) {
        this.currentPlan = data;
    }


    async hydrateUserFromToken(socketState) {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            this.hydrated = true;
            return;
        }

        try {
            const decoded: any = jwt_decode(token);

            const {
                id,
                email,
                name,
                userType,
                roles,
                profileImg,
                contactNo,
                exp
            } = decoded;

            const currentTime = new Date().getTime() / 1000;
            if (exp < currentTime) {
                localStorage.removeItem("jwtToken");
                this.userData.isAuthenticated = false;
                this.hydrated = true;
                return;
            }

            const { exits } = await AuthService.isUserExists(email, userType);
            if (!exits) {
                localStorage.removeItem("jwtToken");
                this.userData.isAuthenticated = false;
                this.hydrated = true;
                return;
            }

            const rules_data = roles || [];

            await this.setCurrentUserState({
                id,
                email,
                name,
                userType,
                rules_data,
                isAuthenticated: true,
                profileImg,
                contactNo
            });

            this.setIsOfflineStatus(decoded?.isOffline ? "offline" : "");
            socketState.socket.emit("userOnline", { userId: id });

        } catch (err) {
            console.error("Token hydration error:", err);
            localStorage.removeItem("jwtToken");
            this.userData.isAuthenticated = false;
        }

        this.hydrated = true;
    }

}
