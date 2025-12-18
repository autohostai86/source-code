import axios from 'axios';
import logger from '@app/loaders/logger';
import botModel from '@app/models/botModel';
import fs from 'fs';
import { DEVELOPMENT, PRODUCTION } from '@app/constants';

class NearBySpotsService {

    async addSpots(reqData) {
        try {
            const spotsArrayPath = `listing.${reqData.listIndex}.nearBySpots.${reqData.category}`;
            const update = {
                $push: {
                    [spotsArrayPath]: reqData.nearBySpots[reqData.category][0]
                }
            };

            const updatedListing = await botModel.findOneAndUpdate(
                {
                    _id: reqData.botId,
                    'listing.internalListingName': reqData.aptNo
                },
                update,
                { new: true }
            );
            
            if (!updatedListing) {
                return { error: true, msg: 'Listing not found' };
            }

            // creating the data source file for the nearby spots
            if (updatedListing?.['listing'] && updatedListing?.['listing'].length > 0) {
                let nearbySpotData = [];
                updatedListing?.['listing'].map((x) => {
                    if (x['internalListingName'] == reqData['aptNo']) {
                        nearbySpotData.push(x['nearBySpots']);
                    }
                });
                
                if (nearbySpotData.length > 0) {
                    // create or overwrite json
                    let dirPath = '';
                    let relativePath = '';
                    const fileName = 'nearbySpot.json';

                    if (global.process.env.NODE_ENV === PRODUCTION) {
                        dirPath = `/usr/src/app/uploads/botDocuments/${reqData['botId']}/${reqData['aptNo']}`;
                        relativePath = `uploads/botDocuments/${reqData['botId']}/${reqData['aptNo']}`;
                    }

                    if (global.process.env.NODE_ENV === DEVELOPMENT) {
                        dirPath = `/usr/src/app/apps/api/uploads/botDocuments/${reqData['botId']}/${reqData['aptNo']}`;
                        relativePath = `uploads/botDocuments/${reqData['botId']}/${reqData['aptNo']}`;
                    }

                    if (!fs.existsSync(dirPath)) {
                        // file exists so remove it
                        // fs.rmSync(dirPath, {recursive: true});
                        fs.mkdirSync(dirPath, { recursive: true });
                    }
                    // write data to file
                    const file = fs.writeFileSync(`${dirPath}/${fileName}`, JSON.stringify(nearbySpotData));
                    
                    const dataSource = [{ path: relativePath, createdAt: Date.now(), mimeType: 'application/json', apartMent: reqData['aptNo'] }]
                    // update data source
                    const sources = updatedListing['dataSourceFiles'] && updatedListing['dataSourceFiles'].length > 0 ? updatedListing['dataSourceFiles'].concat(dataSource) : dataSource;
                    const updateBot = await botModel.findByIdAndUpdate(reqData['botId'], { dataSourceFiles: sources });
                }

            }

            return { error: false, msg: 'Success', data: updatedListing };
        } catch (error) {
            logger.error(
                `NearBySpotsService -> addSpots -> error: ${error.message}`
            );
            return { error: true, msg: 'Internal server error' };
        }
    }

    async deleteSpots(reqData): Promise<any> {
        try {
            const spotsArrayPath = `listing.${reqData.listIndex}.nearBySpots.${reqData.category}`;
            const listing = await botModel.findOne({
                _id: reqData.botId,
                'listing.internalListingName': reqData.aptNo
            });

            if (!listing) {
                return { error: true, msg: 'Listing not found' };
            }
            // @ts-ignore
            let spotsArray = listing.listing[reqData.listIndex].nearBySpots[reqData.category];

            if (!spotsArray || spotsArray.length <= reqData.index) {
                return { error: true, msg: 'Nearby spot not found' };
            } else {
                const update = {
                    $pull: {
                        [spotsArrayPath]: spotsArray[reqData.index]
                    }
                };

                const updatedListing = await botModel.findOneAndUpdate(
                    {
                        _id: reqData.botId,
                        'listing.internalListingName': reqData.aptNo
                    },
                    update,
                    { new: true }
                );

                if (!updatedListing) {
                    return { error: true, msg: 'Listing not found' };
                } else {

                    // creating the data source file for the nearby spots
                    if (updatedListing?.['listing'] && updatedListing?.['listing'].length > 0) {
                        let nearbySpotData = [];
                        updatedListing?.['listing'].map((x) => {
                            if (x['internalListingName'] == reqData['aptNo']) {
                                nearbySpotData.push(x['nearBySpots']);
                            }
                        });
                        
                        if (nearbySpotData.length > 0) {
                            // create or overwrite json
                            let dirPath = '';
                            const fileName = 'nearbySpot.json';

                            if (global.process.env.NODE_ENV === PRODUCTION) {
                                dirPath = `/usr/src/app/uploads/botDocuments/${reqData['botId']}/${reqData['aptNo']}`;
                            }

                            if (global.process.env.NODE_ENV === DEVELOPMENT) {
                                dirPath = `/usr/src/app/apps/api/uploads/botDocuments/${reqData['botId']}/${reqData['aptNo']}`;
                            }

                            if (!fs.existsSync(dirPath)) {
                                // file exists so remove it
                                // fs.rmSync(dirPath, {recursive: true});
                                fs.mkdirSync(dirPath, { recursive: true });
                            }
                            // write data to file
                            const file = fs.writeFileSync(`${dirPath}/${fileName}`, JSON.stringify(nearbySpotData));
                            
                        }
                    }
                    return { error: false, msg: 'Nearby spot deleted successfully' };
                }
            }


        } catch (error) {
            console.error('Error deleting nearby spot:', error);
            return { error: true, msg: 'Failed to delete nearby spot' };
        }
    }
    // need to fix
    async editSpots(reqData): Promise<any> {
        try {
            const updatePath = `listing.${reqData.listIndex}.nearBySpots.${reqData.category}.${reqData.index}`;

            const updatedListing = await botModel.findOneAndUpdate(
                {
                    _id: reqData.botId,
                    'listing.internalListingName': reqData.aptNo
                }, {
                [updatePath]: reqData.updateDetails,
            }
            );

            if (!updatedListing) {
                return { error: true, msg: 'Listing or nearby spot not found' };
            } else {
                // creating the data source file for the nearby spots
                if (updatedListing?.['listing'] && updatedListing?.['listing'].length > 0) {
                    let nearbySpotData = [];
                    updatedListing?.['listing'].map((x) => {
                        if (x['internalListingName'] == reqData['aptNo']) {
                            nearbySpotData.push(x['nearBySpots']);
                        }
                    });
                    
                    if (nearbySpotData.length > 0) {
                        // create or overwrite json
                        let dirPath = '';
                        const fileName = 'nearbySpot.json';

                        if (global.process.env.NODE_ENV === PRODUCTION) {
                            dirPath = `/usr/src/app/uploads/botDocuments/${reqData['botId']}/${reqData['aptNo']}`;
                        }

                        if (global.process.env.NODE_ENV === DEVELOPMENT) {
                            dirPath = `/usr/src/app/apps/api/uploads/botDocuments/${reqData['botId']}/${reqData['aptNo']}`;
                        }

                        if (!fs.existsSync(dirPath)) {
                            // file exists so remove it
                            // fs.rmSync(dirPath, {recursive: true});
                            fs.mkdirSync(dirPath, { recursive: true });
                        }
                        // write data to file
                        const file = fs.writeFileSync(`${dirPath}/${fileName}`, JSON.stringify(nearbySpotData));
                        
                    }
                }
                return { error: false, msg: 'Nearby spot updated successfully' };
            }
        } catch (error) {
            logger.error(`NearBySpotsService -> editSpot -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' };
        }
    }

    async getAllSpots(reqData): Promise<any> {
        try {
            const getAllSpots = await botModel.findOne({ _id: reqData.botId, 'listing.internalListingName': reqData.aptNo }, {
                'listing.$': 1
            })
            if (getAllSpots) {
                return { error: false, msg: 'success', data: getAllSpots }
            } else {
                return { error: false, msg: 'No user exist' }
            }
        } catch (error) {
            logger.error(`NearBySpotsService -> getAllSpots -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }

    async getDiraction(desLat, desLan, originLat, originLan) {
        try {
            const url = `https://maps.googleapis.com/maps/api/directions/json`;
            const queryParams = {
                origin: `${originLat},${originLan}`,
                destination: `${desLat},${desLan}`,
                key: global.process.env.GOOGLE_MAP_KEY
            };

            const response = await axios.get(url, { params: queryParams });
            return { error: false, msg: 'success', data: response.data };
        } catch (error) {
            console.error(`NearBySpotsService -> getDiraction -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' };
        }
    }

    async getPlaceDetails(destination, originLat, originLng) {
        try {
            const url = `https://maps.googleapis.com/maps/api/place/textsearch/json`;
            const queryParams = {
                query: destination,
                key: global.process.env.GOOGLE_MAP_KEY
            };

            const response = await axios.get(url, { params: queryParams });
            const destinationLat = response.data.results[0].geometry.location.lat
            const destinationLng = response.data.results[0].geometry.location.lng
            if (response) {
                const diraction = await this.getDiraction(destinationLat, destinationLng, originLat, originLng)
                return { error: false, msg: 'success', data: response.data, diraction: diraction.data }
            }
        } catch (error) {
            console.error(`NearBySpotsService -> getPlaceDetails -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' };
        }
    }
}

export default new NearBySpotsService();