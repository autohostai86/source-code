import React, { useState, useEffect } from 'react'
import BotService from '../../../services/BotService';
import ChatBot, { MessagesContext, PathsContext } from "react-chatbotify";
import "react-chatbotify/dist/react-chatbotify.css";
// import propertyMenus from './propertyMenus';
import HostawayService from '../../../services/HostawayService';
import "./index.scss";
import useStore from 'apps/client/src/mobx/UseStore';
import { observer } from 'mobx-react-lite';
import StayFlexiService from 'apps/client/src/services/StayFlexiService';
import { Card, CardBody, CardTitle, CardSubtitle, CardText, CardLink, Row, Col, Button, Input, Label } from 'reactstrap';
// @ts-ignore
const Bot = () => {
    const { UserState } = useStore();
    const [botData, setBotData] = useState(UserState.currentBotData);
    const [currentSubMenu, setCurrentSubMenu] = useState([]);
    const [currentApartmentNo, setCurrentApartmentNo] = useState('');
    const [currentVectorPath, setCurrentVectorPath] = useState('');
    const [messages, setMessages] = useState([]);
    const [hostwayToken, setHostwayToken] = useState('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzODExNCIsImp0aSI6IjJiZDYwZThjNmY5ODViYzJiZmMwY2JjOTRlNGQ4M2M3OTExMmI5Y2M5NmRiYzIzZDc1NmZkNzkzOGY4ODljNDVmZGE4YmVmYWI2YjczNDExIiwiaWF0IjoxNjk5MjUzMDUzLjkzMzUzOCwibmJmIjoxNjk5MjUzMDUzLjkzMzU0LCJleHAiOjIwMTQ4NzIyNTMuOTMzNTQ2LCJzdWIiOiIiLCJzY29wZXMiOlsiZ2VuZXJhbCJdLCJzZWNyZXRJZCI6MjI2MDd9.QM42Tr6LIAP6o21Lz44vO25zOoX4E54hWhHFx5MVqK9kJ-s-_7ZVrUeh-u7SeHYuAGQPwPfjCAjjyeujlvfu5wm6aEbk7yl2esk-MeQVZEFz-E1GdkuoCy3Sso6VM4g8XSjmRR8h7Zi2TnkCg7i2aaLBzD5nQnr7U5vxjeYozgo');
    
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
    const getBotData = async (idFromWindow) => {
        alert(idFromWindow)
        // @ts-ignore
        const { error, data } = await BotService.getBotsById({ botId: idFromWindow });
        if (!error) {
            setBotData(data);
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

    const getListing = async (apartNum) => {
        const reqData = {
            currentApartmentNo: apartNum
        }
        // @ts-ignore
        const { error, msg, data } = await HostawayService.getCurrentListing(reqData, hostwayToken);

        if (!error && data !== '') {
            setCurrentListing(data);
            return true;
        } else {
            return false;
        }
    }
    // @ts-ignore
    const getPriceData = async () => {
        if (UserState.currentPMS['pmsType'] === 'Hostaway') {
            pricePayload['currentListingId'] = currentListing['id'];
            // @ts-ignore
            const { error, msg, data } = await HostawayService.getPrice(pricePayload, UserState.currentPMS['accessToken']);
            let response = '';
            if (!error && data) {
                response = data;
                return response;
            } else {
                return msg;
            }
        } else if (UserState.currentPMS['pmsType'] === 'StayFlexi') {
            pricePayload['hotelId'] = UserState.selectedListing?.['hostawayListId'];
            // @ts-ignore
            const { error, msg, data } = await StayFlexiService.getPrice(pricePayload, UserState.currentPMS['accessToken']);
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
        if (UserState.currentPMS['pmsType'] === 'Hostaway') {
            if (isAvailabilityCheck) {
                reservationPayload.departureDate = departureDate;
            }
            reservationPayload.checkInTime = currentListing['checkInTimeStart'];
            reservationPayload.checkOutTime = currentListing['checkOutTime'];
            // @ts-ignore
            const { error, msg, data, unavailable, id } = await HostawayService.reservation(reservationPayload, UserState.currentPMS['accessToken'], reservationId);
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
        } else if (UserState.currentPMS['pmsType'] === 'StayFlexi') {
            const guestName = reservationPayload.guestName.split(' ');
            const postData = {
                checkin: reservationPayload.arrivalDate,
                checkout: reservationPayload.departureDate,
                hotelId: UserState.selectedListing['hostawayListId'],
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
            const { error, msg, data } = await StayFlexiService.reservation(postData, UserState.currentPMS['accessToken']);
            let response = '';
            if (!error && data) {
                return { error: error, msg: data };
            } else {
                return { error: error, msg: msg };
            }
            
        }

        
    }
    // @ts-ignore
    const cancelReservation = async (id) => {
        if (UserState.currentPMS['pmsType'] === 'Hostaway') {
            const postData = {
                cancelledBy: 'guest',
                reservationId: id,
            }
            // @ts-ignore
            const { error, msg, data } = await HostawayService.cancelReservation(postData, UserState.currentPMS['accessToken']);
            let response = '';
            
            if (!error && data) {
                response = data;
                return response;
            } else {
                return msg;
            }
        } else if (UserState.currentPMS['pmsType'] === 'StayFlexi') {
            const postData = {
                reservationId: id,
            }
            // @ts-ignore
            const { error, msg, data } = await StayFlexiService.cancelReservation(postData, UserState.currentPMS['accessToken']);
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
            if (UserState.currentPMS['pmsType'] === 'Hostaway') {
                dateFormat = /^\d{4}-\d{2}-\d{2}$/;
            }

            if (UserState.currentPMS['pmsType'] === 'StayFlexi') {
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

    // const getCurrentSubMenu = (currentApartment) => {
    //     const filtered = propertyMenus.apartmentMenu.filter((x) => x['property'] == currentApartment).map((x) => x['apartmentNo']);
    //     setCurrentSubMenu(filtered)
    // }

    const setVectorPath = (apartment) => {
        if (UserState.currentBotData?.['vectorPath'] && UserState.currentBotData?.['vectorPath'].length > 0) {
            const filtered = UserState.currentBotData?.['vectorPath'].filter((x) => x.apartment === apartment);
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

    const clearMessages = () => {
        setMessages([]);
    }

    /* get room details by hotel
    this function is only for stayflexi
    */
    const getRooms = async () => {
        // @ts-ignore
        const { error, data } = await StayFlexiService.getRoomsByHotel(UserState.currentPMS?.['accessToken'], UserState.selectedListing?.['hostawayListId']);
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
        const { error, data } = await StayFlexiService.getPriceByPlanId(postData,UserState.currentPMS?.['accessToken']);
        if (!error && data !== 0) {
            setReservationPayload({...reservationPayload, price: data});
            return true;
        } else {
            return false;
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
            path: "menu",
            transition: { duration: 2000 },
        },
        // apartment_menu: {
        //     message: "Please select the apartment",
        //     options: currentSubMenu,
        //     path: async (params) => {
        //         if (currentSubMenu.includes(params.userInput)) {
        //             setCurrentApartmentNo(params.userInput);
        //             await getListing(params.userInput);
        //             await setVectorPath(params.userInput);
        //             return 'menu';
        //         } else if (params.userInput == 'cancel' || params.userInput == 'Cancel')  {
        //             clearMessages();
        //             return "start";
        //         } else {
        //             return "unknown_input";
        //         }
        //     }
        // },
        menu: {
            message: "Please choose a option",
            options: menu,
            path: async (params) => {
                if (menu.includes(params.userInput)) {
                    // await generateToken();
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

                } else if (params.userInput == 'cancel' || params.userInput == 'Cancel')  {
                    clearMessages();
                    return "start";
                } else {
                    return "unknown_input";
                }
            }
        },
        checkin: {
            message: `${UserState.currentPMS['pmsType'] === 'Hostaway' ? 'When are you planning to checkin? Ex: yyyy-mm-dd' : 'When are you planning to checkin? Ex: dd-mm-yyyy HH:MM:SS'}`,
            // @ts-ignore
            path: async (params) => {
                // await generateToken();
                const isValid = await validate(params.userInput, 'date');
                if (isValid) {
                    setPricePayload({ ...pricePayload, startingDate: params.userInput })
                    return 'checkout';
                } else {
                    params.injectMessage(`${UserState.currentPMS['pmsType'] === 'Hostaway' ? "Please enter the date in required format, yyyy-mm-dd" : "Please enter the date in required format, dd-mm-yyyy HH:MM:SS"}`);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return 'checkin';
                }
            }
        },
        checkout: {
            message: `${UserState.currentPMS['pmsType'] === 'Hostaway' ? 'When are you planning to checkout? Ex: yyyy-mm-dd' : 'When are you planning to checkout? Ex: dd-mm-yyyy HH:MM:SS'}`,
            // @ts-ignore
            path: async (params) => {
                // await generateToken();
                const isValid = await validate(params.userInput, 'date');
                if (isValid) {
                    setPricePayload({ ...pricePayload, endingDate: params.userInput });
                    if (UserState.currentPMS['pmsType'] === 'Hostaway') {
                        return 'no_of_guests';
                    } else {
                        return 'hostaway'
                    }
                } else {
                    params.injectMessage(`${UserState.currentPMS['pmsType'] === 'Hostaway' ? "Please enter the date in required format, yyyy-mm-dd" : "Please enter the date in required format, dd-mm-yyyy HH:MM:SS"}`);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return 'checkout';

                }
            }
        },
        no_of_guests: {
            message: 'How many guests are there?',
            // @ts-ignore
            path: async (params) => {
                // await generateToken();
                const isValid = await validate(params.userInput, 'number');
                if (isValid) {
                    setPricePayload({ ...pricePayload, numberOfGuests: params.userInput })
                    return 'hostaway';
                } else {
                    params.injectMessage("Please enter only numbers");
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
                return "menu";
            }
        },
        reservation: {
            message: "Please choose a option",
            options: ["Make Reservation", "Cancel Reservation"],
            path: async (params) => {
                if (params.userInput == 'Make Reservation') {
                    return "reservation_arrival";
                } else if (params.userInput == 'Cancel Reservation') {
                    return "cancel_reservation";
                } else if (params.userInput == 'cancel' || params.userInput == 'Cancel')  {
                    clearMessages();
                    return "start";
                } else {
                    return "reservation";
                }
            }
        },
        reservation_arrival: {
            message: `${UserState.currentPMS['pmsType'] === 'Hostaway' ? 'Please enter date of arrival? Ex: yyyy-mm-dd' : 'Please enter date of arrival? Ex: dd-mm-yyyy HH:MM:SS'}`,
            path: async (params) => {
                const isValid = await validate(params.userInput, 'date');
                if (isValid) {
                    setReservationPayload({ ...reservationPayload, arrivalDate: params.userInput, listingMapId: UserState.selectedListing['hostawayListId'] });
                    return 'reservation_departure'
                } else {
                    params.injectMessage(`${UserState.currentPMS['pmsType'] === 'Hostaway' ? "Please enter the date in required format, yyyy-mm-dd" : "Please enter the date in required format, dd-mm-yyyy HH:MM:SS"}`);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return 'reservation_arrival';

                }

            }
        },
        reservation_departure: {
            message: `${UserState.currentPMS['pmsType'] === 'Hostaway' ? 'Please enter date of departure? Ex: yyyy-mm-dd' : 'Please enter date of departure? Ex: dd-mm-yyyy HH:MM:SS'}`,
            path: async (params) => {
                const isValid = await validate(params.userInput, 'date');
                if (isValid) {
                    setReservationPayload({ ...reservationPayload, departureDate: params.userInput });
                    if (UserState.currentPMS['pmsType'] === 'Hostaway') {
                        const responseMsg = await makeReservation(true, params.userInput);
                        params.injectMessage(responseMsg?.msg);
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        if (responseMsg?.unavailable) {
                            params.injectMessage('Please try with different dates');
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
                    params.injectMessage(`${UserState.currentPMS['pmsType'] === 'Hostaway' ? "Please enter the date in required format, yyyy-mm-dd" : "Please enter the date in required format, dd-mm-yyyy HH:MM:SS"}`);
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
                                                        hotelId: UserState.selectedListing?.['hostawayListId'],
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
                                                            setPaths(prev => [...prev, "reservation_guest_name"]);
                                                        }, 1000);
                                                    } else {
                                                        params.injectMessage('Could not get details about the plane you have choosed, please try again');
                                                        setTimeout(() => {
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
        // reservation_address: {
        //     message: "Please enter your street address",
        //     path: async (params) => {
        //         setReservationPayload({ ...reservationPayload, guestAddress: params.userInput });
        //         return 'reservation_city'
        //     }
        // },
        // reservation_city: {
        //     message: "Please enter your city",
        //     path: async (params) => {
        //         setReservationPayload({ ...reservationPayload, guestCity: params.userInput });
        //         return 'reservation_zip'
        //     }
        // },
        // reservation_zip: {
        //     message: "Please enter your zipcode",
        //     path: async (params) => {
        //         setReservationPayload({ ...reservationPayload, guestZipCode: params.userInput });
        //         return 'reservation_country'
        //     }
        // },
        // reservation_country: {
        //     message: "Please enter your country",
        //     path: async (params) => {
        //         setReservationPayload({ ...reservationPayload, guestCountry: params.userInput });
        //         return 'reservation_email'
        //     }
        // },
        reservation_guest_name: {
            message: "Please enter your name",
            path: async (params) => {
                setReservationPayload({ ...reservationPayload, guestName: params.userInput });
                return 'reservation_email'
            }
        },
        reservation_email: {
            message: "Please enter your email",
            path: async (params) => {
                const isValid = await validate(params.userInput, 'email');
                if (isValid) {
                    setReservationPayload({ ...reservationPayload, guestEmail: params.userInput });
                    return 'reservation_phone'
                } else {
                    params.injectMessage("Please enter valid email");
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return 'reservation_email';

                }

            }
        },
        reservation_phone: {
            message: "Please enter your phone number",
            path: async (params) => {
                const isValid = await validate(params.userInput, 'phone');
                if (isValid) {
                    setReservationPayload({ ...reservationPayload, phone: params.userInput });
                    return 'reservation_guest'
                } else {
                    params.injectMessage("Please enter valid phone number");
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return 'reservation_phone';

                }

            }
        },
        reservation_guest: {
            message: "Please enter the number of guest",
            path: async (params) => {
                const isValid = await validate(params.userInput, 'number');
                if (isValid) {
                    setReservationPayload({ ...reservationPayload, numberOfGuests: parseInt(params.userInput) });
                    return 'hostaway_resevation'
                } else {
                    params.injectMessage("Please enter only numbers");
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
                return "menu";
            }
        },
        cancel_reservation: {
            message: "Please enter your reservation id",
            path: async (params) => {
                if (UserState.currentPMS['pmsType'] === 'Hostaway') {
                    const isValid = await validate(params.userInput, 'number');
                    if (isValid) {
                        setReservationId(params.userInput);
                        return "host_cancel_reservation";
                    } else {
                        params.injectMessage("Please enter number only");
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
                return "menu";
            }
        },
        unknown_input: {
            message: "Sorry, I do not understand your message 😢! If you require further assistance, you may click on " +
                "the given options.",
            options: currentSubMenu,
            path: 'menu'
        },
        ask_query: {
            message: "Please ask your question",
            path: 'get_answer'
        },
        get_answer: {
            // @ts-ignore
            message: async (params) => {
                const answer = await getAnswer(params.userInput);
                return answer;
            },
            path: 'get_answer'
        },
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

    useEffect(() => {
        // getListings();
        setVectorPath(UserState?.selectedListing?.['internalListingName']);
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
      }, []);

      useEffect(() => {
        getRooms();
        setPaths(prev => [...prev, "start"]);
      }, [UserState.selectedListing])

    return (
        <div>
            {
                // @ts-ignore
                botData?.['_id'] && (
                    <MessagesContext.Provider value={{messages: messages, setMessages: setMessages}}>
                        <PathsContext.Provider value={{paths: paths, setPaths: setPaths}}>
                            <div className='custom-height' id='textAreaAdjustment' onChange={handleInputChange}>
                                <ChatBot
                                    options={{
                                        // @ts-ignore
                                        header: { title: botData?.['title'] ? botData?.['title'] : "Chatbot" },
                                        footer: { text: 'Powered By Vinnovate Technologies' },
                                        advance: {
                                            useCustomPaths: true,
                                            useCustomMessages: true
                                        },
                                        theme: {embedded: true, primaryColor: "#051F5C", secondaryColor: "#051F5C"},
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
                                        }
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

export default observer(Bot);
