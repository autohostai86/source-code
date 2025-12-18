/** @format */
/* eslint-disable class-methods-use-this */
// import API from "../utils/API";
// import axios from "axios";
import jwt_decode from "jwt-decode";
import API from '../utils/API';
import setAuthToken from "../utils/setAuthToken";
import LogService from './LogService';


// const baseURL = "http://localhost:5000"


class AuthService {
    // login service
    async login(reqData) {
        const response = await API.post('/auth/login', { ...reqData })
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                LogService.error(`AuthService -> login -> error: ${JSON.stringify(err)}`);
                return { error: true, msg: 'Internal server error' }

            });
        return response;
    }
    async forgotPassword(reqData) {
        const response = await API.post('/auth/forgot-password', reqData)
            .then((res) => {
                return res.data
            })
            .catch((error) => {
                LogService.error(`AuthService -> forgotPassword -> error: ${JSON.stringify(error)}`);
                return { error: true, msg: 'Internal server error' }
            })
        return response;
    }
    async resetPasswordData(reqData) {
        const response = await API.post('/auth/resetpassword', reqData)
            .then((res) => {
                return res.data
            })
            .catch((error) => {
                LogService.error(`AuthService -> resetPasswordData -> error: ${JSON.stringify(error)}`);
                return { error: true, msg: 'Internal server error' }
            })
        return response;
    }
    async isUserExists(email, type): Promise<any> {
        const response = await API.post(`/auth/is-user-exists`, { email, type });
        return response.data;
    }
    async register(reqData) {
        const response = await API.post('/auth/create', { ...reqData })
            .then((res) => {
                return res.data
            })
            .catch((error) => {
                LogService.error(`AuthService -> register -> error: ${JSON.stringify(error)}`);
                return { error: true, msg: 'Internal server error' }
            })
        return response;
    }

    // @ts-ignore
    public async checkAndRedirectLoggedInUser(useState, history, socketState) {
        // Set auth token header auth
        const token = localStorage['jwtToken'];
        // Decode token and get user info and exp
        const decoded: any = jwt_decode(token);
        // Set user and isAuthenticated
        const {
            id,
            email,
            name,
            userType,
            roles,
            profileImg,
            contactNo
        } = decoded;

        let rules_data = []
        if (roles != null || roles != undefined) {
            rules_data = roles
        }

        // check user is exists in db
        const { exits } = await this.isUserExists(email, userType);
        if (!exits) {
            return false;
        }
        setAuthToken(token);

        await useState.setCurrentUserState({
            id,
            email,
            name,
            userType,
            rules_data, // Ensure this key is correctly named and included
            isAuthenticated: true,
            profileImg,
            contactNo
        });
        // REDIRECTING USER TO RESPECTIVE PATH IF USER DATA PRESENT IN LOCAL STORAGE
        useState.setIsOfflineStatus(decoded?.isOffline ? "offline" : "");
        socketState.socket.emit('userOnline', { userId: id });
        history.push(`/dashboard`);


        // Check for expired token
        const currentTime = new Date().getTime() / 1000; // to get in milliseconds

        // FUNCTION FOR LOGOUT AFTER EXPIRY
        if (decoded.exp < currentTime) {
            socketState.socket.emit('userOffline', { userId: id });
            // Logout user
            // Remove token from local storage
            localStorage.removeItem("jwtToken");
            // Remove auth header for future requests
            setAuthToken(false);
            useState.setCurrentUserState({ isAuthenticated: false });
            history.push("/login");
        }
    }

    async uploadImage(reqData) {
        const response = await API.post('/auth/update-image', reqData)
            .then((res) => {
                return res.data
            })
            .catch((error) => {
                LogService.error(`AuthService -> uploadImage -> error: ${JSON.stringify(error)}`);
                return { error: true, msg: 'Internal server error' }
            })
        return response;
    }

    async updateProfile(reqData) {
        const response = await API.post('/auth/update-profile', reqData)
            .then((res) => {
                return res.data
            })
            .catch((error) => {
                LogService.error(`AuthService -> updateProfile -> error: ${JSON.stringify(error)}`);
                return { error: true, msg: 'Internal server error' }
            })
        return response;
    }
}

export default new AuthService();
