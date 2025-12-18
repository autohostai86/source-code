/** @format */
/* eslint-disable class-methods-use-this */
// import API from "../utils/API";
// import axios from "axios";

import API from '../utils/API';
import LogService from './LogService';

// const baseURL = "http://localhost:5000"

class SuperAdminService {
    // async fetchTemplateList(userId) {
    //     let response = await API.post("/manageTemplate/fetchTemplateList", { userId });
    //     return [...response.data];
    // };

    // CREATE ADMINS
    async createAdmin(
        userId: string,
        orgId: string,
        userName: string,
        email: string,
        password: string,
        localization: string,
        roles: any,
        rolesForUser: any,
    ) {
        const response = await API.post(`/admin/createAdmin`, {
            userId,
            orgId,
            userName,
            email,
            password,
            localization,
            roles,
            rolesForUser,
        });
        return response.data;
    }

    // GET ALL ADMINS
    async getAllAdmins() {
        const response = await API.get(`/admin/getAllAdmins`);
        return response.data;
    }

    // DELETE ADMINS
    async deleteAdmin(userId: string, id: any) {
        const response = await API.post(`/admin/deleteAdmin`, {
            id,
            userId,
        });
        return response.data;
    }

    // UPDATE ADMINS
    async updateAdmin(
        userId: string,
        email: string,
        userName: string,
        password: string,
        localization: string,
        roles: any,
        rolesForUser: any,
        id: any,
    ) {
        const response = await API.post(`/admin/updateAdmin`, {
            userId,
            email,
            userName,
            password,
            localization,
            roles,
            rolesForUser,
            id,
        });
        return response.data;
    }

    // CREATE ORG
    async createOrg(
        userId: string,
        organizationName: string,
        organizationEmail: string,
        organizationLicenceFlag: boolean,
        organizationLicenceDate: string,
    ) {
        const response = await API.post(`/organization/createOrg`, {
            userId,
            organizationName,
            organizationEmail,
            organizationLicenceFlag,
            organizationLicenceDate,
        });
        return response.data;
    }

    // UPDATE ORG
    async updateOrg(
        userId: string,
        organizationName: string,
        organizationEmail: string,
        organizationLicenceFlag: boolean,
        organizationLicenceDate: string,
        id: any,
    ) {
        const response = await API.post(`/organization/updateOrg`, {
            userId,
            organizationName,
            organizationEmail,
            organizationLicenceFlag,
            organizationLicenceDate,
            id,
        });
        return response.data;
    }

    // DELETE ORG
    async deleteOrg(userId: string, id: any) {
        const response = await API.post(`/organization/deleteOrg`, {
            id,
            userId,
        });
        return response.data;
    }

    // GET ALL ORGANIZATIONS
    async getAllOrg() {
        const response = await API.get(`/organization/getAllOrg`);
        return response.data;
    }

    public async getSupConfig() {
        try {
            const response = await API.get('/superAdmin/getConfigs');
            return response.data;
        } catch (e) {
            LogService.error(e.response);
            return '';
        }
    }

    public async postSupConfig({ userId, orgId, filesList, orgHeaderText }): Promise<any> {
        // preparing form data
        // const missing = [];
        // eslint-disable-next-line no-param-reassign
        if (!orgHeaderText) orgHeaderText = '0';
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('orgId', orgId);
        formData.append('orgHeaderText', orgHeaderText);

        // if (filesList[0] === undefined) missing.push("orgBgImg");
        // if (filesList[1] === undefined) missing.push("orgLogo");
        // if (filesList[2] === undefined) missing.push("orgHeaderLogo");
        // if (filesList[3] === undefined) missing.push("footerLogo");
        // if (filesList[4] === undefined) missing.push("faviconLogo");

        for (let i = 0; i < filesList.length; i += 1) {
            if (filesList[i]) formData.append('files', filesList[i]);
        }

        // formData.append("missing", JSON.stringify(missing));

        // eslint-disable-next-line no-restricted-syntax
        // for (const value of formData.values()) {
        //     console.log(value);
        // }

        const response = await API.post('/superAdmin/config', formData);
        return response.data;
    }

    public async generateAuthUrl() {
        try {
            const response = await API.get('/upload/v2/generate-auth-url');
            return response.data;
        } catch (e) {
            LogService.error(e.response);
            return '';
        }
    }

    public async storeCode(code): Promise<any> {
        try {
            const response = await API.get(`/upload/v2/dropbox-code/${code}`);
            return response.data;
        } catch (e) {
            LogService.error(e.response);
            return '';
        }
    }
}

export default new SuperAdminService();
