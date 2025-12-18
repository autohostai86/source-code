/* eslint-disable prettier/prettier */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */

// import { toJS } from "mobx";
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Button, Card, CardTitle, Input, Row, Col, CardBody, Container, FormGroup, Form, Label, FormFeedback } from 'reactstrap';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ChatBot, { MessagesContext } from "react-chatbotify";
import { useDropzone } from "react-dropzone";
// import TabPanel from '@mui/lab/TabPanel';
import useStore from '../../../../mobx/UseStore';
import uploadIcon from "../../../../assets/img/icons/common/cloud-computing.png";
import BotService from 'apps/client/src/services/BotService';
import { toJS } from 'mobx';
import "react-chatbotify/dist/react-chatbotify.css";
import QA from './QA';
import axios from 'axios';
import HostawayService from 'apps/client/src/services/HostawayService';
import { isNaN } from 'formik';
import propertyMenus from './propertyMenus';

import './index.scss';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const DragAndUpload: React.FC<{ handleDrop: any }> = ({ handleDrop }) => {
    const { UserState, UiState } = useStore();
    const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, inputRef } = useDropzone({
        onDrop: handleDrop,
        accept: "application/pdf",
    });

    //     reading current input from inputRef hook of react-dropzone
    const currentFile = UserState.currentFile ? UserState.currentFile : undefined;

    return (
        <div>
            <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />

                <div className="d-flex flex-column align-items-center w-50 m-auto">
                    <img src={uploadIcon} alt="upload" width="50%" />
                </div>
                <div className="d-flex flex-column align-items-center w-50 m-auto text-center text-dark">
                    <h6>
                        <strong>
                            Dran and Drop Files
                        </strong>
                    </h6>
                    <h6>
                        <strong>
                            Or
                        </strong>
                    </h6>

                    <h6>
                        <strong>
                            Browse
                        </strong>
                    </h6>

                    <br />
                    {currentFile && (
                        <>
                            <div>selected file</div>
                            <b>{currentFile.name}</b>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// eslint-disable-next-line arrow-body-style
const Edit: React.FC = () => {
    const { UserState, UiState } = useStore();
    const [activeIndex, setActiveIndex] = useState(0);
    const [value, setValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [genBtnLoading, setGenBtnLoading] = useState(false);
    const [scripts, setScripts] = useState([]);
    const [messages, setMessages] = useState([]);

    const [initialValues, setInitialValues] = useState({
        title: '',
        titleErrorMsg: '',
        message: '',
        messageErrorMsg: '',
    });

    const [dataSourceType, setDataSourceType] = useState('');
    const [currentProperty, setCurrentProperty] = useState('');

    const [currentSubMenu, setCurrentSubMenu] = useState([]);
    const [currentApartmentNo, setCurrentApartmentNo] = useState('');
    const [currentVectorPath, setCurrentVectorPath] = useState('');
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
    });

    const [currentListing, setCurrentListing] = useState<any>('');

    const [reservationId, setReservationId] = useState<any>('');

    const [isMobile,setIsMobile]=useState(false);

    const menu = ['Price Inquiry', 'Reservation', 'Q&A'];

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleInput = (e) => {

        if (e.target.name === 'title') {
            setInitialValues({ ...initialValues, title: e.target.value, titleErrorMsg: '' });
        }

        if (e.target.name === 'message') {
            setInitialValues({ ...initialValues, message: e.target.value, messageErrorMsg: '' });
        }
    }

    const getCurrentSubMenu = (currentApartment) => {
        const filtered = propertyMenus.apartmentMenu.filter((x) => x['property'] == currentApartment).map((x) => x['apartmentNo']);
        setCurrentSubMenu(filtered)
    }



    const handleDrop = (selectedFile) => {
        const currentSelectedFile = selectedFile[0];
        UserState.setCurrentFile(currentSelectedFile);
    };

    // @ts-ignore
    const createBot = async () => {
        if (initialValues.title === '') {
            setInitialValues({ ...initialValues, titleErrorMsg: 'Please enter the title' });
            return false;
        }

        if (initialValues.message === '') {
            setInitialValues({ ...initialValues, messageErrorMsg: 'Please enter the initial message' });
            return false;
        }

        setLoading(true);

        const postData = {
            title: initialValues.title,
            initialMessage: initialValues.message,
            userType: UserState.userData.userType,
            userId: UserState.userData.userId
        }

        const { error, msg, data } = await BotService.create(postData);

        if (!error) {
            UiState.notify(msg, 'success');
            UserState.setCurrentBotId(data['_id']);
            setActiveIndex(1);
        } else {
            UiState.notify('Oops something went wrong', 'error');
        }
        setLoading(false);

        // if (activeIndex === 0) {
        //     setActiveIndex(1);
        // } else {
        //     setActiveIndex(0);
        // }
    }


    // @ts-ignore
    const uploadDataSource = async () => {
        if (UserState.currentFile) {
            let apartment = currentApartmentNo;
            if (currentApartmentNo === 'Shriram (Luxury 1bhk close to wipro)') {
                apartment = currentApartmentNo.replace(/ /g, '_');
            }
            const formData = new FormData();
            formData.append('botId', UserState.currentBotId);
            formData.append('sources', UserState.currentFile);
            formData.append('apartment', apartment);
            // formData.append('test', 'dsd');
            setLoading(true);
            // @ts-ignore
            const { error, msg } = await BotService.addDataSource(formData, apartment);
            if (!error) {
                UiState.notify(msg, 'success');
                UserState.setCurrentFile(false);
                // setCurrentProperty([])
                // setCurrentApartmentNo('');
                setIsUploaded(true);
            } else {
                UiState.notify(msg, 'error');
            }
            setLoading(false);

        } else {
            UiState.notify('Please select a file', 'error');
            return false;
        }
    }


    // @ts-ignore
    const trainChatbot = async () => {
        if (UserState.currentBotId !== '') {
            setLoading(true);
            const { error, msg, data } = await BotService.trainBot({ botId: UserState.currentBotId });
            if (!error) {
                UserState.setCurrentBotData(data);
                UiState.notify(msg, 'success');
            } else {
                UiState.notify(msg, 'error');
            }
            setLoading(false);

        } else {
            UiState.notify('Could not get bot id', 'error');
            return false;
        }
    }
    // @ts-ignore
    const generateScript = async () => {
        if (UserState.currentBotId !== '') {
            setGenBtnLoading(true);
            const { error, msg, data } = await BotService.createScript({ botId: UserState.currentBotId });
            if (!error) {
                setScripts(data);
                UiState.notify(msg, 'success');
            } else {
                UiState.notify(msg, 'error');
            }
            setGenBtnLoading(false);

        } else {
            UiState.notify('Could not get bot id', 'error');
            return false;
        }
    }
    const getBotData = async () => {
        const { error, data } = await BotService.getBotsById({ botId: UserState.currentBotId });
        if (!error) {
            UserState.setCurrentBotData(data);
        }
    }

    const setVectorPath = (apartment) => {
        if (UserState.currentBotData?.['vectorPath'] && UserState.currentBotData?.['vectorPath'].length > 0) {
            const filtered = toJS(UserState.currentBotData?.['vectorPath']).filter((x) => x.apartment === apartment);
            if (filtered.length > 0) {
                console.log(filtered);
                setCurrentVectorPath(filtered[0]?.['path']);
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    const getAnswer = async (query) => {
        const { error, data, msg } = await BotService.chat({ sourcePath: currentVectorPath, question: query, botId: UserState.currentBotId });
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

    // hostway related api calls
    const encodeFormData = (data) => {
        const encoded = []
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const value = data[key]
                encoded.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            }
        }
        return encoded.join('&')
    }


    const generateToken = async () => {
        const formData = {
            grant_type: 'client_credentials',
            client_id: 38114,
            client_secret: 'dd0ec97d57ba16ed7574dc702cef56436b593ea20cdaf465c3dcdeb1126c3c5b',
            scope: 'general'
        }

        const encodedData = encodeFormData(formData)

        // Call the API with the headers
        await axios
            .post('https://api.hostaway.com/v1/accessTokens', encodedData)
            .then((response) => {
                const { access_token } = response.data

                if (access_token) {
                    setHostwayToken(access_token)
                }
            })
            .catch((err) => {
                console.log(`Error in getting token => error: ${err}`)
            })

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
            UiState.notify(msg, 'error');
            return false;
        }
    }

    const getPriceData = async () => {
        pricePayload['currentListingId'] = currentListing['id'];
        // @ts-ignore
        const { error, msg, data } = await HostawayService.getPrice(pricePayload, hostwayToken);
        let response = '';
        if (!error && data) {
            response = data;
            return response;
        } else {
            UiState.notify(msg, 'error');
            return msg;
        }
    }

    const makeReservation = async (isAvailabilityCheck = false, departureDate = '') => {
        if (isAvailabilityCheck) {
            reservationPayload.departureDate = departureDate;
        }
        reservationPayload.checkInTime = currentListing['checkInTimeStart'];
        reservationPayload.checkOutTime = currentListing['checkOutTime'];
        
        // @ts-ignore
        const { error, msg, data, unavailable, id } = await HostawayService.reservation(reservationPayload, hostwayToken, reservationId);
        let response = '';
        if (!error && data) {
            response = data;
            if (id) {
                setReservationId(id);
            }
            return { error: error, msg: response };
        } else {
            UiState.notify(msg, 'error');
            if (unavailable) {
                return { error: error, msg: msg, unavailable: unavailable };    
            } else {
                return { error: error, msg: msg };
            }
            
        }
    }

    const cancelReservation = async (id) => {
        const postData = {
            cancelledBy: 'guest',
            reservationId: id,
        }
        // @ts-ignore
        const { error, msg, data } = await HostawayService.cancelReservation(postData, hostwayToken);
        let response = '';
        
        if (!error && data) {
            response = data;
            return response;
        } else {
            UiState.notify(msg, 'error');
            return msg;
        }
    }

    // @ts-ignore
    const validate = async (value, type) => {
        if (type === 'date') {
            const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
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

    const clearMessages = () => {
        setMessages([]);
    }



    const flow = {
        start: {
            message: `${UserState.currentBotData?.['initialMessage'] ? UserState.currentBotData?.['initialMessage'] : "Hi, How may I help you 😊!"}`,
            path: "cancel",
            transition: { duration: 1000 },
        },
        cancel: {
            message: 'You can type "Cancel" anytime to start from the beginning',
            path: "apartment_menu",
            transition: { duration: 2000 },
        },
        // property_menu: {
        //     message: "Please Select a property",
        //     options: propertyMenus.propertyMenu,
        //     path: async (params) => {
        //         if (propertyMenus.propertyMenu.includes(params.userInput)) {
        //             // await filter(params.userInput);
        //             await getCurrentSubMenu(params.userInput);
        //             return 'apartment_menu';
        //         } else if (params.userInput == 'cancel' || params.userInput == 'Cancel')  {
        //             clearMessages();
        //             return "start";
        //         } else {
        //             return "unknown_input";
        //         }
        //     }
        // },
        apartment_menu: {
            message: "Please select the apartment",
            options: currentSubMenu,
            path: async (params) => {
                if (currentSubMenu.includes(params.userInput)) {
                    setCurrentApartmentNo(params.userInput);
                    await getListing(params.userInput);
                    await setVectorPath(params.userInput);
                    return 'menu';
                } else if (params.userInput == 'cancel' || params.userInput == 'Cancel')  {
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
            message: 'When are you planning to checkin? Ex: yyyy-mm-dd',
            // @ts-ignore
            path: async (params) => {
                // await generateToken();
                const isValid = await validate(params.userInput, 'date');
                if (isValid) {
                    setPricePayload({ ...pricePayload, startingDate: params.userInput })
                    return 'checkout';
                } else {
                    params.injectMessage("Please enter the date in required format, yyyy-mm-dd");
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return 'checkin';
                }
            }
        },
        checkout: {
            message: 'When are you planning to checkout? Ex: yyyy-mm-dd',
            // @ts-ignore
            path: async (params) => {
                // await generateToken();
                const isValid = await validate(params.userInput, 'date');
                if (isValid) {
                    setPricePayload({ ...pricePayload, endingDate: params.userInput })
                    return 'no_of_guests';
                } else {
                    params.injectMessage("Please enter the date in required format, yyyy-mm-dd");
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
                } else {
                    return "reservation";
                }
            }
        },

        reservation_arrival: {
            message: "Please enter date of arrival",
            path: async (params) => {
                const isValid = await validate(params.userInput, 'date');
                if (isValid) {
                    setReservationPayload({ ...reservationPayload, arrivalDate: params.userInput, listingMapId: currentListing['id'] });
                    return 'reservation_departure'
                } else {
                    params.injectMessage("Please enter the date in required format, yyyy-mm-dd");
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return 'reservation_arrival';

                }

            }
        },
        reservation_departure: {
            message: "Please enter date of departure",
            path: async (params) => {
                const isValid = await validate(params.userInput, 'date');
                if (isValid) {
                    setReservationPayload({ ...reservationPayload, departureDate: params.userInput });
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
                    params.injectMessage("Please enter the date in required format, yyyy-mm-dd");
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return 'reservation_departure';

                }
            }
        },
        // reservation_first_name: {
        //     message: "Please enter your first name",
        //     path: async (params) => {
        //         setReservationPayload({ ...reservationPayload, guestFirstName: params.userInput });
        //         return 'reservation_last_name'
        //     }
        // },
        // reservation_last_name: {
        //     message: "Please enter your last name",
        //     path: async (params) => {
        //         setReservationPayload({ ...reservationPayload, guestLastName: params.userInput, guestName:  `${reservationPayload.guestFirstName} ${params.userInput}` });
        //         return 'reservation_address'
        //     }
        // },
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
        // reservation_adult: {
        //     message: "Please enter the number of adults",
        //     path: async (params) => {
        //         const isValid = await validate(params.userInput, 'number');
        //         if (isValid) {
        //             setReservationPayload({ ...reservationPayload, adults: parseInt(params.userInput) });
        //             return 'reservation_children'
        //         } else {
        //             params.injectMessage("Please enter only numbers");
        //             await new Promise(resolve => setTimeout(resolve, 1000));
        //             return 'reservation_adult';

        //         }

        //     }
        // },
        // reservation_children: {
        //     message: "Please enter the number of children",
        //     path: async (params) => {
        //         const isValid = await validate(params.userInput, 'number');
        //         if (isValid) {
        //             setReservationPayload({ ...reservationPayload, children: parseInt(params.userInput) });
        //             return 'reservation_infant'
        //         } else {
        //             params.injectMessage("Please enter only numbers");
        //             await new Promise(resolve => setTimeout(resolve, 1000));
        //             return 'reservation_children';

        //         }

        //     }
        // },
        // reservation_infant: {
        //     message: "Please enter the number of infant",
        //     path: async (params) => {
        //         const isValid = await validate(params.userInput, 'number');
        //         if (isValid) {
        //             setReservationPayload({ ...reservationPayload, infants: parseInt(params.userInput) });
        //             return 'reservation_pet'
        //         } else {
        //             params.injectMessage("Please enter only numbers");
        //             await new Promise(resolve => setTimeout(resolve, 1000));
        //             return 'reservation_infant';

        //         }

        //     }
        // },
        // reservation_pet: {
        //     message: "Please enter the number of pets",
        //     path: async (params) => {
        //         const isValid = await validate(params.userInput, 'number');
        //         if (isValid) {
        //             setReservationPayload({ ...reservationPayload, pets: parseInt(params.userInput),numberOfGuests: reservationPayload.adults + reservationPayload.children + reservationPayload.infants + parseInt(params.userInput) });
        //             return 'hostaway_resevation'
        //         } else {
        //             params.injectMessage("Please enter only numbers");
        //             await new Promise(resolve => setTimeout(resolve, 1000));
        //             return 'reservation_pet';

        //         }

        //     }
        // },
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
                const isValid = await validate(params.userInput, 'number');
                if (isValid) {
                    setReservationId(params.userInput);
                    return "host_cancel_reservation";
                } else {
                    params.injectMessage("Please enter number only");
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return 'cancel_reservation';

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
        // chat
        unknown_input: {
            message: "Sorry, I do not understand your message 😢! If you require further assistance, you may click on " +
                "the given options.",
            options: currentSubMenu,
            path: async (params) => {
                if (currentSubMenu.includes(params.userInput)) {
                    setCurrentApartmentNo(params.userInput);
                    await getListing(params.userInput);
                    await setVectorPath(params.userInput);
                    return 'menu';
                } else if (params.userInput == 'cancel' || params.userInput == 'Cancel')  {
                    clearMessages();
                    return "start";
                } else {
                    return "unknown_input";
                }
            }
        },
        ask_query: {
            message: "Please ask your question",
            path: 'get_answer'
        },
        get_answer: {
            message: async (params) => {
                const answer = await getAnswer(params.userInput);
                return answer;
            },
            path: 'get_answer'
        },
        // re_ask: {
        //     message: "Do you want to more question?",
        //     options: ['Yes', 'No'],
        //     path: (params) => {
        //         if (params.userInput == 'Yes') {
        //             return 'ask_query';
        //         } else {
        //             return false
        //         }
        //     }
        // },
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
            UiState.notify(msg, 'error');
        }
    }

    const handleResize = () => {
        setIsMobile(window.innerWidth <= 470); // Adjust the breakpoint as needed
    };

    useEffect(() => {
        UserState.setCurrentFile(false);
        getBotData();
        setScripts([]);
        getListings();
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
            isUpdate: false
        });

    // Assuming the textarea has a class name or identifier, replace '.ChatBotClass' with the actual one

// Add event listener to window resize
window.addEventListener('resize', handleResize);

// Clean up the event listener when the component unmounts
return () => {
    window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if(value === 0) {
            UserState.setCurrentFile(false);
            getBotData();
            setScripts([]);
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
                isUpdate: false
            });
        }

        if (value === 1) {
            UserState.setCurrentFile(false);
            setDataSourceType('');
            setCurrentProperty('');
            setCurrentSubMenu([]);
            setCurrentApartmentNo('');
        }

    getListings();

    }, [value]);
    
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

    return (
        <>
            <Container fluid>
                <div className="header-body mt-5">
                    <Row>
                        <Col md={8} className='offset-md-2'>

                            <Card className='shadow  mb-5 bg-white'>
                                <CardBody>
                                    <Tabs
                                        // orientation="vertical"
                                        // variant="scrollable"
                                        value={value}
                                        onChange={handleChange}
                                        aria-label="Vertical tabs example"
                                        sx={{ borderRight: 1, borderColor: 'divider' }}
                                    >
                                        <Tab label="Chatbot" {...a11yProps(0)} />
                                        <Tab label="Data source" {...a11yProps(1)} />
                                        <Tab label="Share" {...a11yProps(2)} />

                                    </Tabs>
                                    <TabPanel value={value} index={0}>
                                        {
                                            UserState.currentBotData?.['_id'] && (
                                                <div className={isMobile ? 'custom-margin': ''}>
                                                    <MessagesContext.Provider value={{messages: messages, setMessages: setMessages}}>
                                                    <div className='custom-height' id='textAreaAdjustment' onChange={handleInputChange}>
                                                    <ChatBot
                                                        options={{
                                                            // @ts-ignore
                                                            header: { title: UserState.currentBotData?.['title'] ? UserState.currentBotData?.['title'] : "Chatbot" },
                                                            theme: { embedded: true },
                                                            footer: { text: 'Powered By Vinnovate Technologies' },
                                                            advance: {
                                                                useCustomMessages: true
                                                            }
                                                        }}
                                                        flow={flow}
                                                    />
                                                    </div>
                                                    </MessagesContext.Provider>
                                                </div>

                                            )
                                        }
                                    </TabPanel>
                                    <TabPanel value={value} index={1}>
                                        <div className='text-center mb-5'>
                                            <h1>Data Sources</h1>
                                            <h5>Add your data sources to train your chatbot</h5>
                                        </div>
                                        <div>
                                            <FormGroup className="mb-3">
                                                <Label>Data Source Type</Label>
                                                <Input
                                                    id="datasource"
                                                    name="select"
                                                    type="select"
                                                    value={dataSourceType}
                                                    onChange={(e) => setDataSourceType(e.target.value)}
                                                >
                                                    <option value="">Please choose a type</option>
                                                    <option value="File">File</option>
                                                    <option value="Q&A">Q&A</option>
                                                </Input>
                                            </FormGroup>
                                            {/* {
                                                dataSourceType === 'File' && (
                                                    <FormGroup className="mb-3">
                                                        <Label>Property</Label>
                                                        <Input
                                                            id="property"
                                                            name="peroptySelect"
                                                            type="select"
                                                            value={currentProperty}
                                                            onChange={(e) => {setCurrentProperty(e.target.value); getCurrentSubMenu(e.target.value)}}
                                                        >
                                                            <option value="">Please choose a prperty</option>
                                                            {
                                                                propertyMenus.propertyMenu.map((property) => (
                                                                    <option value={property}>{property}</option>
                                                                ))
                                                            }
                                                        </Input>
                                                    </FormGroup>
                                                )
                                            } */}
                                            {/* <FormGroup className="mb-3">
                                                <Label>Property</Label>
                                                <Input
                                                    id="property"
                                                    name="peroptySelect"
                                                    type="select"
                                                    value={currentProperty}
                                                    onChange={(e) => {setCurrentProperty(e.target.value); getCurrentSubMenu(e.target.value)}}
                                                >
                                                    <option value="">Please choose a property</option>
                                                    {
                                                        propertyMenus.propertyMenu.map((property) => (
                                                            <option value={property}>{property}</option>
                                                        ))
                                                    }
                                                </Input>
                                            </FormGroup> */}
                                            <FormGroup className="mb-3">
                                                        <Label>Apartment</Label>
                                                        <Input
                                                            id="apartment"
                                                            name="apartmentSelect"
                                                            type="select"
                                                            value={currentApartmentNo}
                                                            onChange={(e) => setCurrentApartmentNo(e.target.value)}
                                                        >
                                                            <option value="">Please choose a apartment</option>
                                                            {
                                                                currentSubMenu.map((apt) => (
                                                                    <option value={apt}>{apt}</option>
                                                                ))
                                                            }
                                                        </Input>
                                                    </FormGroup>
                                            {/* {
                                                currentProperty !== '' && (
                                                    <FormGroup className="mb-3">
                                                        <Label>Apartment</Label>
                                                        <Input
                                                            id="apartment"
                                                            name="apartmentSelect"
                                                            type="select"
                                                            value={currentApartmentNo}
                                                            onChange={(e) => setCurrentApartmentNo(e.target.value)}
                                                        >
                                                            <option value="">Please choose a apartment</option>
                                                            {
                                                                currentSubMenu.map((apt) => (
                                                                    <option value={apt}>{apt}</option>
                                                                ))
                                                            }
                                                        </Input>
                                                    </FormGroup>
                                                )
                                            } */}
                                            {
                                                dataSourceType === 'File' ? (
                                                    <>
                                                        <DragAndUpload handleDrop={handleDrop} />
                                                        <Col md={4} className='offset-md-4'>
                                                            <div className="text-center">
                                                                <Button className="my-4 w-100" color="default" type="button" onClick={uploadDataSource} disabled={loading}>
                                                                    <i className='fa fa-cloud-upload'></i> Upload
                                                                </Button>
                                                            </div>
                                                        </Col>
                                                    </>
                                                )
                                                    :
                                                    dataSourceType === 'Q&A' ? (
                                                        // @ts-ignore
                                                        <QA apartmentNo={currentApartmentNo} />
                                                    )
                                                        : null
                                            }

                                            
                                        </div>
                                    </TabPanel>
                                    <TabPanel value={value} index={2}>
                                        <div>
                                            <h5><sup className='text-red'>*</sup> We recommend you to retrain the chatbot if you have added any new data sources</h5>
                                            <Button className="my-4 " color="default" type="button" onClick={trainChatbot} disabled={loading}>
                                                {loading ? (<><i className='fa fa-refresh fa-spin'></i> <span>Train chatbot</span></>) : (<><i className='fa fa-refresh'></i> <span>Train chatbot</span></>)}
                                            </Button>
                                        </div>
                                        <div className='mt-3'>
                                            <h5>By clicking on the below button you'll get the script just copy and paste it on your website</h5>
                                            <Button className="my-4" outline color="default" type="button" onClick={generateScript} disabled={genBtnLoading}>
                                                {genBtnLoading ? (<><i className='fa fa-spinner fa-spin'></i> <span>Generating</span></>) : (<span>Get Script</span>)}
                                            </Button>
                                            <p className={scripts.length > 0 ? 'd-block' : 'd-none'}>Please copy the below script and paste on your website</p>
                                            <div className={scripts.length > 0 ? 'bg-light p-3 d-block' : 'd-none'}>
                                                {

                                                    scripts.length > 0 && scripts.map((item) => (

                                                        <p>{item}</p>

                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </TabPanel>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>


                </div>
            </Container>
        </>
    );
};
export default observer(Edit);
