import React, { useState, useEffect, useRef } from 'react'
import BotService from '../services/BotService';
import ChatBot, { MessagesContext, PathsContext } from "react-chatbotify";
import "react-chatbotify/dist/react-chatbotify.css";
import propertyMenus from './propertyMenus';
import HostawayService from '../services/HostawayService';
import StayFlexiService from '../services/StayFlexiService';
import { Card, CardBody, CardTitle, CardSubtitle, CardText, CardLink, Row, Col, Button, Input, Label } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.scss";
import CustomerService from '../services/CustomerService';
import socketIoClient from 'socket.io-client';
import { socketBaseURL } from '../utils/API';

let socket;
// @ts-ignore
const Bot = () => {
    const [botData, setBotData] = useState({});
    const [currentSubMenu, setCurrentSubMenu] = useState([]);
    const [currentApartmentNo, setCurrentApartmentNo] = useState('');
    const [currentVectorPath, setCurrentVectorPath] = useState('');
    const [messages, setMessages] = useState([]);
    const [hostwayToken, setHostwayToken] = useState('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzODExNCIsImp0aSI6IjJiZDYwZThjNmY5ODViYzJiZmMwY2JjOTRlNGQ4M2M3OTExMmI5Y2M5NmRiYzIzZDc1NmZkNzkzOGY4ODljNDVmZGE4YmVmYWI2YjczNDExIiwiaWF0IjoxNjk5MjUzMDUzLjkzMzUzOCwibmJmIjoxNjk5MjUzMDUzLjkzMzU0LCJleHAiOjIwMTQ4NzIyNTMuOTMzNTQ2LCJzdWIiOiIiLCJzY29wZXMiOlsiZ2VuZXJhbCJdLCJzZWNyZXRJZCI6MjI2MDd9.QM42Tr6LIAP6o21Lz44vO25zOoX4E54hWhHFx5MVqK9kJ-s-_7ZVrUeh-u7SeHYuAGQPwPfjCAjjyeujlvfu5wm6aEbk7yl2esk-MeQVZEFz-E1GdkuoCy3Sso6VM4g8XSjmRR8h7Zi2TnkCg7i2aaLBzD5nQnr7U5vxjeYozgo');
    const [currentPMS, setCurrentPMS] = useState('');
    const [selectedListId, setSelectedListId] = useState('');
    const [liveAgentStates, setLiveAgentStates] = useState({
        roomName: '',
        isAgentAvailable: false,
        counter: 0,
        isAgentMode: false
    });

    const [pricePayload, setPricePayload] = useState({
        startingDate: '',
        endingDate: '',
        numberOfGuests: 0,
        version: 2
    });

    const [reservationPayload, setReservationPayload] = useState({
        channelId: 2000,
        listingMapId: 0,
        isManuallyChecked: 0,
        isInitial: 0,
        guestName: '',
        guestFirstName: '',
        guestLastName: '',
        guestZipCode: '',
        guestAddress: '',
        guestCity: '',
        guestCountry: '',
        guestEmail: '',
        numberOfGuests: 0,
        adults: 0,
        children: 0,
        infants: 0,
        pets: 0,
        arrivalDate: '',
        departureDate: '',
        checkInTime: null,
        checkOutTime: null,
        phone: '',
        isUpdate: false,
        roomTypeId: 0,
        ratePlanId: 0,
        price: 0
    });
    const [currentListing, setCurrentListing] = useState<any>('');

    const [reservationId, setReservationId] = useState<any>('');

    // states related to stayflexi
    const [rooms, setRooms] = useState([]);
    const [ratePlans, setRatePlans] = useState([]);

    const [paths, setPaths] = useState([]);

    const menu = ['Price Inquiry', 'Reservation', 'Q&A'];

    // states related to offline
    const [customerData, setCustomerData] = useState({
        id: '',
        name: '',
        email: '',
        phone: '',
        idProof: '',
        signature: '',
    });


    const getSettings = async (userId) => {
        const params = `?userId=${userId}`;
        const { error, msg, data } = await BotService.getSetting(params);
        if (!error) {
            setCurrentPMS(data);
        }
    }

    const getBotData = async (idFromWindow) => {

        // @ts-ignore
        const { error, data } = await BotService.getBotsById({ botId: idFromWindow });
        if (!error) {
            setBotData(data);
            if (data['isOffline'] === true) {
                // setPaths(prev => [...prev, "ask_phone"]);
                setPaths(prev => [...prev, "start"]);
            } else {
                if (data['listing']) {
                    setCurrentListing(data['listing']);
                    const aptArr = [];
                    data['listing'].length > 0 && data['listing'].forEach(element => {
                        aptArr.push(element?.['internalListingName']);
                    });
                    setCurrentSubMenu(aptArr);
                    setPaths(prev => [...prev, "start"]);
                }
                getSettings(data['userId']);
            }
        }
    }
    // @ts-ignore
    const getAnswer = async (query) => {
        const postData = { sourcePath: currentVectorPath, question: query, botId: botData?.['_id'], userId: botData?.['userId'] }
        // @ts-ignore
        const { error, data, msg } = await BotService.chat(postData);
        if (!error) {
            if (data) {
                return data['text'];
            } else {
                return msg;
            }
        } else {
            return msg;
        }
    }

    const getPriceData = async () => {
        if (currentPMS['pmsType'] === 'Hostaway') {
            pricePayload['currentListingId'] = selectedListId;
            // @ts-ignore
            const { error, msg, data } = await HostawayService.getPrice(pricePayload, currentPMS['accessToken']);
            let response = '';
            if (!error && data) {
                response = data;
                return response;
            } else {
                return msg;
            }
        } else if (currentPMS['pmsType'] === 'StayFlexi') {
            pricePayload['hotelId'] = selectedListId;
            // @ts-ignore
            const { error, msg, data } = await StayFlexiService.getPrice(pricePayload, currentPMS['accessToken']);
            let response = '';
            if (!error && data) {
                response = data;
                return response;
            } else {
                return msg;
            }
        } else {
            console.log(`getPriceData => unregonized PMS`);
            return 'Sorry could not process your request at the moment';
        }
    }

    // @ts-ignore
    const makeReservation = async (isAvailabilityCheck = false, departureDate = '') => {
        if (currentPMS['pmsType'] === 'Hostaway') {
            if (isAvailabilityCheck) {
                reservationPayload.departureDate = departureDate;
            }
            reservationPayload.checkInTime = currentListing['checkInTimeStart'];
            reservationPayload.checkOutTime = currentListing['checkOutTime'];
            // @ts-ignore
            const { error, msg, data, unavailable, id } = await HostawayService.reservation(reservationPayload, currentPMS['accessToken'], reservationId);
            let response = '';
            if (!error && data) {
                response = data;
                if (id) {
                    setReservationId(id);
                }
                return { error: error, msg: response };
            } else {
                if (unavailable) {
                    return { error: error, msg: msg, unavailable: unavailable };    
                } else {
                    return { error: error, msg: msg };
                }
                
            }
        } else if (currentPMS['pmsType'] === 'StayFlexi') {
            const guestName = reservationPayload.guestName.split(' ');
            const postData = {
                checkin: reservationPayload.arrivalDate,
                checkout: reservationPayload.departureDate,
                hotelId: selectedListId,
                bookingStatus: "CONFIRMED",
                bookingSource: "STAYFLEXI_OD",
                roomStays: [
                    {
                        numAdults: reservationPayload.numberOfGuests,
                        numChildren: 0,
                        numChildren1: 0,
                        roomTypeId: reservationPayload.roomTypeId,
                        ratePlanId: reservationPayload.ratePlanId
                    }
                ],
                ctaId: "",
                customerDetails: {
                    firstName: guestName?.[0],
                    lastName: guestName[1] ? guestName[1] : '',
                    emailId: reservationPayload.guestEmail,
                    phoneNumber: reservationPayload.phone,
                    country: "",
                    city: "",
                    zipcode: "",
                    address: "",
                    state: ""
                },
                paymentDetails: {
                    sellRate: reservationPayload.price,
                    roomRate: reservationPayload.price,
                    payAtHotel: true
                },
                promoInfo: {},
                specialRequests: "",
                requestToBook: false,
                isAddOnPresent: true,
                posOrderList: [],
                isInsured: true,
                refundableBookingFee: 0,
                appliedPromocode: "",
                promoAmount: 0,
                bookingFees: 0,
                isEnquiry: false
            }

            // @ts-ignore
            const { error, msg, data } = await StayFlexiService.reservation(postData, currentPMS['accessToken']);
            if (!error && data) {
                return { error: error, msg: data };
            } else {
                return { error: error, msg: msg };
            }
            
        }

        
    }

    const cancelReservation = async (id) => {
        if (currentPMS['pmsType'] === 'Hostaway') {
            const postData = {
                cancelledBy: 'guest',
                reservationId: id,
            }
            // @ts-ignore
            const { error, msg, data } = await HostawayService.cancelReservation(postData, currentPMS['accessToken']);
            let response = '';
            
            if (!error && data) {
                response = data;
                return response;
            } else {
                return msg;
            }
        } else if (currentPMS['pmsType'] === 'StayFlexi') {
            const postData = {
                reservationId: id,
            }
            // @ts-ignore
            const { error, msg, data } = await StayFlexiService.cancelReservation(postData, currentPMS['accessToken']);
            let response = '';
            
            if (!error && data) {
                response = data;
                return response;
            } else {
                return msg;
            }
        }
    }

    // @ts-ignore
    const validate = async (value, type) => {
        if (type === 'date') {
            let dateFormat: any;
            if (currentPMS['pmsType'] === 'Hostaway') {
                dateFormat = /^\d{4}-\d{2}-\d{2}$/;
            }

            if (currentPMS['pmsType'] === 'StayFlexi') {
                dateFormat = /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/;
            }
            if (dateFormat.test(value)) {
                return true;
            } else {
                return false;
            }

        }

        if (type === 'number') {
            const regex = /^\d+$/;
            if (regex.test(value)) {
                return true;
            } else {
                return false;
            }
        }

        if (type === 'phone') {
            const regex = /^\d+$/;
            if (regex.test(value)) {
                return true;
            } else {
                return false;
            }
        }

        if (type === 'email') {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (regex.test(value)) {
                return true;
            } else {
                return false;
            }
        }


    }

    const getCurrentSubMenu = (currentApartment) => {
        const filtered = propertyMenus.apartmentMenu.filter((x) => x['property'] == currentApartment).map((x) => x['apartmentNo']);
        setCurrentSubMenu(filtered)
    }

    const setVectorPath = (apartment) => {
        if (botData?.['vectorPath'] && botData?.['vectorPath'].length > 0) {
            const filtered = botData?.['vectorPath'].filter((x) => x.apartment === apartment);
            if (filtered.length > 0) {
                setCurrentVectorPath(filtered[0]?.['path']);
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    const getSelectedListing = (aptName) => {
        if (botData['listing'] && botData['listing'].length > 0) {
            const listObj = botData['listing'].filter((x) => {return x.internalListingName === aptName});
            if (listObj.length > 0) {
                setSelectedListId(listObj[0]['hostawayListId'])
            }
        }
    }

    const clearMessages = () => {
        setMessages([]);
    }

    let conversations = []

    /* get room details by hotel
    this function is only for stayflexi
    */
    const getRooms = async (hotelId) => {
        // @ts-ignore
        const { error, data } = await StayFlexiService.getRoomsByHotel(currentPMS?.['accessToken'], hotelId);
        if (!error && data['roomTypeList']) {
            setRooms(data['roomTypeList']);
            return data['roomTypeList'];
        }
    }

    /* get rate plan details by hotel & rate plan id
    this function is only for stayflexi
    */
    const getPriceForRatePlan = async (postData) => {
        // @ts-ignore
        const { error, data } = await StayFlexiService.getPriceByPlanId(postData,currentPMS?.['accessToken']);
        if (!error && data !== 0) {
            setReservationPayload({...reservationPayload, price: data});
            return true;
        } else {
            return false;
        }
    }

    const handleAgentChat = (reqData, type = 'liveRoomMessage') => {
        if (type === 'joinRoom') {
            socket.emit('liveRoom', { botId: reqData['botId'], aptNo: reqData['aptNo'], phoneNumber: reqData['phoneNo'], userName: '' });
            const notify = socket.emit("notifyUser", {userId: botData?.['userId']});
            console.log("notify", notify);
            setLiveAgentStates((prev) => ({...prev, roomName: `${reqData['botId']}_${reqData['aptNo']}_${reqData['phoneNo']}`}));
        } else {
            const notify = socket.emit("notifyUser", {userId: botData?.['userId']});
            console.log("notify", notify);
            const isSuccess = socket.emit('liveRoomMessage', { roomName: reqData['roomName'], message: reqData['message'], userId: reqData['userId'], agent: reqData['agent'] });
        }
    }

    const flow = {
        start: {
            // @ts-ignore
            message: `${botData?.['initialMessage'] ? botData?.['initialMessage'] : "Hi, How may I help you 😊!"}`,
            path: "cancel",
            transition: { duration: 1000 },
        },
        cancel: {
            message: 'You can type "Cancel" anytime to start from the beginning',
            path: botData?.['isOffline'] === true ? "agent_instruction" : "apartment_menu",
            transition: { duration: 2000 },
        },
        agent_instruction: {
            message: 'You can type "Host" or "host" anytime to chat with a Customer Support Representative',
            path: "ask_phone",
            transition: { duration: 2000 },
        },
        apartment_menu: {
            message: "Please select the apartment",
            options: currentSubMenu,
            path: async (params) => {
                if (currentSubMenu.includes(params.userInput)) {
                    setCurrentApartmentNo(params.userInput);
                    // await getListing(params.userInput);
                    await getSelectedListing(params.userInput);
                    await getRooms(selectedListId);
                    await setVectorPath(params.userInput);
                    await conversations.push({ content: `${botData?.['initialMessage'] ? botData?.['initialMessage'] : "Hi, How may I help you 😊!"}`, isUser: false, timestamp: new Date().toISOString(), type: 'string' }, { content: 'You can type "Cancel" anytime to start from the beginning', isUser: false, timestamp: new Date().toISOString(), type: 'string' }, { content: 'Please select the apartment', isUser: false, timestamp: new Date().toISOString(), type: 'string' }, { content: params.userInput, isUser: true, timestamp: new Date().toISOString(), type: 'string' })
                    conversationalLog()
                    return 'menu';
                } else if (params.userInput == 'cancel' || params.userInput == 'Cancel') {
                    clearMessages();
                    return "start";
                } else {
                    return "unknown_input";
                }
            }
        },
        menu: {
            message: "Please choose a option",
            options: menu,
            path: async (params) => {
                if (menu.includes(params.userInput)) {
                    conversations.push({ content: "Please choose a option", isUser: false, timestamp: new Date().toISOString(), type: 'string' }, { content: params.userInput, isUser: true, timestamp: new Date().toISOString(), type: 'string' })
                    conversationalLog()
                    let nextPath = '';
                    if (params.userInput === 'Price Inquiry') {
                        nextPath = 'checkin';
                    } else if (params.userInput === 'Reservation') {
                        nextPath = 'reservation';
                    } else if (params.userInput === 'Q&A') {
                        nextPath = 'ask_query';
                    }
                    if (nextPath === '') {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        return "menu";
                    }
                    return nextPath;

                } else if (params.userInput == 'cancel' || params.userInput == 'Cancel') {
                    clearMessages();
                    return "start";
                } else {
                    return "unknown_input";
                }
            }
        },
        checkin: {
            message: `${currentPMS['pmsType'] === 'Hostaway' ? 'When are you planning to checkin? Ex: yyyy-mm-dd' : 'When are you planning to checkin? Ex: dd-mm-yyyy HH:MM:SS'}`,
            // @ts-ignore
            path: async (params) => {
                conversations.push({ content: `${currentPMS['pmsType'] === 'Hostaway' ? 'When are you planning to checkin? Ex: yyyy-mm-dd' : 'When are you planning to checkin? Ex: dd-mm-yyyy HH:MM:SS'}`, isUser: false, timestamp: new Date().toISOString(), type: 'string' }, { content: params.userInput, isUser: true, timestamp: new Date().toISOString(), type: 'string' })
                conversationalLog()
                const isValid = await validate(params.userInput, 'date');
                if (isValid) {
                    setPricePayload({ ...pricePayload, startingDate: params.userInput })
                    return 'checkout';
                } else {
                    params.injectMessage(`${currentPMS['pmsType'] === 'Hostaway' ? "Please enter the date in required format, yyyy-mm-dd" : "Please enter the date in required format, dd-mm-yyyy HH:MM:SS"}`);
                    conversations.push({ content: `${currentPMS['pmsType'] === 'Hostaway' ? "Please enter the date in required format, yyyy-mm-dd" : "Please enter the date in required format, dd-mm-yyyy HH:MM:SS"}`, isUser: false, timestamp: new Date().toISOString(), type: 'string' })
                    conversationalLog()
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return 'checkin';
                }
            }
        },
        checkout: {
            message: `${currentPMS['pmsType'] === 'Hostaway' ? 'When are you planning to checkout? Ex: yyyy-mm-dd' : 'When are you planning to checkout? Ex: dd-mm-yyyy HH:MM:SS'}`,
            // @ts-ignore
            path: async (params) => {
                conversations.push({ content: `${currentPMS['pmsType'] === 'Hostaway' ? 'When are you planning to checkout? Ex: yyyy-mm-dd' : 'When are you planning to checkout? Ex: dd-mm-yyyy HH:MM:SS'}`, isUser: false, timestamp: new Date().toISOString(), type: 'string' }, { content: params.userInput, isUser: true, timestamp: new Date().toISOString(), type: 'string' })
                conversationalLog()
                const isValid = await validate(params.userInput, 'date');
                if (isValid) {
                    setPricePayload({ ...pricePayload, endingDate: params.userInput })
                    if (currentPMS['pmsType'] === 'Hostaway') {
                        return 'no_of_guests';
                    } else {
                        return 'hostaway'
                    }
                } else {
                    params.injectMessage(`${currentPMS['pmsType'] === 'Hostaway' ? "Please enter the date in required format, yyyy-mm-dd" : "Please enter the date in required format, dd-mm-yyyy HH:MM:SS"}`);
                    conversations.push({ content: `${currentPMS['pmsType'] === 'Hostaway' ? "Please enter the date in required format, yyyy-mm-dd" : "Please enter the date in required format, dd-mm-yyyy HH:MM:SS"}`, isUser: false, timestamp: new Date().toISOString(), type: 'string' })
                    conversationalLog()
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return 'checkout';

                }
            }
        },
        no_of_guests: {
            message: 'How many guests are there?',
            // @ts-ignore
            path: async (params) => {
                conversations.push({ content: 'How many guests are there?', isUser: false, timestamp: new Date().toISOString(), type: 'string' }, { content: params.userInput, isUser: true, timestamp: new Date().toISOString(), type: 'string' })
                conversationalLog()
                const isValid = await validate(params.userInput, 'number');
                if (isValid) {
                    setPricePayload({ ...pricePayload, numberOfGuests: params.userInput })
                    return 'hostaway';
                } else {
                    params.injectMessage("Please enter only numbers");
                    conversations.push({ content: "Please enter only numbers", isUser: false, timestamp: new Date().toISOString(), type: 'string' })
                    conversationalLog()
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return 'no_of_guests';

                }
            }
        },
        hostaway: {
            transition: {
                duration: 0
            },
            path: async (params) => {
                const responseMsg = await getPriceData();
                params.injectMessage(responseMsg);
                await new Promise(resolve => setTimeout(resolve, 1000));
                conversations.push({ content: responseMsg, isUser: false, timestamp: new Date().toISOString(), type: 'string' })
                conversationalLog()
                return "menu";
            }
        },
        reservation: {
            message: "Please choose a option",
            options: ["Make Reservation", "Cancel Reservation"],
            path: async (params) => {
                conversations.push({ content: "Please choose a option", isUser: false, timestamp: new Date().toISOString(), type: 'string' }, { content: params.userInput, isUser: true, timestamp: new Date().toISOString(), type: 'string' })
                conversationalLog()
                if (params.userInput == 'Make Reservation') {
                    return "reservation_arrival";
                } else if (params.userInput == 'Cancel Reservation') {
                    return "cancel_reservation";
                } else if (params.userInput == 'cancel' || params.userInput == 'Cancel') {
                    clearMessages();
                    return "start";
                } else {
                    return "reservation";
                }
            }
        },
        reservation_arrival: {
            message: `${currentPMS['pmsType'] === 'Hostaway' ? 'Please enter date of arrival? Ex: yyyy-mm-dd' : 'Please enter date of arrival? Ex: dd-mm-yyyy HH:MM:SS'}`,
            path: async (params) => {
                conversations.push({ content: `${currentPMS['pmsType'] === 'Hostaway' ? 'Please enter date of arrival? Ex: yyyy-mm-dd' : 'Please enter date of arrival? Ex: dd-mm-yyyy HH:MM:SS'}`, isUser: false, timestamp: new Date().toISOString(), type: 'string' }, { content: params.userInput, isUser: true, timestamp: new Date().toISOString(), type: 'string' })
                conversationalLog()
                const isValid = await validate(params.userInput, 'date');
                if (isValid) {
                    setReservationPayload({ ...reservationPayload, arrivalDate: params.userInput, listingMapId: currentListing['id'] });
                    return 'reservation_departure'
                } else {
                    params.injectMessage("Please enter the date in required format, yyyy-mm-dd");
                    conversations.push({ content: "Please enter the date in required format, yyyy-mm-dd", isUser: false, timestamp: new Date().toISOString(), type: 'string' })
                    conversationalLog()
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return 'reservation_arrival';

                }

            }
        },
        reservation_departure: {
            message: `${currentPMS['pmsType'] === 'Hostaway' ? 'Please enter date of departure? Ex: yyyy-mm-dd' : 'Please enter date of departure? Ex: dd-mm-yyyy HH:MM:SS'}`,
            path: async (params) => {
                conversations.push({ content: `${currentPMS['pmsType'] === 'Hostaway' ? 'Please enter date of departure? Ex: yyyy-mm-dd' : 'Please enter date of departure? Ex: dd-mm-yyyy HH:MM:SS'}`, isUser: false, timestamp: new Date().toISOString(), type: 'string' }, { content: params.userInput, isUser: true, timestamp: new Date().toISOString(), type: 'string' })
                conversationalLog()
                const isValid = await validate(params.userInput, 'date');
                if (isValid) {
                    setReservationPayload({ ...reservationPayload, departureDate: params.userInput });
                    if (currentPMS['pmsType'] === 'Hostaway') {
                        const responseMsg = await makeReservation(true, params.userInput);
                        params.injectMessage(responseMsg?.msg);
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        if (responseMsg?.unavailable) {
                            params.injectMessage('Please try with different dates');
                            conversations.push({ content: "Please try with different dates", isUser: false, timestamp: new Date().toISOString(), type: 'string' })
                            conversationalLog()
                            await new Promise(resolve => setTimeout(resolve, 3000));
                            return 'reservation_arrival';
                        } else {
                            setReservationPayload({ ...reservationPayload, isUpdate: true });
                            return 'reservation_guest_name'
                        }
                    } else {
                        return 'reservation_get_rooms'
                    }
                } else {
                    params.injectMessage(`${currentPMS['pmsType'] === 'Hostaway' ? 'Please enter the date in required format, Ex: yyyy-mm-dd' : 'Please enter the date in required? Ex: dd-mm-yyyy HH:MM:SS'}`);
                    conversations.push({ content: `${currentPMS['pmsType'] === 'Hostaway' ? 'Please enter the date in required format, Ex: yyyy-mm-dd' : 'Please enter the date in required? Ex: dd-mm-yyyy HH:MM:SS'}`, isUser: false, timestamp: new Date().toISOString(), type: 'string' })
                    conversationalLog()
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return 'reservation_departure';

                }
            }
        },
        reservation_get_rooms: {
            message: "Please choose a room",
            render: (params) => {
                if (rooms.length > 0) {
                    return (
                        <div className='ml-3 mt-2'>
                            <Row>
                                {
                                    rooms.map((item, index) => (
                                        <Col md={3} lg={3} key={index} className='mb-2'>
                                            <Card style={{ width: '100%' }}
                                            >
                                                <img
                                                    alt="Sample"
                                                    src={item?.roomTypeImages?.[0]}
                                                />
                                                <CardBody>
                                                    <CardTitle tag="h5">
                                                        {item?.roomTypeName}
                                                    </CardTitle>
                                                    <CardText>
                                                        <p><i className='fa fa-child'></i> Max children: {item?.maxChildren}</p>
                                                        <p><i className='fa fa-users'></i> Max Occupants: {item?.maxOccupants}</p>
                                                    </CardText>
                                                    <Button
                                                        className="my-4 w-100 custom-outline-button"
                                                        type="button"
                                                        onClick={() => {
                                                            setReservationPayload({...reservationPayload, roomTypeId: item.roomTypeId});
                                                            setRatePlans(item.availableRatePlans);
                                                            params.injectMessage(item?.roomTypeName);
                                                            setTimeout(() => {
                                                                conversations.push({ content: 'Please choose a room', isUser: false, timestamp: new Date().toISOString(), type: 'string' });
                                                                conversations.push({ content: item?.roomTypeName, isUser: true, timestamp: new Date().toISOString(), type: 'string' });
                                                                conversationalLog();
                                                                setPaths(prev => [...prev, "reservation_rate_selection"]);
                                                            }, 1000);
                                                        }}
                                                    >
                                                        Choose
                                                    </Button> 
                                                    
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    ))
                                }
                            </Row>
                        </div>
                    ) 
                } else {
                    setTimeout(() => {
                        conversations.push({ content: 'No rooms are available, please try with other dates', isUser: false, timestamp: new Date().toISOString(), type: 'string' });
                        conversationalLog();
                        setPaths(prev => [...prev, "reservation_arrival"]);
                    }, 1000);
                    return (<div className='ml-3 mt-2'><p>No rooms are available, please try with other dates</p></div>)
                }
            },
            path: 'reservation_rate_selection'
            // path: async (params) => {
            //     await new Promise(resolve => setTimeout(resolve, 2000));
            //     return 'reservation_room_selection'
            // }
        },
        reservation_rate_selection: {
            message: "Please select a rate plan",
            render: (params) => {
                if (ratePlans.length > 0) {
                    return (
                        <div className='ml-3 mt-2'>
                            {
                                ratePlans.map((item, index) => (
                                    <>
                                    <Row>
                                        <Col>
                                            <input
                                                type="radio"
                                                value={item?.ratePlanId}
                                                onChange={async (e) => {
                                                    setReservationPayload({...reservationPayload, ratePlanId: item.ratePlanId});
                                                    const postData = {
                                                        hotelId: selectedListId,
                                                        startingDate: reservationPayload.arrivalDate,
                                                        endingDate: reservationPayload.departureDate,
                                                        roomTypeId: reservationPayload.roomTypeId,
                                                        ratePlanId: e.target.value
                                                    }
                                                    console.log(postData);
                                                    const getPrice = await getPriceForRatePlan(postData);
                                                    if (getPrice) {
                                                        params.injectMessage(`${item?.ratePlanName} - ${item?.ratePlanId}`);
                                                        setTimeout(() => {
                                                            conversations.push({ content: 'select a rate plan', isUser: false, timestamp: new Date().toISOString(), type: 'string' });
                                                            conversations.push({ content: `${item?.ratePlanName} - ${item?.ratePlanId}`, isUser: true, timestamp: new Date().toISOString(), type: 'string' });
                                                            conversationalLog();
                                                            setPaths(prev => [...prev, "reservation_guest_name"]);
                                                        }, 1000);
                                                    } else {
                                                        params.injectMessage('Could not get details about the plane you have choosed, please try again');
                                                        setTimeout(() => {
                                                            conversations.push({ content: 'Could not get details about the plane you have choosed, please try again', isUser: false, timestamp: new Date().toISOString(), type: 'string' });
                                                            conversationalLog();
                                                            setPaths(prev => [...prev, "reservation_rate_selection"]);
                                                        }, 1000);
                                                    }
                                                }}
                                            />
                                            {" "}<label>{item?.ratePlanName} - {item?.ratePlanId}</label>
                                        </Col>
                                    </Row>
                                    </>
                                ))
                            }
                        </div>
                    ) 
                } else {

                    return (<div className='ml-3 mt-2'><h2>No rate plan are available</h2></div>)
                }
            },
            path: 'reservation_guest_name'
        },
        reservation_guest_name: {
            message: "Please enter your name",
            path: async (params) => {
                conversations.push({ content: "Please enter your name", isUser: false, timestamp: new Date().toISOString(), type: 'string' }, { content: params.userInput, isUser: true, timestamp: new Date().toISOString(), type: 'string' })
                conversationalLog()
                setReservationPayload({ ...reservationPayload, guestName: params.userInput });
                return 'reservation_email'
            }
        },
        reservation_email: {
            message: "Please enter your email",
            path: async (params) => {
                const isValid = await validate(params.userInput, 'email');
                if (isValid) {
                    conversations.push({ content: "Please enter your email", isUser: false, timestamp: new Date().toISOString(), type: 'string' }, { content: params.userInput, isUser: true, timestamp: new Date().toISOString(), type: 'string' })
                    conversationalLog()
                    setReservationPayload({ ...reservationPayload, guestEmail: params.userInput });
                    return 'reservation_phone'
                } else {
                    params.injectMessage("Please enter valid email");
                    conversations.push({ content: "Please enter valid email", isUser: false, timestamp: new Date().toISOString(), type: 'string' })
                    conversationalLog()
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return 'reservation_email';

                }

            }
        },
        reservation_phone: {
            message: "Please enter your phone number",
            path: async (params) => {
                conversations.push({ content: "Please enter your phone number", isUser: false, timestamp: new Date().toISOString(), type: 'string' }, { content: params.userInput, isUser: true, timestamp: new Date().toISOString(), type: 'string' })
                conversationalLog()
                const isValid = await validate(params.userInput, 'phone');
                if (isValid) {
                    setReservationPayload({ ...reservationPayload, phone: params.userInput });
                    return 'reservation_guest'
                } else {
                    params.injectMessage("Please enter valid phone number");
                    conversations.push({ content: "Please enter valid phone number", isUser: false, timestamp: new Date().toISOString(), type: 'string' })
                    conversationalLog()
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return 'reservation_phone';

                }

            }
        },
        reservation_guest: {
            message: "Please enter the number of guest",
            path: async (params) => {
                conversations.push({ content: "Please enter the number of guest", isUser: false, timestamp: new Date().toISOString(), type: 'string' }, { content: params.userInput, isUser: true, timestamp: new Date().toISOString(), type: 'string' })
                conversationalLog()
                const isValid = await validate(params.userInput, 'number');
                if (isValid) {
                    setReservationPayload({ ...reservationPayload, numberOfGuests: parseInt(params.userInput) });
                    conversationalLog()
                    return 'hostaway_resevation'
                } else {
                    params.injectMessage("Please enter only numbers");
                    conversations.push({ content: "Please enter number only", isUser: false, timestamp: new Date().toISOString(), type: 'string' })
                    conversationalLog()
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return 'reservation_guest';

                }

            }
        },
        hostaway_resevation: {
            transition: {
                duration: 0
            },
            path: async (params) => {
                const responseMsg = await makeReservation();
                params.injectMessage(responseMsg?.msg);
                await new Promise(resolve => setTimeout(resolve, 3000));
                conversations.push({ content: responseMsg?.msg, isUser: false, timestamp: new Date().toISOString(), type: 'string' })
                conversationalLog()
                return "menu";
            }
        },
        cancel_reservation: {
            message: "Please enter your reservation id",
            path: async (params) => {
                conversations.push({ content: "Please enter your reservation id", isUser: false, timestamp: new Date().toISOString(), type: 'string' }, { content: params.userInput, isUser: true, timestamp: new Date().toISOString(), type: 'string' })
                conversationalLog();
                if (currentPMS['pmsType'] === 'Hostaway') {
                    const isValid = await validate(params.userInput, 'number');
                    if (isValid) {
                        setReservationId(params.userInput);
                        return "host_cancel_reservation";
                    } else {
                        params.injectMessage("Please enter number only");
                        conversations.push({ content: "Please enter number only", isUser: false, timestamp: new Date().toISOString(), type: 'string' })
                        conversationalLog()
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        return 'cancel_reservation';

                    }
                } else {
                    setReservationId(params.userInput);
                    return "host_cancel_reservation";
                }
            }
        },
        host_cancel_reservation: {
            transition: {
                duration: 0
            },
            path: async (params) => {
                const responseMsg = await cancelReservation(params.userInput);
                params.injectMessage(responseMsg);
                await new Promise(resolve => setTimeout(resolve, 3000));
                conversations.push({ content: responseMsg, isUser: false, timestamp: new Date().toISOString(), type: 'string' })
                conversationalLog()
                return "menu";
            }
        },
        unknown_input: {
            message: "Sorry, I do not understand your message 😢! If you require further assistance, you may click on " +
                "the given options.",
            options: currentSubMenu,
            path: async (params) => {
                conversations.push({
                    content: "Sorry, I do not understand your message 😢! If you require further assistance, you may click on " +
                        "the given options.", isUser: false, timestamp: new Date().toISOString(), type: 'string'
                }, { content: params.userInput, isUser: true, timestamp: new Date().toISOString(), type: 'string' })
                conversationalLog()
                if (currentSubMenu.includes(params.userInput)) {
                    setCurrentApartmentNo(params.userInput);
                    // await getListing(params.userInput);
                    await setVectorPath(params.userInput);
                    return 'menu';
                } else if (params.userInput == 'cancel' || params.userInput == 'Cancel') {
                    clearMessages();
                    return "start";
                } else {
                    return "unknown_input";
                }
            }
        },
        ask_query: {
            message: "Please ask your question",
            path: 'get_answer',
            chatDisabled: false,
        },
        get_answer: {
            // @ts-ignore
            message: async (params) => {
                if (botData['isOffline'] && (params.userInput === 'host' || params.userInput === 'Host')) {
                    const liveRoomData = {
                        botId: botData?.['_id'],
                        aptNo: selectedListId,
                        phoneNo: customerData.phone
                    }
                    handleAgentChat(liveRoomData, 'joinRoom');
                    setLiveAgentStates((prev) => ({...prev, isAgentMode: true}));
                    setPaths((prev) => [...prev, 'agent']);
                    // params.injectMessage("Waiting for an agent");
                    // await new Promise(resolve => setTimeout(resolve, 60000));
                    // console.log("isAgentAvailable",isAgentAvailable);
                    // if (isAgentAvailable) {
                    //     setPaths((prev) => [...prev, 'agent_chat']);
                    // } else {
                    //     params.injectMessage("No agents available at the moment, so please write your message and we'll come back to you.");
                    //     await new Promise(resolve => setTimeout(resolve, 1000));
                    //     setPaths((prev) => [...prev, 'agent_chat']);
                    // }
                } else {
                    const answer = await getAnswer(params.userInput);
                    conversations.push({ content: "Please ask your question", isUser: false, timestamp: new Date().toISOString(), type: 'string' }, { content: params.userInput, isUser: true, timestamp: new Date().toISOString(), type: 'string' }, { content: answer, isUser: false, timestamp: new Date().toISOString(), type: 'string' })
                    conversationalLog();
                    return answer;
                }
            },
            path: 'get_answer'
        },
        ask_phone: {
            message: 'Please enter your phone number',
            // @ts-ignore
            path: async (params) => {
                // conversations.push({ content: 'How many guests are there?', isUser: false, timestamp: new Date().toISOString(), type: 'string' }, { content: params.userInput, isUser: true, timestamp: new Date().toISOString(), type: 'string' })
                // conversationalLog()
                const isValid = await validate(params.userInput, 'number');
                if (isValid) {
                    setCustomerData((prevData) => ({...prevData, phone: params.userInput}));
                    const response = await CustomerService.getCustomer({phone: params.userInput, botId: botData?.['_id'], aptNo: selectedListId});
                    if (response.data?.['_id']) {
                        setCustomerData((prevData) => ({...prevData, id: response?.data?._id, phone: response?.data?.phone}));
                        socket.emit('customerOnline', {userId: response?.data?._id});
                        const oldMessages = response.data.conversations?.[0]?.messages || [];
                        if (oldMessages.length > 0) {
                            setMessages(oldMessages);
                            if (oldMessages[oldMessages.length - 1]['path']) {
                                setPaths((prev) => [...prev, oldMessages[oldMessages.length - 1]['path']]);
                            } else {
                                setPaths((prev) => [...prev, "ask_query"]);
                            }
                        } else {
                            return 'ask_query';
                        }
                    } else {
                        return 'offline_guest_name';
                    }
                } else {
                    params.injectMessage("Please enter only numbers");
                    // conversations.push({ content: "Please enter only numbers", isUser: false, timestamp: new Date().toISOString(), type: 'string' })
                    // conversationalLog()
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return 'ask_phone';

                }
            }
        },
        offline_guest_name: {
            message: "Please enter your name",
            path: async (params) => {
                // conversations.push({ content: "Please enter your name", isUser: false, timestamp: new Date().toISOString(), type: 'string' }, { content: params.userInput, isUser: true, timestamp: new Date().toISOString(), type: 'string' })
                // conversationalLog()
                setCustomerData((prevData) => ({...prevData, name: params.userInput}))
                return 'offline_guest_email'
            }
        },
        offline_guest_email: {
            message: "Please enter your email",
            path: async (params) => {
                const isValid = await validate(params.userInput, 'email');
                if (isValid) {
                    // conversations.push({ content: "Please enter your email", isUser: false, timestamp: new Date().toISOString(), type: 'string' }, { content: params.userInput, isUser: true, timestamp: new Date().toISOString(), type: 'string' })
                    // conversationalLog()
                    setCustomerData((prevData) => ({...prevData, email: params.userInput}))
                    return 'offile_guest_upload_id'
                } else {
                    params.injectMessage("Please enter valid email");
                    // conversations.push({ content: "Please enter valid email", isUser: false, timestamp: new Date().toISOString(), type: 'string' })
                    // conversationalLog()
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return 'offline_guest_email';

                }

            }
        },
        offile_guest_upload_id: {
			message: `Please upload image of your id`,
			chatDisabled: true,
			file: (params) => {
                // console.log(params.files?.['0']);
                setCustomerData((prevData) => ({...prevData, idProof: params.files?.['0']}))
            },
		},
        offline_error: {
            message: 'Something went wrong, please retry',
            path: 'ask_phone'
        },
        // offline_signature: {
        //     message: "Please enter your signature",
        //     path: async (params) => {
        //         setCustomerData((prevData) => ({...prevData, signature: params.userInput}));
        //         const formData = new FormData();
        //         formData.append('botId', botData['_id']);
        //         formData.append('aptName', currentApartmentNo);
        //         formData.append('aptNo', selectedListId);
        //         formData.append('name', customerData.name);
        //         formData.append('email', customerData.email);
        //         formData.append('phone', customerData.phone);
        //         formData.append('idProof', customerData.idProof);
        //         formData.append('signature', customerData.signature);

        //         const response = await CustomerService.addCustomer(formData);
        //         if (response.error) {
        //             params.injectMessage("Something went wrong, please retry");
        //             await new Promise(resolve => setTimeout(resolve, 1000));
        //             return 'ask_phone';
        //         } else {
        //             setCustomerData((prevData) => ({...prevData, id: response?.data?._id}));
        //             socket.emit('customerOnline', {userId: response?.data?._id});
        //             return 'ask_query'
        //         }

        //     }
        // },
        agent: {
            message: 'Waiting for a Customer support representative',
            path: "agent_unavailable",
            chatDisabled: true
        },
        agent_unavailable: {
            message: "No customer support representative available at the moment, so please write your message and we'll come back to you.",
            path: "agent_chat",
            transition: { duration: 2000 },
        },
        agent_chat: {
            message: "",
            path: async (params) => {
                const liveChatData = {
                    roomName: liveAgentStates.roomName,
                    message: {
                        content: params.userInput,
                        isUser: true,
                        timestamp: new Date().toISOString(),
                        type: 'string',
                        path: 'agent_chat'
                    },
                    userId: botData?.['userId'],
                    agent: liveAgentStates.isAgentAvailable
                }
                await handleAgentChat(liveChatData);
                if (liveAgentStates.isAgentAvailable) {
                    return 'agent_chat';
                } else {
                    params.injectMessage("Thanks, you can proceed with your other questions");
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return 'ask_query';
                }
            }
        }
    }

    const getListings = async () => {
        // @ts-ignore
        const { error, msg, data } = await HostawayService.getListings(hostwayToken);

        if (!error && data) {
            const aptArr = [];
            if (data.length > 0) {
                data.forEach(element => {
                    aptArr.push(element?.['internalListingName']);
                });
            }
            setCurrentSubMenu(aptArr);
        } else {
            alert(msg);
        }
    }

    // @ts-ignore
    const handleInputChange = (e) => {
        const textarea = e.target;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
        const getElement = document.getElementById('textAreaAdjustment');

        if (getElement) {
            getElement.addEventListener('input', handleInputChange);
            getElement.addEventListener('keyup', handleInputChange);

            return () => {
                getElement.removeEventListener('input', handleInputChange);
                getElement.removeEventListener('keyup', handleInputChange);
            };
        }
    };

    const conversationalLog = async () => {
        const data = {
            botId: botData['_id'],
            messages: conversations
        }
        const { msg, error } = await BotService.conversationallog(data)
        if (error) {
            conversations = []
        } else {
            conversations = []
        }
    }

    const updateMessage = async (data) => {
        if (data?.messages?.length > 0) {
            const filteredData = data?.messages?.filter(item => typeof item.content === 'string');
            data['messages'] = filteredData;
            const response = await CustomerService.saveMessages(data);
            console.log(response);
            // if (isInitialLoad === false) {
            // }
        }
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('aptName') !== null) {
            setCurrentApartmentNo(urlParams.get('aptName').replace(/\s+$/, ""));
            setVectorPath(urlParams.get('aptName').replace(/\s+$/, ""));
        }

        if (urlParams.get('aptNo') !== null) {
            setSelectedListId(urlParams.get('aptNo'));
        }
    }, [botData])

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        let id = undefined;
        if (urlParams) {
            id = urlParams.get('botId');
        }
        // @ts-ignore
        const idFromWindow = window.botId ? window.botId : id;

        // if (idFromWindow) {
        //   setBotData({ botId: idFromWindow });
        // }

        getBotData(idFromWindow);
        // getListings();
        setReservationPayload({
            channelId: 2000,
            listingMapId: 0,
            isManuallyChecked: 0,
            isInitial: 0,
            guestName: '',
            guestFirstName: '',
            guestLastName: '',
            guestZipCode: '',
            guestAddress: '',
            guestCity: '',
            guestCountry: '',
            guestEmail: '',
            numberOfGuests: 0,
            adults: 0,
            children: 0,
            infants: 0,
            pets: 0,
            arrivalDate: '',
            departureDate: '',
            checkInTime: null,
            checkOutTime: null,
            phone: '',
            isUpdate: false,
            roomTypeId: 0,
            ratePlanId: 0,
            price: 0
        });

        socket = socketIoClient(socketBaseURL);
        
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        const handleBeforeUnload = async (event) => {
            console.log("beforeunload event fired");
            // event.preventDefault();
            // api call
            await CustomerService.changeOnlineStatus({userId: customerData.id, status: false});
            event.returnValue = '';
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [customerData]);

    useEffect(() => {
        if (liveAgentStates.roomName !== '' && socket) {
            socket.on(liveAgentStates.roomName, (message) => {
                console.log(message);
            });

            socket.on('joined', (message) => {
                // console.log("message", message);
                setLiveAgentStates((prev) => ({...prev, isAgentAvailable: true}));
                setMessages((prev) => [...prev, message]);
                setPaths((prev) => ([...prev, "agent_chat"]));
            });

            socket.on('message', (message) => {
                console.log("message",message);
                setMessages((prev) => {
                    if (!prev.some(msg => msg.content === message.content && msg.isUser === message.isUser)) {
                        return [...prev, message];
                    }
                    return prev;
                });
                setPaths((prev) => ([...prev, "agent_chat"]));
            });
        }
        
    }, [liveAgentStates.roomName])
    
    useEffect(() => {
        if (messages.length > 0 && customerData.id !== null) {
            const postData = {
                botId: botData['_id'],
                customerId: customerData.id,
                aptNo: selectedListId,
                isOfflineBot: botData['isOffline'],
                messages: messages,
                isUnread: liveAgentStates.roomName === '' ? false : true,
                internalListingName: currentApartmentNo
            }
            updateMessage(postData);
        }
    },[messages]);


    const counterRef = useRef(liveAgentStates.counter);

    // @ts-ignore
    useEffect(() => {
        if (liveAgentStates.isAgentMode === true) {
            const intervalId = setInterval(() => {
                // Update the counter in the state and ref
                setLiveAgentStates((prev) => {
                    const newCounter = prev.counter + 1;
                    counterRef.current = newCounter;
                    return { ...prev, counter: newCounter };
                });
    
                // Check if the condition is met
                if (liveAgentStates.isAgentAvailable) {
                    console.log("Agent is available, stopping the timer.");
                    clearInterval(intervalId);
                    setPaths((prev) => [...prev, "agent_chat"]);
                } else if (counterRef.current >= 60) {
                    console.log("1 minute reached, stopping the timer.");
                    clearInterval(intervalId);
                    setPaths((prev) => [...prev, "agent_unavailable"]);
                } else {
                    console.log(`Timer running: ${counterRef.current} second(s)`);
                }
            }, 1000);
    
            // Cleanup on component unmount
            return () => clearInterval(intervalId);
        }
    }, [liveAgentStates.isAgentAvailable, liveAgentStates.isAgentMode]);

    
    useEffect(() => {
        console.log(customerData.idProof);
        const updateCustomerData = async () => {
            if (customerData.idProof !== '') {
                const formData = new FormData();
                formData.append('botId', botData['_id']);
                formData.append('aptName', currentApartmentNo);
                formData.append('aptNo', selectedListId);
                formData.append('name', customerData.name);
                formData.append('email', customerData.email);
                formData.append('phone', customerData.phone);
                formData.append('idProof', customerData.idProof);
                formData.append('signature', customerData.signature);
    
                const response = await CustomerService.addCustomer(formData);
                if (response.error) {
                    setPaths((prev) => [...prev, "offline_error"]);
                } else {
                    setCustomerData((prevData) => ({ ...prevData, id: response?.data?._id }));
                    socket.emit('customerOnline', { userId: response?.data?._id });
                    setTimeout(() => {
                        // alert('he')
                        setPaths((prev) => [...prev, "ask_query"]);
                    }, 1000);
                }
            }
        };
    
        updateCustomerData(); // Call the async function
    }, [customerData.idProof]);
    

    return (
        <div>
            {
                // @ts-ignore
                botData?.['_id'] && (
                    <MessagesContext.Provider value={{ messages: messages, setMessages: setMessages }}>
                        <PathsContext.Provider value={{paths: paths, setPaths: setPaths}}>
                            <div className='custom-height' id='textAreaAdjustment' onChange={handleInputChange} >
                                <ChatBot
                                    options={{
                                        // @ts-ignore
                                        header: { title: botData?.['title'] ? botData?.['title'] : "Chatbot" },
                                        footer: { text: 'Powered By Vinnovate Technologies' },
                                        advance: {
                                            useCustomPaths: true,
                                            useCustomMessages: true
                                        },
                                        theme: { embedded: true, primaryColor: "#051F5C", secondaryColor: "#051F5C" },
                                        botOptionStyle: {
                                            borderRadius: "5px",
                                            backgroundColor: "#EBECEC",
                                            color: "black",
                                            borderColor: "black"
                                        },
                                        botOptionHoveredStyle: {
                                            borderRadius: "5px",
                                        },
                                        botBubbleStyle: {
                                            borderRadius: "5px",
                                            backgroundColor: "#EBECEC",
                                            color: "black",
                                            borderColor: "black"
                                            // textAlign: "center",
                                            // justifyContent: "center",
                                            // width: "50%"
                                        },
                                        userBubbleStyle: {
                                            borderRadius: "5px",
                                        },
                                        // chatWindowStyle: {
                                        //     backgroundColor: "black"
                                        // }
                                    }}
                                    flow={flow}
                                />
                            </div>
                        </PathsContext.Provider>
                    </MessagesContext.Provider>
                )
            }
        </div>
    )
}

export default Bot;
