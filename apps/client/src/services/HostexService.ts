/** @format */

import axios from "axios";
import LogService from "./LogService";

/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */

class HostexService {
    async getCurrentListing(reqData, authToken) {
        const response = await axios.get('https://api.hostaway.com/v1/listings', {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
            .then((res) => {
                const { status, result } = res.data
                let currentListing = '';
                if (status == 'success' && result.length > 0) {
                    for (let i = 0; i < result.length; i++) {
                        const el = result[i]
                        console.log(`current apartmenrt ==========> ${reqData['currentApartmentNo']}`)
                        if (el.internalListingName === reqData['currentApartmentNo']) {
                            // console.log(el)
                            currentListing = el;
                            break
                        }
                    }
                    return { error: false, data: currentListing }
                } else {
                    return { error: true, msg: 'No data found' }
                }
            })
            .catch((err) => {
                LogService.error(`HostexService -> getCurrentListing -> error: ${JSON.stringify(err)}`);
                return { error: true, msg: 'Internal server error' }

            });
        return response;
    }

    async getPrice(reqData, authToken) {
        const response = await axios.post(`https://api.hostaway.com/v1/listings/${reqData.currentListingId}/calendar/priceDetails`, reqData, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
            .then((res) => {
                const { status, result } = res.data
                if (status == 'success' && result['totalPrice']) {
                    return { error: false, data: `Total price: ${result['totalPrice']}` }
                } else {
                    return { error: true, msg: 'No data found' }
                }
            })
            .catch((err) => {
                LogService.error(`HostexService -> getCurrentListing -> error: ${JSON.stringify(err)}`);
                return { error: true, msg: 'Internal server error' }

            });
        return response;
    }


    async reservation(reqData, authToken, id=0) {
        // const response = await axios.post(`https://api.hostaway.com/v1/reservations`, reqData, {
        //     headers: {
        //         Authorization: `Bearer ${authToken}`
        //     }
        // })
        // .then((res) => {
        //     console.log(res);
        //     const { status, result } = res.data
        //     if (status == 'success' && result['id']) {
        //         return { error: false, data: `Rervation is successfully done. \n Total Amount: ${result['totalPrice']} \n Please keep the reservation id safely with you for further inquries ${result['id']}` }
        //     } else {
        //         return { error: true, msg: 'Sorry could not process your request at the moment' }
        //     }
        // })
        // .catch((err) => {
        //     LogService.error(`HostexService -> reservation -> error: ${JSON.stringify(err)}`);
        //     return { error: true, msg: 'Internal server error' }

        // });
        // return response;

        try {
            let response:any;
            if (reqData['isUpdate']) {
                response = await axios.put(`https://api.hostaway.com/v1/reservations/${id}`, reqData, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
            } else {
                response = await axios.post(`https://api.hostaway.com/v1/reservations`, reqData, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
            }
    
            const { status, result } = response.data;
            if (status === 'success' && result && result['id']) {
                if (reqData['isUpdate']) {
                    return { error: false, data: `Reservation is successfully done. \n Total Amount: ${result['totalPrice']} \n Please keep the reservation id safely with you for further inquiries ${result['id']}` };    
                } else {
                    return { error: false, data: `Requested dates are available`, id: result['id'] };
                }
            } else {
                return { error: true, msg: 'Sorry could not process your request at the moment' };
            }
        } catch (error) {
            if (error.response && error.response.status === 403) {
                let msg = error?.response?.data?.message;
                let unavailable = false;
                if (msg && msg.includes('Requested dates are not available for listing')) {
                    msg = 'Requested dates are not available for reservation';
                    unavailable = true;
                } else {
                    msg = 'Internal server error';
                }
                // Handle 403 Forbidden error
                return { error: true, msg: msg, unavailable: unavailable };
            } else {
                LogService.error(`HostexService -> reservation -> error: ${JSON.stringify(error)}`);
                return { error: true, msg: 'Internal server error' };
            }
        }
    }


    async cancelReservation(reqData, authToken) {
        const response = await axios.put(`https://api.hostaway.com/v1/reservations/${reqData['reservationId']}/statuses/cancelled`, reqData, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
        .then((res) => {
            const { status, result, message } = res.data
            if (status == 'success' && result['id']) {
                return { error: false, data: `Reservation is cancelled successfully` }
            } else {
                return { error: true, msg: 'Sorry could not process your request at the moment' }
            }
        })
        .catch((err) => {
            LogService.error(`HostexService -> cancelReservation -> error: ${JSON.stringify(err)}`);
            return { error: true, msg: 'Internal server error' }

        });
        return response;
    }


    async fetchConversations(reqData, authToken) {
        const response = await axios.get(`https://api.hostaway.com/v1/conversations?limit=${reqData['limit']}&offset=${reqData['offset']}`, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
        .then((res) => {
            const { status, result, count } = res.data
            if (status == 'success' && result.length > 0) {
                return { error: false, data: result, count: count }
            } else {
                return { error: true, msg: 'Sorry could not process your request at the moment' }
            }
        })
        .catch((err) => {
            LogService.error(`HostexService -> fetchConversations -> error: ${JSON.stringify(err)}`);
            return { error: true, msg: 'Internal server error' }

        });
        return response;
    }

    async fetchMessages(reqData, authToken) {
        const response = await axios.get(` https://api.hostaway.com/v1/conversations/${reqData['conversationId']}/messages`, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
        .then((res) => {
            const { status, result } = res.data
            if (status == 'success' && result.length > 0) {
                return { error: false, data: result }
            } else {
                return { error: true, msg: 'Sorry could not process your request at the moment' }
            }
        })
        .catch((err) => {
            LogService.error(`HostexService -> fetchMessages -> error: ${JSON.stringify(err)}`);
            return { error: true, msg: 'Internal server error' }

        });
        return response;
    }

    async fetchReservations(reqData, authToken) {
        const response = await axios.get(`https://api.hostex.io/v3/conversations?offset=${reqData['offset']}&limit=${reqData['limit']}`, {
            headers: {
                "accept": "application/json",
                "Hostex-Access-Token": `${authToken}`
            }
        })
        .then((res) => {
            const { error_code, data } = res.data
            if (error_code === 200 && data?.['conversations'].length > 0) {
                console.log(data?.['conversations']);
                return { error: true, msg: 'Sorry could not process your request at the moment' }
                // return { error: false, data: result, count: reqData['offset']+reqData['limit'] }
            } else {
                return { error: true, msg: 'Sorry could not process your request at the moment' }
            }
        })
        .catch((err) => {
            LogService.error(`HostexService -> fetchReservations -> error: ${JSON.stringify(err)}`);
            return { error: true, msg: 'Internal server error' }

        });
        return response;
    }

    async fetchMessagesByReservation(reqData, authToken) {
        const response = await axios.get(`https://api.hostaway.com/v1/reservations/${reqData['reservationId']}/conversations`, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
        .then(async (res) => {
            const { status, result } = res.data
            if (status == 'success' && result.length > 0) {
                if (result?.[0]?.['conversationMessages']?.[0]?.['conversationId']) {
                    const messageData = await this.fetchMessages({conversationId: result?.[0]?.['conversationMessages']?.[0]?.['conversationId']}, authToken);
                    messageData['conversationId'] = result?.[0]?.['conversationMessages']?.[0]?.['conversationId'];
                    return messageData;
                }
                return { error: false, data: result, conversationId: result?.[0]?.['conversationMessages']?.[0]?.['conversationId'] }
            } else {
                return { error: true, msg: 'Sorry could not process your request at the moment' }
            }
        })
        .catch((err) => {
            LogService.error(`HostexService -> fetchMessages -> error: ${JSON.stringify(err)}`);
            return { error: true, msg: 'Internal server error' }

        });
        return response;
    }


    async sendMessage(reqData, authToken) {
        const response = await axios.post(`https://api.hostaway.com/v1/conversations/${reqData['conversationId']}/messages`, {body: reqData['body']},{
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
        .then((res) => {
            const { status, result } = res.data
            if (status == 'success' && result) {
                return { error: false, data: result }
            } else {
                return { error: true, msg: 'Sorry could not process your request at the moment' }
            }
        })
        .catch((err) => {
            LogService.error(`HostexService -> fetchMessages -> error: ${JSON.stringify(err)}`);
            return { error: true, msg: 'Internal server error' }

        });
        return response;
    }

    async getListings(authToken) {
        const response = await axios.get(`https://api.hostaway.com/v1/listings`, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
        .then((res) => {
            const { status, result } = res.data
            if (status == 'success' && result.length > 0) {
                return { error: false, data: result }
            } else {
                return { error: true, msg: 'Sorry could not process your request at the moment' }
            }
        })
        .catch((err) => {
            LogService.error(`HostexService -> getListings -> error: ${JSON.stringify(err)}`);
            return { error: true, msg: 'Internal server error' }

        });
        return response;
    }
}

export default new HostexService();
