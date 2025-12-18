import fs from "fs";
import botModel from "@app/models/botModel";
import logger from '@app/loaders/logger';
import axios from "axios";
import { DEVELOPMENT, PRODUCTION } from "@app/constants";

class ListingService {

    async getAllListing(reqData): Promise<any> {
        try {
            const getAllListing = await botModel.findOne({ _id: reqData.botId })
            if (getAllListing) {
                return { error: false, msg: 'success', data: getAllListing }
            } else {
                return { error: false, msg: 'No Listing exist' }
            }
        } catch (error) {
            logger.error(`ListingService -> getAllListing -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }

    async addListing(reqData): Promise<any> {
        try {
            if (reqData.listing && reqData.listing.length > 0) {
                if (reqData.isOffline == "isOffline") {
                    const updateDB = await botModel.findByIdAndUpdate(reqData.botId, {listing: reqData.listing}, { upsert: true, new: true });
                    let dirPath = '';
                    let relativePath = '';
                    let dataSourceFiles = [];
                    updateDB?.['listing'].map((x) => {
                        // @ts-ignore
                        const data = {...x?.['otherInfo'], amenities: x?.['amenities'], facilities: x?.['favourites'], safety: x?.['safety']}
                        // create or overwrite json
                        const fileName = 'basicData.json';
                        relativePath = `uploads/botDocuments/${reqData['botId']}/${x?.['internalListingName']}`;
    
                        if (global.process.env.NODE_ENV === PRODUCTION) {
                            dirPath = `/usr/src/app/uploads/botDocuments/${reqData['botId']}/${x?.['internalListingName']}`;
                        }
    
                        if (global.process.env.NODE_ENV === DEVELOPMENT) {
                            dirPath = `/usr/src/app/apps/api/uploads/botDocuments/${reqData['botId']}/${x?.['internalListingName']}`;
                        }
    
                        if (!fs.existsSync(dirPath)) {
                            // file exists so remove it
                            // fs.rmSync(dirPath, {recursive: true});
                            fs.mkdirSync(dirPath, { recursive: true });
                        }
                        // write data to file
                        const file = fs.writeFileSync(`${dirPath}/${fileName}`, JSON.stringify(data));
                        dataSourceFiles.push({ path: relativePath, createdAt: Date.now(), mimeType: 'application/json', apartMent: `${x?.['internalListingName']}` })
                    });
                    // update data source
                    const updateBot = await botModel.findByIdAndUpdate(reqData['botId'], { dataSourceFiles: dataSourceFiles });
                } else {
                    const updateDB = await botModel.findByIdAndUpdate(reqData.botId, { listing: reqData.listing }, {new: true});
                    let dirPath = '';
                    let relativePath = '';
                    let dataSourceFiles = [];
                    for (const x of updateDB?.['listing']) {
                        // @ts-ignore
                        const data = {...x?.['otherInfo'], amenities: x?.['amenities'], facilities: x?.['favourites'], safety: x?.['safety']}
                        // create or overwrite json
                        const fileName = 'basicData.json';
                        relativePath = `uploads/botDocuments/${reqData['botId']}/${x?.['internalListingName']}`;
    
                        if (global.process.env.NODE_ENV === PRODUCTION) {
                            dirPath = `/usr/src/app/uploads/botDocuments/${reqData['botId']}/${x?.['internalListingName']}`;
                        }
    
                        if (global.process.env.NODE_ENV === DEVELOPMENT) {
                            dirPath = `/usr/src/app/apps/api/uploads/botDocuments/${reqData['botId']}/${x?.['internalListingName']}`;
                        }
    
                        if (!fs.existsSync(dirPath)) {
                            // file exists so remove it
                            // fs.rmSync(dirPath, {recursive: true});
                            fs.mkdirSync(dirPath, { recursive: true });
                        }
                        // write data to file
                        const file = fs.writeFileSync(`${dirPath}/${fileName}`, JSON.stringify(data));
                        dataSourceFiles.push({ path: relativePath, createdAt: Date.now(), mimeType: 'application/json', apartMent: `${x?.['internalListingName']}` })
                    }
                    // update data source
                    const updateBot = await botModel.findByIdAndUpdate(reqData['botId'], { dataSourceFiles: dataSourceFiles });
                }

                return { error: false, msg: 'success' };
            }
        } catch (error) {
            logger.error(
                `ListingService -> addListing -> error: ${error.message}`
            );
            return { error: true, msg: 'Internal server error' };
        }
    }
    async updateListing(reqData): Promise<any> {
        try {
            const updateDB = await botModel.findByIdAndUpdate(reqData.botId, { listing: reqData.listing },  { new: true });

            // creating the data source file for the db related data
            if (updateDB?.['listing'] && updateDB?.['listing'].length > 0) {
                let dataSourceFiles = [];
                updateDB?.['listing'].map((x) => {
                    // @ts-ignore
                    const data = {...x?.['otherInfo'], amenities: x?.['amenities'], facilities: x?.['favourites'], safety: x?.['safety']}
                    // create or overwrite json
                    let dirPath = '';
                    const fileName = 'basicData.json';
                    const relativePath = `uploads/botDocuments/${reqData['botId']}/${x?.['internalListingName']}`;

                    if (global.process.env.NODE_ENV === PRODUCTION) {
                        dirPath = `/usr/src/app/uploads/botDocuments/${reqData['botId']}/${x?.['internalListingName']}`;
                    }

                    if (global.process.env.NODE_ENV === DEVELOPMENT) {
                        dirPath = `/usr/src/app/apps/api/uploads/botDocuments/${reqData['botId']}/${x?.['internalListingName']}`;
                    }

                    if (!fs.existsSync(dirPath)) {
                        // file exists so remove it
                        // fs.rmSync(dirPath, {recursive: true});
                        fs.mkdirSync(dirPath, { recursive: true });
                    }
                    // write data to file
                    const file = fs.writeFileSync(`${dirPath}/${fileName}`, JSON.stringify(data));
                    dataSourceFiles.push({ path: relativePath, createdAt: Date.now(), mimeType: 'application/json', apartMent: `${x?.['internalListingName']}` })
                    
                });
                const updateBot = await botModel.findByIdAndUpdate(reqData['botId'], { dataSourceFiles: dataSourceFiles });
            }
            return { error: false, msg: 'success' };

        } catch (error) {
            logger.error(
                `ListingService -> updateListing -> error: ${error.message}`
            );
            return { error: true, msg: 'Internal server error' };
        }
    }
    async deleteListing(reqData): Promise<any> {
        try {
            const Delete = await botModel.findByIdAndUpdate(reqData.botId, { listing: reqData.listing });
            // delete images 
            if (reqData['images'].length > 0) {
                reqData['images'].forEach((image) => {
                    let absolutePath = '';
                    if (global.process.env.NODE_ENV === PRODUCTION) {
                        absolutePath = `/usr/src/app/${image?.['path']}`;
                    }

                    if (global.process.env.NODE_ENV === DEVELOPMENT) {
                        absolutePath = `/usr/src/app/apps/api/${image?.['path']}`;
                    }

                    fs.unlinkSync(absolutePath);
                });
            }
            return { error: false, msg: 'success' };

        } catch (error) {
            logger.error(
                `ListingService -> deleteListing -> error: ${error.message}`
            );
            return { error: true, msg: 'Internal server error' };
        }
    }

    async responderStatus(reqData): Promise<any> {
        try {
            const bot = await botModel.findByIdAndUpdate(
                reqData.botId,
                reqData['updateData']
            );
            if (!bot) {
                console.log('Bot or listing not found')
                return { error: false, msg: 'Bot or listing not found' }
            } else {

                return { error: false, msg: 'success' };
            }
        } catch (error) {
            logger.error(
                `ListingService -> responderStatus -> error: ${error.message}`
            );
            return { error: true, msg: 'Internal server error' };
        }
    }


    async getLatLngOfAddress(reqData): Promise<any> {
        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(reqData['destination'])}&key=AIzaSyDb1RxdDKcMh7e2RpTpwwk_qzaKfry9fQA`
            );

            const { lat, lng } = response?.data?.results?.[0]?.geometry?.location || {};

            if (lat && lng) {
                return { error: false, data: { lat: lat, lng: lng } }
            } else {
                logger.warn(
                    `ListingService -> getLatLngOfAddress -> Failed to get lat and lng`
                );
                return { error: true, msg: 'Failed to get lat and lng' };
            }

        } catch (error) {
            logger.error(
                `ListingService -> getLatLngOfAddress -> error: ${error.message}`
            );
            return { error: true, msg: 'Internal server error' };
        }
    }
}

export default new ListingService();