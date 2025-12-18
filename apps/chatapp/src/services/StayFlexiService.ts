/** @format */

import axios from "axios";

/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */

class StayFlexiService {
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
                console.error(`StayFlexiService -> getCurrentListing -> error: ${JSON.stringify(err)}`);
                return { error: true, msg: 'Internal server error' }

            });
        return response;
    }

    async getPrice(reqData, authToken) {
        console.log(authToken);
        const response = await axios.get(`https://api.stayflexi.com/core/api/v1/beservice/hoteldetailadvanced?hotelId=${reqData['hotelId']}&checkin=${reqData['startingDate']}&checkout=${reqData['endingDate']}&discount=0`, {
            headers: {
                "X-SF-API-KEY": `${authToken}`
            }
        })
        .then((res) => {
            const { actualRate } = res.data
            if (actualRate) {
                return { error: false, data: `Total price: ${actualRate}` }
            } else {
                return { error: true, msg: 'No data found' }
            }
        })
        .catch((err) => {
            console.error(`StayFlexiService -> getCurrentListing -> error: ${JSON.stringify(err)}`);
            return { error: true, msg: 'Internal server error' }

        });
        return response;
    }


    async reservation(reqData, authToken) {
        const response = await axios.post(`https://api.stayflexi.com/core/api/v1/beservice/perform-booking`, reqData, {
            headers: {
                "X-SF-API-KEY": `${authToken}`
            }
        })
        .then((res) => {
            const { status, bookingId, message } = res.data
            if (status === true && message === 'Success') {
                return { error: false, data: `Rervation is successfully done. \n Please keep the reservation id safely with you for further inquries ${bookingId}` }
            } else if (status === false) {
                return { error: true, msg: message }
            } else {
                return { error: true, msg: 'Sorry could not process your request at the moment' }
            }
        })
        .catch((err) => {
            console.error(`StayFlexiService -> reservation -> error: ${JSON.stringify(err)}`);
            return { error: true, msg: 'Internal server error' }

        });
        return response;
    }


    async cancelReservation(reqData, authToken) {
        const response = await axios.get(`https://api.stayflexi.com/core/api/v1/beservice/bookingcancellation?bookingId=${reqData['reservationId']}`, {
            headers: {
                "X-SF-API-KEY": `${authToken}`
            }
        })
        .then((res) => {
            const { status, bookingId, message } = res.data
            if (status === true && message === 'Success') {
                return { error: false, data: `Reservation is cancelled successfully` }
            } else {
                return { error: true, msg: message }
            }
        })
        .catch((err) => {
            console.error(`StayFlexiService -> cancelReservation -> error: ${JSON.stringify(err)}`);
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
            console.error(`StayFlexiService -> fetchConversations -> error: ${JSON.stringify(err)}`);
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
            console.error(`StayFlexiService -> fetchMessages -> error: ${JSON.stringify(err)}`);
            return { error: true, msg: 'Internal server error' }

        });
        return response;
    }

    async fetchReservations(reqData, authToken) {
        const response = await axios.get(`https://api.hostaway.com/v1/reservations?limit=${reqData['limit']}&offset=${reqData['offset']}`, {
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
            console.error(`StayFlexiService -> fetchReservations -> error: ${JSON.stringify(err)}`);
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
            console.error(`StayFlexiService -> fetchMessages -> error: ${JSON.stringify(err)}`);
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
            console.error(`StayFlexiService -> fetchMessages -> error: ${JSON.stringify(err)}`);
            return { error: true, msg: 'Internal server error' }

        });
        return response;
    }

    async getListings(authToken, groupId) {
        const response = await axios.get(`https://api.stayflexi.com/core/api/v1/beservice/grouphotels?groupId=${groupId}`, {
            headers: {
                "X-SF-API-KEY": `${authToken}`
            }
        })
        .then((res) => {
            const { status, data } = res;
            if (status === 200 && data.length) {
                return { error: false, data: data }
            } else {
                return { error: true, msg: 'Sorry could not process your request at the moment' }
            }
        })
        .catch((err) => {
            console.error(`StayFlexiService -> getListings -> error: ${JSON.stringify(err)}`);
            return { error: true, msg: 'Internal server error' }

        });
        return response;
    }

    async getRoomsByHotel(authToken, hotelId) {
        const response = await axios.get(`https://api.stayflexi.com/core/api/v1/beservice/hotelcontent?hotelId=${hotelId}`, {
            headers: {
                "X-SF-API-KEY": `${authToken}`
            }
        })
        .then((res) => {
            const { data } = res;
            if (data.propertyId) {
                return { error: false, data: data }
            } else {
                return { error: true, msg: 'Sorry could not process your request at the moment' }
            }
        })
        .catch((err) => {
            console.error(`StayFlexiService -> getRoomsByHotel -> error: ${JSON.stringify(err)}`);
            return { error: true, msg: 'Internal server error' }

        });
        return response;
    }

    // get price of particular plan id 
    async getPriceByPlanId(reqData, authToken) {
        const response = await axios.get(`https://api.stayflexi.com/core/api/v1/beservice/hoteldetailadvanced?hotelId=${reqData['hotelId']}&checkin=${reqData['startingDate']}&checkout=${reqData['endingDate']}&discount=0`, {
            headers: {
                "X-SF-API-KEY": `${authToken}`
            }
        })
        .then((res) => {
            const { roomTypeMap } = res.data
            if (roomTypeMap) {
                const priceData = roomTypeMap[reqData['roomTypeId']]['combos'][0]['rates'] ? roomTypeMap[reqData['roomTypeId']]['combos'][0]['rates'] : [];
                let price = 0;
                if (priceData.length > 0) {
                    const filtered = priceData.filter((x) => x['ratePlanId'] === reqData['ratePlanId']);
                    if (filtered.length > 0) {
                        price = filtered[0]['actualPrice'];
                    }
                }
                return { error: false, data: price }
            } else {
                return { error: true, msg: 'No data found' }
            }
        })
        .catch((err) => {
            console.error(`StayFlexiService -> getPriceByPlanId -> error: ${JSON.stringify(err)}`);
            return { error: true, msg: 'Internal server error' }

        });
        return response;
    }
}

export default new StayFlexiService();
