/* eslint-disable prettier/prettier */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
// import { toJS } from "mobx";
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Button, Row, Col, Container, Input, InputGroup, InputGroupAddon, Card, CardHeader, CardBody } from 'reactstrap';
import moment from "moment";

import useStore from '../../../mobx/UseStore';
import HostawayService from '../../../services/HostawayService';
import BotService from '../../../services/BotService';

import './Index.css';
import MessageSkelaton from './MessageSkelaton';
import useAutosizeTextArea from '../../../components/hooks/useAutosizeTextArea';

import AI from "../../../assets/img/ai_robot.png";
import SendIcon from "../../../assets/img/Vector.png";
import SettingsService from 'apps/client/src/services/SettingsService';
import HostexService from 'apps/client/src/services/HostexService';
import StayFlexiService from 'apps/client/src/services/StayFlexiService';
import OfflineService from 'apps/client/src/services/OfflineService';
import { toJS } from 'mobx';

// eslint-disable-next-line arrow-body-style
const Index: React.FC = () => {
    const history = useHistory();
    const { UserState, UiState, SocketState } = useStore();

    const [activeIndex, setActiveIndex] = useState<any>(0);

    const [conversations, setConversations] = useState([]);
    const [convoIndex, setConvoIndex] = useState('');

    const [messageData, setMessageData] = useState({
        name: '',
        profilePic: '',
        messages: [],
        totalRecords: 0,
        conversationId: '',
        apartmentNo: ''
    });

    // const [hostwayToken, setHostwayToken] = useState('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzODExNCIsImp0aSI6IjJiZDYwZThjNmY5ODViYzJiZmMwY2JjOTRlNGQ4M2M3OTExMmI5Y2M5NmRiYzIzZDc1NmZkNzkzOGY4ODljNDVmZGE4YmVmYWI2YjczNDExIiwiaWF0IjoxNjk5MjUzMDUzLjkzMzUzOCwibmJmIjoxNjk5MjUzMDUzLjkzMzU0LCJleHAiOjIwMTQ4NzIyNTMuOTMzNTQ2LCJzdWIiOiIiLCJzY29wZXMiOlsiZ2VuZXJhbCJdLCJzZWNyZXRJZCI6MjI2MDd9.QM42Tr6LIAP6o21Lz44vO25zOoX4E54hWhHFx5MVqK9kJ-s-_7ZVrUeh-u7SeHYuAGQPwPfjCAjjyeujlvfu5wm6aEbk7yl2esk-MeQVZEFz-E1GdkuoCy3Sso6VM4g8XSjmRR8h7Zi2TnkCg7i2aaLBzD5nQnr7U5vxjeYozgo');

    const [reply, setReply] = useState('');

    const [suggestedReply, setSuggestedReply] = useState('');

    const [loading, setLoading] = useState(false);

    const [selectedTab, setSelectedTab] = useState('All');

    const [showReservation, setShowReservation] = useState(false);

    const [resevartionData, setResevervationData] = useState<any>({});


    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    useAutosizeTextArea(textAreaRef.current, reply);

    const [pagination, setPagination] = useState({
        limit: 10, //Maximum number of items in the list.
        offset: 0 //Number of items to skip from beginning of the list.
    });

    const [btnLoading, setBtnLoading] = useState({
        aiBtn: false,
        sendBtn: false,
        messageLoadBtn: false,
    });


    const getConversations = async () => {
        if(UserState.isOfflineStatus === "offline"){
            if (UserState.currentBotData?.listing?.length === 0) {
                UiState.notify('Please add the listing', 'error');
                return false;
            }

            const { error, data, msg } = await OfflineService.getConversationsByBotId({botId: UserState.currentBotData?.['_id']});
            if (!error) {
                if (data.length > 0) {
                    let filter = selectedTab === 'All' ? false : true;
                    if (filter === true) {
                        setConversations(data.filter((x) => x.isUnread === filter));
                    } else {
                        setConversations(data);    
                    }
                } else {
                    setConversations(data);
                }
            } else {
                UiState.notify(msg, 'error');
            }
        }
        

        if (UserState.currentPMS['pmsType'] === 'Hostaway') {
            if (conversations.length !== 0) {
                setPagination({ ...pagination, limit: parseInt(pagination.limit) + parseInt(10) });
            }
            setLoading(true);
            setBtnLoading({ ...btnLoading, messageLoadBtn: true });
            // @ts-ignore
            const { error, msg, data, count } = await HostawayService.fetchConversations(pagination, UserState.currentPMS['accessToken']);
            // const { error, msg, data, count } = await HostawayService.fetchReservations(pagination, UserState.currentPMS['accessToken']);

            if (!error && data) {
                setMessageData({ ...messageData, totalRecords: count });
                // console.log(toJS(UserState.currentBotData));
                if (UserState.currentBotData?.listing?.length > 0) {
                    const filteredInboxItems = data
                    .map((message) => {
                        const matchedListing = UserState.currentBotData?.listing.find(
                        (list) => list.hostawayListId === message.listingMapId
                        );
                        if (matchedListing) {
                        return {
                            ...message,
                            internalListingName: matchedListing.internalListingName,
                        };
                        }
                        return null; // No match, exclude this item
                    })
                    .filter(Boolean);
                    if (filteredInboxItems.length > 0) {
                        const sortedArr = filteredInboxItems.sort((a, b) => {
                            // For each item, get the latest between sent and received
                            const getLatestTimestamp = (item) => {
                                const sent = new Date(item.messageSentOn);
                                const received = new Date(item.messageReceivedOn);
                                return sent > received ? sent : received;
                            };

                            // Sort in descending order (latest first)
                            return getLatestTimestamp(b) - getLatestTimestamp(a);
                        });
                        console.log(sortedArr);
                        setConversations(sortedArr);
                    } else {
                        setConversations(filteredInboxItems);
                    }
                    
                } else {
                    setConversations(data);
                }
            } else {
                UiState.notify(msg, 'error');
            }
            setBtnLoading({ ...btnLoading, messageLoadBtn: false });
            setLoading(false);
        }

        if (UserState.currentPMS['pmsType'] === 'Hostex') {
            if (conversations.length !== 0) {
                setPagination({ ...pagination, limit: parseInt(pagination.limit) + parseInt(10) });
            }
            setLoading(true);
            setBtnLoading({ ...btnLoading, messageLoadBtn: true });
            // @ts-ignore
            const { error, msg, data, count } = await HostexService.fetchReservations(pagination, UserState.currentPMS['accessToken']);

            if (!error && data) {
                setMessageData({ ...messageData, totalRecords: count });
            } else {
                UiState.notify(msg, 'error');
            }
            setBtnLoading({ ...btnLoading, messageLoadBtn: false });
            setLoading(false);
        }

        if (UserState.currentPMS['pmsType'] === 'StayFlexi') {
            setLoading(true);
            if (UserState.currentBotData?.listing?.length > 0) {
                const messagesArr = [];
                for (const listing of UserState.currentBotData?.listing) {
                    console.log(listing.hostawayListId);
                    const { error, data } = await StayFlexiService.fetchConversations(28593, UserState.currentPMS['accessToken']);
                    if (!error) {
                        let dataArr = typeof data === 'string' ? JSON.parse(data) : data;
                        dataArr.forEach(item => {
                            item.hotelId = listing.hostawayListId; // Mutate directly
                            messagesArr.push(item); // Add to the final array
                        });
                    }
                }
                setMessageData({ ...messageData, totalRecords: messagesArr.length });
                
                setConversations(messagesArr);
            } else {
                UiState.notify("It seems you haven't imported the listing yet. Please make sure to do so before proceeding.", "error");
            }
            
            setLoading(false);
        }
    }

    const getMessages = async (id, name='', profile='', apartmentNo='', messages = []) => {
        if (UserState.currentPMS['pmsType'] === 'Hostaway') {
            const params = {
                // reservationId: id
                conversationId: id
            }
            // @ts-ignore
            // const { error, msg, data, conversationId } = await HostawayService.fetchMessagesByReservation(params, UserState.currentPMS['accessToken']);
            const { error, msg, data } = await HostawayService.fetchMessages(params, UserState.currentPMS['accessToken']);
            // alert(conversationId);
            if (!error && data) {
                setReply('');
                setMessageData({ ...messageData, messages: data.reverse(), name: name, profilePic: profile, conversationId: id, apartmentNo: apartmentNo });
            } else {
                UiState.notify(msg, 'error');
            }
        }

        if (UserState.currentPMS['pmsType'] === 'StayFlexi') {
            const postData = {
                hotelId: apartmentNo,
                threadId: id 
            }
            const { error, data } = await StayFlexiService.fetchMessages(postData, UserState.currentPMS['accessToken']);
            if (!error && data) {
                setReply('');
                let dataArr = data;
                if (typeof dataArr === 'string') {
                    dataArr = JSON.parse(dataArr);
                    console.log(dataArr);
                }
                setMessageData({ ...messageData, messages: dataArr, name: name, profilePic: profile, conversationId: id, apartmentNo: apartmentNo });
            } else {
                UiState.notify(msg, 'error');
            }
        }

        if (UserState.isOfflineStatus === 'offline') {
            // setMessageData((prev) => ({ ...prev, messages: messages, name: name, profilePic: '', conversationId: id, apartmentNo: apartmentNo }));
            setMessageData({
                ...messageData, // Preserve other fields
                messages: messages, // Directly reassign messages
                name: name,
                profilePic: '',
                conversationId: id,
                apartmentNo: apartmentNo,
            });
        }
    }

    const getAnswer = async () => {
        let questions = '';
        if (UserState.currentPMS['pmsType'] === 'StayFlexi') {
            questions = messageData.messages?.[messageData.messages.length - 1]?.content;
        } else if (UserState.currentPMS['pmsType'] === 'Hostaway') {
            // for (const message of messageData.messages) {
            //     if (message.isIncoming === 0) {
            //         questions = '';
            //     }
    
            //     if (message.isIncoming === 1) {
            //         if (questions === '') {
            //             questions = message?.['body'];
            //         } else {
            //             questions = questions + ',' + message?.['body'];
            //         }
            //     }
            // }
            questions = messageData.messages[messageData.messages.length - 1]?.body;
        } else if (UserState.isOfflineStatus === 'offline') {
            if (messageData.messages.length > 0) {
                const latestIsUserFalse = messageData.messages.reverse().find(msg => msg.isUser);
                if (latestIsUserFalse['content']) {
                    questions = latestIsUserFalse['content'];
                }
            }
        }
        // console.log(questions);

        // const filtered = messageData.messages.filter((x) => x['isIncoming'] === 1);

        // const latestMessage = filtered[filtered.length - 1]['body'];
        const postData = {
            question: questions,
            apartmentNo: UserState.currentPMS['pmsType'] === 'StayFlexi' ? 'Soul At Home Electronic City Neeladri Road' : messageData.apartmentNo,
            userId: UserState.userData.userId
        }

        setBtnLoading({ ...btnLoading, aiBtn: true });

        const { error, data, msg } = await BotService.generateAIResponse(postData);
        if (!error) {
            if (data) {
                setReply(data?.['text']);
            } else {
                UiState.notify(msg, 'error');
            }
        } else {
            UiState.notify(msg, 'error');
        }
        setBtnLoading({ ...btnLoading, aiBtn: false });
    }

    const send = async () => {
        if (reply === '') {
            UiState.notify('Please enter the message', 'error');
            return false;
        }
        
        if (UserState.isOfflineStatus === 'offline') {
            const liveChatData = {
                roomName: `${UserState.currentBotData?.['_id']}_${conversations[convoIndex]?.['aptNo']}_${conversations[convoIndex]?.['customerId']?.['phone']}`,
                message: {
                    content: reply,
                    isUser: false,
                    timestamp: new Date().toISOString(),
                    type: 'string',
                    path: 'agent_chat'
                },
                to: conversations[convoIndex]?.['customerId']?.['_id']
            }

            await handleAgentChat(liveChatData);
            setReply('');
        }

        if (UserState.currentPMS['pmsType'] === 'Hostaway') {
            const phoneRegex = /(\+?\d{1,3}[\s.-]?)?(\(?\d{2,4}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{4}/g;
            if (reply.match(phoneRegex)) {
                UiState.notify('According to Airbnb policy, phone numbers are not allowed in messages. Please remove any phone numbers before sending.', 'error');
                return false;
            }
            const postData = {
                conversationId: messageData.conversationId,
                body: reply,
                communicationType: "channel"
            }

            setBtnLoading({ ...btnLoading, sendBtn: true });
            await BotService.updateMessageCount({ botId: UserState.currentBotData?.["_id"] });
            // @ts-ignore
            const { error, msg, data } = await HostawayService.sendMessage(postData, UserState.currentPMS['accessToken']);

            if (!error && data) {
                setReply('');
                const params = {
                    conversationId: messageData.conversationId
                }
                // @ts-ignore
                const { error, msg, data } = await HostawayService.fetchMessages(params, UserState.currentPMS['accessToken']);

                if (!error && data) {
                    setReply('');
                    setMessageData({ ...messageData, messages: data.reverse() });
                } else {
                    UiState.notify(msg, 'error');
                }
            } else {
                UiState.notify(msg, 'error');
            }
            setBtnLoading({ ...btnLoading, sendBtn: false });
        }

        if (UserState.currentPMS['pmsType'] === 'StayFlexi') {
            const postData = {
                threadId: messageData.conversationId,
                message: reply,
                hotelId: 28593
            }

            setBtnLoading({ ...btnLoading, sendBtn: true });
            // @ts-ignore
            const { error, msg } = await StayFlexiService.sendMessage(postData, UserState.currentPMS['accessToken']);

            if (!error) {
                setReply('');
                const postData = {
                    hotelId: 28593,
                    threadId: messageData.conversationId
                }
                // @ts-ignore
                const { error, msg, data } = await StayFlexiService.fetchMessages(postData, UserState.currentPMS['accessToken']);
                
                if (!error && data) {
                    setReply('');
                    let dataArr = data;
                    if (typeof dataArr === 'string') {
                        dataArr = JSON.parse(dataArr);
                    }
                    setMessageData({ ...messageData, messages: dataArr });
                } else {
                    UiState.notify(msg, 'error');
                }
            } else {
                UiState.notify(msg, 'error');
            }
            setBtnLoading({ ...btnLoading, sendBtn: false });
        }
    }

    const updateNotification = async () => {
        const { error, msg } = await BotService.markNotificationAsRead();
        if (!error) {
            await UserState.getNotifications();
        }
    }

    const getSettings = async () => {
        UserState.setCurrentPMS({});
        const params = `?userId=${UserState.userData.userId}`;
        const { error, msg, data } = await SettingsService.getSetting(params);
        if (!error) {
            UserState.setCurrentPMS(data);
        }
    }

    const getBotByUserId = async () => {
        UserState.setCurrentBotData({});
        const { error, data } = await BotService.getBotsByUserId({ userId: UserState.userData.userId });
        if (!error) {
            UserState.setIsOfflineStatus(data?.[0]?.['isOffline'] === true ? "offline" : "")
            UserState.setCurrentBotData(data[0]);
        }
    }

    const handleAgentChat = (reqData, type = 'liveRoomMessage') => {
        if (type === 'joinRoom') {
            SocketState.socket.emit('liveRoom', { botId: reqData['botId'], aptNo: reqData['aptNo'], phoneNumber: reqData['phoneNo'], userName: reqData['userName'] });
        } else {
            SocketState.socket.emit('liveRoomMessage', { roomName: reqData['roomName'], message: reqData['message'], to: reqData['to'] });
        }
    }

    const markAsRead = async (id) => {
        const { error, msg } = await OfflineService.updateMessageAsRead({ id: id });
        if (error) {
            UiState.notify(msg, 'error');
        }
    }

    useEffect(() => {
        UserState.setNotificationCount(0);
        if (UserState.isOfflineStatus === '') {
            getSettings();
        }
        getBotByUserId();
        setTimeout(() => {
            if (UserState.currentBotData?.['listing'].length > 0) {
                getConversations();
            } else {
                UiState.notify('Please import the listings', 'error');
            }
        }, 1000);
        updateNotification();

        // const handleResize = () => {
        //     setIsMobile(window.innerWidth <= 470); // Adjust the breakpoint as needed
        // };

        // // Add event listener to window resize
        // window.addEventListener('resize', handleResize);

        // // Clean up the event listener when the component unmounts
        // return () => {
        //     window.removeEventListener('resize', handleResize);
        // };
        
    }, []);
    
    /* refresh records when a new message arrived
    this is specifically for offline module
    */
    useEffect(() => {
        if (UserState.isOfflineStatus === "offline" && UserState.notificationCount > 0) {
            getConversations();
        }
    },[UserState.notificationCount])


    useEffect(() => {
        getConversations();
    }, [selectedTab])

    useEffect(() => {
        console.log('Socket connected:', SocketState.socket.connected); // Should print true if connected
    
        SocketState.socket.on('connect', () => {
            console.log('Socket connected');
        });
        
        SocketState.socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        // socket events for chatting
        SocketState.socket.on('message', (newMessage) => {
            setMessageData((prev) => ({ 
                ...prev, 
                messages: [...prev.messages, newMessage]
            }));
        });
    
        return () => {
            SocketState.socket.off('connect');
            SocketState.socket.off('disconnect');
        };
    }, []);

    useEffect(() => {
        if (conversations.length > 0) {
            if (UserState.currentPMS?.['pmsType'] === 'StayFlexi') {
                getMessages(conversations[0]?.['threadId'], conversations[0]?.['userName'], '', conversations[0]?.['hotelId']); 
                setActiveIndex(0);
            } else if (UserState.isOfflineStatus === 'offline') {
                if (UserState.notificationCount === 0) {
                    setReply('');
                    // setMessageData({ ...messageData, messages: conversations[0]?.messages, name: conversations[0]?.['customerId']?.['name'], profilePic: '', conversationId: conversations[0]?.['_id'], apartmentNo: conversations[0]?.['aptNo'] });
                    const liveRoomData = {
                        botId: UserState.currentBotData?.['_id'],
                        aptNo: conversations[0]?.['aptNo'],
                        phoneNo: conversations[0]?.['customerId']?.['phone'],
                        userName: UserState.userData.name
                    }
                    handleAgentChat(liveRoomData, 'joinRoom');
                    markAsRead(conversations[0]?.['_id']);
                    setShowReservation(false);
                    setActiveIndex(0);
                }
            } else if (UserState.currentPMS?.['pmsType'] === 'Hostaway') {
                getMessages(conversations[0]?.['id'], conversations[0]?.['recipientName'], conversations[0]?.['recipientPicture'], conversations[0]?.['internalListingName']);
                setResevervationData(conversations[0]?.['Reservation']);
                setShowReservation(true);
                setActiveIndex(0);
            } else {
                getMessages(conversations[0]?.['id'], conversations[0]?.['guestName'], conversations[0]?.['guestPicture'], conversations[0]?.['listingName']); 
                setResevervationData(conversations[0]);
                setShowReservation(true);
                setActiveIndex(0);
            }
        }
    }, [conversations]);

    useEffect(() => {
        if (UserState.isOfflineStatus === 'offline') {
            setReply('');
            // setMessageData({ ...messageData, messages: conversations[activeIndex-1]?.messages, name: conversations[activeIndex-1]?.['customerId']?.['name'], profilePic: '', conversationId: conversations[activeIndex-1]?.['_id'], apartmentNo: conversations[activeIndex-1]?.['aptNo'] });
            const liveRoomData = {
                botId: UserState.currentBotData?.['_id'],
                aptNo: conversations[convoIndex]?.['aptNo'],
                phoneNo: conversations[convoIndex]?.['customerId']?.['phone'],
                userName: UserState.userData.name
            }
            handleAgentChat(liveRoomData, 'joinRoom');
            markAsRead(conversations[convoIndex]?.['_id']);
            setShowReservation(false);
        }
    }, [convoIndex]);

    const textArea = (e) => {
        e.target.style.height = 'auto'
        let scHeight = e.target.scrollHeight;
        e.target.style.top = `${e.target.offsetTop - e.target.scrollHeight}px`;
        e.target.style.height = `${scHeight}px`;
    };

    const chatEndRef = useRef(null);
    const chatEndRefMob = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        chatEndRefMob.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messageData.messages]);

    return (
        <>
            <Container fluid={UiState.isMobile ? false : true}>
                <div className={UiState.isDesktop ? 'header-body mt-3' : ''}>
                    {
                        UiState.isDesktop ? (
                            <>
                                {/* <Row className='mb-5'>
                                <Col>
                                    <h2>Inbox</h2>
                                </Col>
                            </Row> */}
                                <div className="card">
                                    <div className="row g-0">
                                        <div className="col-12 col-lg-3 col-xl-3 border-right chat-list">
                                            {
                                                UserState.currentPMS['pmsType'] !== 'StayFlexi' && (

                                                    <><div className="tab-container">
                                                        <div
                                                            className={`tab ${selectedTab === 'All' ? 'selected' : ''}`}
                                                            onClick={() => setSelectedTab('All')}
                                                        >
                                                            All
                                                        </div>
                                                        <div
                                                            className={`tab ${selectedTab === 'Unread' ? 'selected' : ''}`}
                                                            onClick={() => setSelectedTab('Unread')}
                                                        >
                                                            Unread
                                                        </div>
                                                        {/* <div className="delete-button" onClick={() => { } }>
                                                            🗑️
                                                        </div> */}
                                                    </div><>
                                                            <Input placeholder="Search" style={{ width: "97%", marginLeft: "2%", marginTop: "5px" }} />
                                                        </></>
                                                )
                                            }
                                            {
                                                loading && (
                                                    <MessageSkelaton cards={10} />
                                                )
                                            }

                                            {
                                                conversations.length > 0 && conversations.map((item, index) => (
                                                    <a 
                                                        href="#/"
                                                        onClick={(e) => { 
                                                                e.preventDefault();
                                                                if (UserState.currentPMS?.['pmsType'] === 'StayFlexi') {
                                                                    getMessages(item?.['threadId'], item?.['userName'], '', item?.['hotelId']);
                                                                    setActiveIndex(index);    
                                                                } else if (UserState.isOfflineStatus === 'offline') {
                                                                    markAsRead(item?.['_id']);
                                                                    setActiveIndex(index);
                                                                    setConvoIndex(index);
                                                                    getMessages(item?.['_id'], item?.['customerId']?.['name'], item?.['guestPicture'], item?.['internalListingName'], item?.['messages']);
                                                                    setShowReservation(false);
                                                                } else if (UserState.currentPMS?.['pmsType'] === 'Hostaway') {
                                                                    getMessages(item?.['id'], item?.['recipientName'], item?.['recipientPicture'], item?.['internalListingName']);
                                                                    setActiveIndex(index);
                                                                    setResevervationData(item['Reservation'] ? item['Reservation'] : {});
                                                                    setShowReservation(true);
                                                                } else {
                                                                    getMessages(item?.['id'], item?.['guestName'], item?.['guestPicture'], item?.['listingName']);
                                                                    setActiveIndex(index);
                                                                    setResevervationData(item);
                                                                    setShowReservation(true);
                                                                }
                                                            }
                                                        }
                                                        className="list-group-item list-group-item-action border-0 custom-bg"
                                                        key={index}
                                                    >
                                                        {/* <div className="badge bg-success float-right">{item?.['hasUnreadMessages']}</div> */}
                                                        <div className={activeIndex === index ? `d-flex align-items-start msg-card active` : `d-flex align-items-start msg-card`}>
                                                            {
                                                                UserState.currentPMS['pmsType'] === 'StayFlexi' ? (
                                                                    <div className="rounded-circle mr-1" style={{ width: '40px', height: '40px', backgroundColor: '#2c2c2d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: "#fff" }}>
                                                                        <span>{item?.['userName']?.charAt(0)}</span>
                                                                    </div>
                                                                ) : UserState.isOfflineStatus === 'offline' ? (
                                                                    <>
                                                                    <div className="rounded-circle mr-1" style={{ width: '40px', height: '40px', backgroundColor: '#2c2c2d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: "#fff" }}>
                                                                        <span>{item?.['customerId']?.['name']?.charAt(0)}</span>
                                                                    </div>
                                                                    </>
                                                                ) : UserState.currentPMS['pmsType'] === 'Hostaway' ? (
                                                                    item?.['recipientPicture'] ? (
                                                                        <img src={item?.['recipientPicture']} className="rounded-circle mr-1" alt={item?.['recipientName']} width="40" height="40" onError={(e) => { e.target.onerror = null; e.target.src = `https://via.placeholder.com/40?text=${item?.['recipientName']?.charAt(0)}` }} />
                                                                    ) : (
                                                                        <div className="rounded-circle mr-1" style={{ width: '40px', height: '40px', backgroundColor: '#2c2c2d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: "#fff" }}>
                                                                            <span>{item?.['recipientName']?.charAt(0)}</span>
                                                                        </div>
                                                                    )
                                                                ) : (
                                                                    item?.['guestPicture'] ? (
                                                                        <img src={item?.['guestPicture']} className="rounded-circle mr-1" alt={item?.['guestName']} width="40" height="40" onError={(e) => { e.target.onerror = null; e.target.src = `https://via.placeholder.com/40?text=${item?.['guestName']?.charAt(0)}` }} />
                                                                    ) : (
                                                                        <div className="rounded-circle mr-1" style={{ width: '40px', height: '40px', backgroundColor: '#2c2c2d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: "#fff" }}>
                                                                            <span>{item?.['guestName']?.charAt(0)}</span>
                                                                        </div>
                                                                    )
                                                                )
                                                            }
                                                            <div className="flex-grow-1 ml-3">
                                                                <div className='custom-flex'>
                                                                    <h4 className='txt-black text-capitalize'>{UserState.currentPMS?.['pmsType'] === 'StayFlexi' ? item?.['userName'] : UserState.isOfflineStatus === 'offline' ? item?.['customerId']?.['name'] : UserState.currentPMS['pmsType'] === 'Hostaway' ?  item?.['recipientName'] : item?.['guestName']}</h4>
                                                                    <p>{UserState.currentPMS?.['pmsType'] === 'StayFlexi' ? moment(item?.['newCreatedAt']).format('MMM DD') : UserState.isOfflineStatus === 'offline' ? moment(item?.['updatedAt']).format('MMM DD') : moment(item?.['latestActivityOn']).format('MMM DD')}</p>
                                                                </div>
                                                                <div className="small">
                                                                    <div className='custom-flex'>
                                                                        {
                                                                            UserState.currentPMS?.['pmsType'] === 'StayFlexi' ? (
                                                                                <p className='ellipsis'>{item?.['lastMessage']}</p>
                                                                            ) : UserState.isOfflineStatus === "offline" ? (
                                                                                <p className='ellipsis'>{item?.['messages']?.[item?.['messages'].length - 1]?.['content']}</p>
                                                                            ) : UserState.isOfflineStatus === 'offline' ? null : (
                                                                                <p className='txt-black font-weight-100'>{moment(item?.['arrivalDate']).format("DD MMM YY")} - {moment(item?.['departureDate']).format("DD MMM YY")}</p>
                                                                            )
                                                                        }
                                                                        {
                                                                            UserState.currentPMS?.['pmsType'] !== 'StayFlexi' && item?.['paymentStatus'] === 'Paid' && (
                                                                                <p><i className='fa fa-check-circle-o text-success'></i></p>
                                                                            )
                                                                        }
                                                                        {
                                                                            (UserState.isOfflineStatus === 'offline' && item.isUnread === true && index !== 0) && (
                                                                                <i class="fa fa-circle fa-2x" style={{ color: "#051E5C"}}></i>
                                                                            ) 
                                                                        }
                                                                        
                                                                    </div>
                                                                    <div className='custom-flex'>
                                                                        <p className='txt-black font-weight-bold listing'>{item?.['internalListingName']}</p>
                                                                        {/* <div className='custom-txt-holder'>
                                                                            <p>{moment(item?.['updatedOn']).fromNow()}</p>
                                                                        </div> */}
                                                                        <div className={item['Reservation']?.['status']} id='status-holder'>
                                                                            {
                                                                                item['Reservation']?.['status'] === 'inquiry' ? (
                                                                                    <p><i className='fa fa-comment-o'></i> {item['Reservation']?.['status']}</p>
                                                                                ) : item['Reservation']?.['status'] === 'cancelled' ? (
                                                                                    <p><i className='fa fa-times'></i> {item['Reservation']?.['status']}</p>
                                                                                ) : item['Reservation']?.['status'] === 'inquiryNotPossible' ? (
                                                                                    <p><i className='fa fa-times'></i> Expired</p>
                                                                                ) : null
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    {/* <p className='text-overflow'>{item?.['conversationMessages']?.[0]?.['body']}</p> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </a>
                                                ))
                                            }
                                            {/* </InfiniteScroll> */}
                                            <hr className="d-block d-lg-none mt-1 mb-0" />
                                            {
                                                (conversations.length > 0 && conversations.length < messageData['totalRecords']) && (
                                                    <Button color='primary' className='load-btn' onClick={getConversations} disabled={btnLoading.messageLoadBtn}>{btnLoading.messageLoadBtn ? (<span><i className='fa fa-spinner fa-spin'></i> Loading</span>) : 'Load More'}</Button>
                                                )
                                            }
                                        </div>
                                        <div className={showReservation === true && UserState.currentPMS?.['pmsType'] !== 'StayFlexi'  ? "col-12 col-lg-6 col-xl-6" : "col-12 col-lg-9 col-xl-9"}>
                                            <div className="py-2 px-4 border-bottom d-none d-lg-block">
                                                {
                                                    messageData?.messages?.length > 0 && (
                                                        <div className="d-flex align-items-center py-1">
                                                            <div className="flex-grow-1 pl-3">
                                                                <strong>{messageData.name}</strong>
                                                            </div>
                                                            {
                                                                (UserState.currentPMS?.['pmsType'] !== 'StayFlexi' && UserState.isOfflineStatus !== 'offline') && (
                                                                    <div className="flex-grow-3 pl-3">
                                                                        <Button style={{ backgroundColor: '#051E5C', color: 'white' }} onClick={() => setShowReservation(!showReservation)}>Details</Button>
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                    )
                                                }
                                            </div>

                                            {
                                                messageData?.messages?.length > 0 && (
                                                    <>
                                                        <div className="position-relative">
                                                            <div className="chat-container">
                                                                <div className="chat-messages p-4">
                                                                    {
                                                                        messageData.messages.length > 0 && messageData.messages.map((message, index) => (
                                                                            // <div className={
                                                                            //     (UserState.isOfflineStatus === 'offline' && message?.['isUser'] === false) 
                                                                            //         ? 'chat-message-right pb-4' // Priority for offline and bot condition
                                                                            //         : (message?.['isIncoming'] === 1 || message?.['userName'] !== messageData.name) 
                                                                            //         ? 'chat-message-left pb-4'   // Apply left alignment for other conditions
                                                                            //         : 'chat-message-right pb-4'  // Default to right alignment
                                                                            // }
                                                                            <div className={
                                                                                UserState.isOfflineStatus === 'offline' && message['isUser'] === false ? 'chat-message-right pb-4' : UserState.isOfflineStatus === 'offline' && message['isUser'] === true ? 'chat-message-left pb-4' 
                                                                                : (UserState.currentPMS?.['pmsType'] === "Hostaway" && message['isIncoming'] === 1) ? 'chat-message-left pb-4' : 'chat-message-right pb-4'
                                                                            }
                                                                                style={{ width: "75%" }}
                                                                            >
                                                                                <div className='mr-2'>
                                                                                    {
                                                                                        UserState.currentPMS?.['pmsType'] === 'StayFlexi' ? (
                                                                                            <div className="rounded-circle mr-1" style={{ width: '40px', height: '40px', backgroundColor: '#2c2c2d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: "#fff" }}>
                                                                                                <span>{messageData.name?.charAt(0)}</span>
                                                                                            </div>
                                                                                        ) : (UserState.isOfflineStatus === 'offline' && message.isUser === true) ? (
                                                                                            <div className="rounded-circle mr-1" style={{ width: '40px', height: '40px', backgroundColor: '#2c2c2d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: "#fff" }}>
                                                                                                <span>{messageData.name?.charAt(0)}</span>
                                                                                            </div>
                                                                                        ) : message?.['isIncoming'] === 1 ? (
                                                                                                messageData.profilePic ? (
                                                                                                    <img src={messageData.profilePic} className="rounded-circle mr-1" alt={messageData.name} width="40" height="40" onError={(e) => { e.target.onerror = null; e.target.src = `https://via.placeholder.com/40?text=${messageData.name?.charAt(0)}` }} />
                                                                                                ) : (
                                                                                                    <div className="rounded-circle mr-1" style={{ width: '40px', height: '40px', backgroundColor: '#2c2c2d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: "#fff" }}>
                                                                                                        <span>{messageData.name?.charAt(0)}</span>
                                                                                                    </div>
                                                                                                )
                                                                                            ) : (
                                                                                                <img src='https://bootdey.com/img/Content/avatar/avatar1.png' className="rounded-circle mr-1" alt={messageData.name} width="40" height="40" />
                                                                                            )
                                                                                    }
                                                                                    <div className="text-muted small text-nowrap mt-2">{moment(message?.['updatedOn']).format('hh mm A')}</div>
                                                                                </div>
                                                                                <div className={message?.['isIncoming'] === 1 || message?.['isUser'] === true ? 'flex-shrink-1 rounded py-2 px-3 mr-3 custom-msg-bg-gray' : 'flex-shrink-1 rounded py-2 px-3 mr-3 custom-msg-bg-blue'}>
                                                                                    <div className="font-weight-bold mb-1">
                                                                                        {(message['isIncoming'] && message['isIncoming'] === 1) ? (
                                                                                            <>
                                                                                            {messageData.name} <span className='text-muted'>(Guest)</span>
                                                                                            </>
                                                                                        ) : (message['userName'] && message['userName'] !== 'Soul At Home Chandapura') ? (
                                                                                            messageData.name
                                                                                        ) : (message['isUser'] && message['isUser'] === true) ? (
                                                                                            <>
                                                                                            {messageData.name } <span className='text-muted'>(Guest)</span>
                                                                                            </>
                                                                                        ) : (
                                                                                            'You'
                                                                                        )}
                                                                                    </div>

                                                                                    <div style={{whiteSpace: "pre-wrap"}}>
                                                                                        {
                                                                                            UserState.currentPMS?.['pmsType'] === 'StayFlexi' ? message?.['content'] : (UserState.isOfflineStatus === 'offline' && typeof message?.['content'] === 'string') ? message?.['content'] : message?.['body']
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ))
                                                                    }
                                                                    <div ref={chatEndRef} />
                                                                </div>
                                                                <div className="input-section mt-3 mb-3">
                                                                    {/* <div className='row'>
                                                                        <div className="col-md-12">
                                                                            <Card onClick={() =>}>
                                                                                <CardHeader className='card-header'>
                                                                                    <div className='custom-flex'>
                                                                                        <p>AutoHost AI</p>
                                                                                        <a href="#" target="_blank" rel="noopener noreferrer">
                                                                                            <i className='fa fa-times'></i>
                                                                                        </a>
                                                                                    </div>
                                                                                </CardHeader>
                                                                                <CardBody>{suggestedReply}</CardBody>
                                                                            </Card>
                                                                        </div>
                                                                    </div> */}
                                                                    <div className="row">
                                                                        <div className="col-md-9">
                                                                            <textarea
                                                                                type="text"
                                                                                className="form-control"
                                                                                placeholder="Type your message"
                                                                                value={reply} onChange={(e) => setReply(e.target.value)}
                                                                                ref={textAreaRef}
                                                                                rows={1}
                                                                            ></textarea>
                                                                        </div>
                                                                        
                                                                        <div className="col-md-3">
                                                                            {
                                                                                UserState.isOfflineStatus === "" && (
                                                                                    <button className='btn custom-btn' onClick={getAnswer} disabled={btnLoading.aiBtn}>
                                                                                        {
                                                                                            btnLoading.aiBtn ? (
                                                                                                <i className='fa fa-spinner fa-spin'></i>
                                                                                            ) : (
                                                                                                <img src={AI} alt="ai logo" />
                                                                                            )
                                                                                        }
                                                                                    </button>
                                                                                )
                                                                            }
                                                                            <button className='btn custom-btn' onClick={send} disabled={btnLoading.sendBtn}>
                                                                                {
                                                                                    btnLoading.sendBtn ? (
                                                                                        <i className='fa fa-spinner fa-spin'></i>
                                                                                    ) : (
                                                                                        <img src={SendIcon} alt="send icon" />
                                                                                    )
                                                                                }
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )
                                            }

                                        </div>
                                        {
                                            (UserState.currentPMS?.['pmsType'] !== 'StayFlexi' && showReservation) && (
                                                <div className="col-12 col-lg-3 col-xl-3 custom-border">
                                                    <div className='mt-4'>
                                                        <h3><strong>Reservation</strong></h3>
                                                    </div>
                                                    <div>
                                                        <div className="d-flex align-items-center py-1">
                                                            <div className="flex-grow-1">
                                                                <p>Listing</p>
                                                            </div>
                                                        </div> 
                                                        <div className={`d-flex align-items-start`}>
                                                            <img src="https://chat.hostai.app/_next/image?url=https%3A%2F%2Fhostaway-platform.s3.us-west-2.amazonaws.com%2Flisting%2F38114-205503--o2U4-1xeT0A6IUapCXNY26ALUjNzTBOPMtd9KmpHvk-65329ef46ea64&w=96&q=75" className="rounded-circle mr-1" alt="Vanessa Tucker" width="40" height="40" />
                                                            <div className="flex-grow-1 ml-3">
                                                                <h4 className='txt-black'>{conversations?.[activeIndex]?.['internalListingName']}</h4>
                                                                <div className="small">
                                                                    <p className='txt-black font-weight-100'>{resevartionData?.['address']}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='row'>
                                                            <div className="col-lg-6 col-md-6 col-sm-6">
                                                                <div>
                                                                    <p>Check in</p>
                                                                    <div class="time-holder">
                                                                        <p>{resevartionData['arrivalDate'] ? moment(resevartionData['arrivalDate']).format('DD MMM, YYYY') : null}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6 col-md-6 col-sm-6">
                                                                <div className='mr-2'>
                                                                    <p>Check out</p>
                                                                    <div class="time-holder">
                                                                        <p>{resevartionData['departureDate'] ? moment(resevartionData['departureDate']).format('DD MMM, YYYY') : null}</p>
                                                                    </div>
                                                                </div>  
                                                            </div>
                                                        </div>
                                                        <div className='row'>
                                                            <div className="col-lg-6 col-md-6 col-sm-6">
                                                                <div>
                                                                    <p>Nights</p>
                                                                    <p>{resevartionData?.['nights']}</p>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6 col-md-6 col-sm-6">
                                                                <div className='cus-mr-2'>
                                                                    <p>Status</p>
                                                                    <p>{resevartionData?.['status']}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='row'>
                                                            <div className="col-lg-6 col-md-6 col-sm-6">
                                                                <div>
                                                                    <p>Guests</p>
                                                                    <p>{resevartionData?.['numberOfGuests']}</p>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6 col-md-6 col-sm-6">
                                                                <div className='cus-mr-2'>
                                                                    <p>Channel</p>
                                                                    <p>{resevartionData?.['channelName']}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className='row'>
                                                            <div className="col-lg-6 col-md-6 col-sm-6">
                                                                <div>
                                                                    <p>Total price</p>
                                                                    <p>{resevartionData?.['totalPrice']} {resevartionData?.['currency']} </p>
                                                                </div>
                                                                
                                                            </div>
                                                            <div className="col-lg-6 col-md-6 col-sm-6">
                                                                <div className='mr-5'>
                                                                    <p>Payment status</p>
                                                                    <p>{resevartionData?.['paymentStatus']}</p>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            </>
                        ) :
                        (
                            // <div className="card p-2">
                            <div className="row g-0 justify-content-center" style={(activeIndex === 1 || activeIndex === 2) ? {display: "unset"} : null}>
                                {
                                    (activeIndex === 0 && UserState.currentPMS?.['pmsType'] !== 'StayFlexi') && (
                                        <>
                                        <div className="tab-container text-center">
                                            <div
                                                className={`tab ${selectedTab === 'All' ? 'selected' : ''}`}
                                                onClick={() => setSelectedTab('All')}
                                            >
                                                All
                                            </div>
                                            <div
                                                className={`tab ${selectedTab === 'Unread' ? 'selected' : ''}`}
                                                onClick={() => setSelectedTab('Unread')}
                                            >
                                                Unread
                                            </div>
                                            {/* <div className="delete-button" onClick={() => {}}>
                                                🗑️
                                            </div> */}
                                        </div>
                                        <Input placeholder="Search" style={{width: "90%", marginLeft: "2%", marginTop: "5px"}} />
                                        </>
                                    )
                                }
                                {
                                    activeIndex === 0 && (
                                        <div className="col-12 col-lg-5 col-xl-3 border-right chat-list">
                                            {
                                                conversations.length > 0 && conversations.map((item, index) => (
                                                    <a 
                                                        href="#/"
                                                        onClick={
                                                            (e) => { 
                                                                e.preventDefault();
                                                                setActiveIndex(1);
                                                                if (UserState.currentPMS?.['pmsType'] === 'StayFlexi') {
                                                                    getMessages(item?.['threadId'], item?.['userName'], '', item?.['hotelId']);
                                                                } else if (UserState.isOfflineStatus === 'offline') {
                                                                    markAsRead(item?.['_id']);
                                                                    setConvoIndex(index);
                                                                    getMessages(item?.['_id'], item?.['customerId']?.['name'], item?.['guestPicture'], item?.['internalListingName'], item?.['messages']);
                                                                } else if (UserState.currentPMS?.['pmsType'] === 'Hostaway') {
                                                                    getMessages(item?.['id'], item?.['recipientName'], item?.['recipientPicture'], item?.['internalListingName']);
                                                                    setResevervationData(item['Reservation'] ? item['Reservation'] : {});
                                                                } else {
                                                                    getMessages(item?.['id'], item?.['guestName'], item?.['guestPicture'], item?.['listingName']);
                                                                }
                                                            }
                                                        }
                                                        className="list-group-item list-group-item-action border-0 custom-bg"
                                                        key={index}
                                                    >
                                                        {/* <div className="badge bg-success float-right">{item?.['hasUnreadMessages']}</div> */}
                                                        <div className="d-flex align-items-start msg-card">
                                                            {
                                                                UserState.currentPMS?.['pmsType'] === 'StayFlexi' ? (
                                                                    <div className="rounded-circle mr-1" style={{ width: '40px', height: '40px', backgroundColor: '#2c2c2d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: "#fff" }}>
                                                                        <span>{item?.['userName']?.charAt(0)}</span>
                                                                    </div>
                                                                ) : UserState.isOfflineStatus === 'offline' ? (
                                                                    <>
                                                                    <div className="rounded-circle mr-1" style={{ width: '40px', height: '40px', backgroundColor: '#2c2c2d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: "#fff" }}>
                                                                        <span>{item?.['customerId']?.['name']?.charAt(0)}</span>
                                                                    </div>
                                                                    </>
                                                                ) : UserState.currentPMS['pmsType'] === 'Hostaway' ? (
                                                                    item?.['recipientPicture'] ? (
                                                                        <img src={item?.['recipientPicture']} className="rounded-circle mr-1" alt={item?.['recipientName']} width="40" height="40" onError={(e) => { e.target.onerror = null; e.target.src = `https://via.placeholder.com/40?text=${item?.['recipientName']?.charAt(0)}` }} />
                                                                    ) : (
                                                                        <div className="rounded-circle mr-1" style={{ width: '40px', height: '40px', backgroundColor: '#2c2c2d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: "#fff" }}>
                                                                            <span>{item?.['recipientName']?.charAt(0)}</span>
                                                                        </div>
                                                                    )
                                                                ) :
                                                                item?.['guestPicture'] ? (
                                                                    <img src={item?.['guestPicture']} className="rounded-circle mr-1" alt={item?.['guestName']} width="40" height="40" onError={(e) => { e.target.onerror = null; e.target.src = `https://via.placeholder.com/40?text=${item?.['guestName']?.charAt(0)}` }} />
                                                                ) : (
                                                                    <div className="rounded-circle mr-1" style={{ width: '40px', height: '40px', backgroundColor: '#2c2c2d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: "#fff" }}>
                                                                        <span>{item?.['guestName']?.charAt(0)}</span>
                                                                    </div>
                                                                )
                                                            }
                                                            {/* <img src={item?.['guestPicture']} className="rounded-circle mr-1" alt="Vanessa Tucker" width="40" height="40" /> */}
                                                            <div className="flex-grow-1 ml-3">
                                                                <div className='custom-flex'>
                                                                    <h4 className='txt-black'>{UserState.currentPMS?.['pmsType'] === 'StayFlexi' ? item?.['userName'] : UserState.isOfflineStatus === 'offline' ? item?.['customerId']?.['name'] :  UserState.currentPMS['pmsType'] === 'Hostaway' ?  item?.['recipientName'] : item?.['guestName']}</h4>
                                                                    <p>{UserState.currentPMS?.['pmsType'] === 'StayFlexi' ? moment(item?.['newCreatedAt']).format('MMM DD') : UserState.isOfflineStatus === 'offline' ? moment(item?.['updatedAt']).format('MMM DD') : moment(item?.['latestActivityOn']).format('MMM DD')}</p>
                                                                </div>
                                                                <div className="small">
                                                                    <div className='custom-flex'>
                                                                        {
                                                                            UserState.currentPMS?.['pmsType'] === 'StayFlexi' ? (
                                                                                <p className='ellipsis'>{item?.['lastMessage']}</p>
                                                                            ) : UserState.isOfflineStatus === "offline" ? (
                                                                                <p className='ellipsis'>{item?.['messages']?.[item?.['messages'].length - 1]?.['content']}</p>
                                                                            ) : (
                                                                                <p className='txt-black font-weight-100'>{moment(item?.['arrivalDate']).format("DD MMM YY")} - {moment(item?.['departureDate']).format("DD MMM YY")}</p>
                                                                            )
                                                                        }
                                                                        {
                                                                            UserState.currentPMS?.['pmsType'] !== 'StayFlexi' && item?.['paymentStatus'] === 'Paid' && (
                                                                                <p><i className='fa fa-check-circle-o text-success'></i></p>
                                                                            )
                                                                        }
                                                                        {
                                                                            (UserState.isOfflineStatus === 'offline' && item.isUnread === true ) && (
                                                                                <i class="fa fa-circle fa-2x" style={{ color: "#051E5C"}}></i>
                                                                            ) 
                                                                        }
                                                                        
                                                                    </div>
                                                                    <div className='custom-flex'>
                                                                        <p className='txt-black font-weight-bold listing'>{item?.['internalListingName']}</p>
                                                                        {/* <div className='custom-txt-holder'>
                                                                            <p>{moment(item?.['updatedOn']).fromNow()}</p>
                                                                        </div> */}
                                                                        <div className={item['Reservation']?.['status']} id='status-holder'>
                                                                            {
                                                                                item['Reservation']?.['status'] === 'inquiry' ? (
                                                                                    <p><i className='fa fa-comment-o'></i> {item['Reservation']?.['status']}</p>
                                                                                ) : item['Reservation']?.['status'] === 'cancelled' ? (
                                                                                    <p><i className='fa fa-times'></i> {item['Reservation']?.['status']}</p>
                                                                                ) : item['Reservation']?.['status'] === 'inquiryNotPossible' ? (
                                                                                    <p><i className='fa fa-times'></i> Expired</p>
                                                                                ) : null
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </a>
                                                ))
                                            }
                                            <hr className="d-block d-lg-none mt-1 mb-0" />
                                            {
                                                (conversations.length > 0 && conversations.length < messageData['totalRecords']) && (
                                                    <Button color='primary' className='load-btn' onClick={getConversations} disabled={btnLoading.messageLoadBtn} style={{ top: "-5rem" }}>{btnLoading.messageLoadBtn ? (<span><i className='fa fa-spinner fa-spin'></i> Loading</span>) : 'Load More'}</Button>
                                                )
                                            }
                                        </div>
                                    )
                                }
                                {
                                    activeIndex === 1 && (
                                        <>
                                            <div className="custom-flex" style={{alignItems: 'center', marginBottom: "5px"}}>
                                                <Button onClick={() => setActiveIndex(0)} className='custom-btn'>
                                                    <i className='fa fa-arrow-left fa-2x'></i>
                                                </Button>
                                                <strong style={{marginRight: "15px"}}>{messageData.name}</strong>
                                                {
                                                    (UserState.currentPMS?.['pmsType'] !== 'StayFlexi' && UserState.isOfflineStatus !== 'offline') && (
                                                        <Button className='btn-sm' style={{ backgroundColor: '#051E5C', color: 'white' }} onClick={() => {setShowReservation(true); setActiveIndex(2)}}>Details</Button>
                                                    )
                                                }
                                            </div>
                                            <div className="col-12 col-lg-7 col-xl-9">
                                                <div className="py-2 px-4 border-bottom d-none d-lg-block">
                                                    {
                                                        messageData.messages.length > 0 && (
                                                            <div className="d-flex align-items-center py-1">
                                                                <div className="position-relative">
                                                                    <img src={messageData.profilePic} className="rounded-circle mr-1" alt="Sharon Lessman" width="40" height="40" />
                                                                </div>
                                                                <div className="flex-grow-1 pl-3">
                                                                    <strong>{messageData.name}</strong>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                                {
                                                    messageData?.messages?.length > 0 && (
                                                        <>
                                                            <div className="position-relative" style={{height: "65vh", overflowY: "scroll"}}>
                                                                <div className="chat-messages p-4">

                                                                    {
                                                                        messageData.messages.length > 0 && messageData.messages.map((message, index) => (
                                                                            // <div className={
                                                                            //     (UserState.isOfflineStatus === 'offline' && message?.['isUser'] === false) 
                                                                            //         ? 'chat-message-right pb-4' // Priority for offline and bot condition
                                                                            //         : (message?.['isIncoming'] === 1 || message?.['userName'] !== 'Soul At Home Chandapura') 
                                                                            //         ? 'chat-message-left pb-4'   // Apply left alignment for other conditions
                                                                            //         : 'chat-message-right pb-4'  // Default to right alignment
                                                                            // }>
                                                                            <div className={
                                                                                UserState.isOfflineStatus === 'offline' && message['isUser'] === false ? 'chat-message-right pb-4' : UserState.isOfflineStatus === 'offline' && message['isUser'] === true ? 'chat-message-left pb-4' 
                                                                                : (UserState.currentPMS?.['pmsType'] === "Hostaway" && message['isIncoming'] === 1) ? 'chat-message-left pb-4' : 'chat-message-right pb-4'
                                                                            }>
                                                                                <div className='mr-2'>
                                                                                    {/* <img src={message?.['isIncoming'] === 1 ? messageData.profilePic : 'https://bootdey.com/img/Content/avatar/avatar1.png'} className="rounded-circle mr-1" alt="Chris Wood" width="40" height="40" /> */}
                                                                                    {
                                                                                        UserState.currentPMS?.['pmsType'] === 'StayFlexi' ? (
                                                                                            <div className="rounded-circle mr-1" style={{ width: '40px', height: '40px', backgroundColor: '#2c2c2d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: "#fff" }}>
                                                                                                <span>{messageData.name?.charAt(0)}</span>
                                                                                            </div>
                                                                                        ) : (UserState.isOfflineStatus === 'offline' && message.isUser === true) ? (
                                                                                            <div className="rounded-circle mr-1" style={{ width: '40px', height: '40px', backgroundColor: '#2c2c2d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: "#fff" }}>
                                                                                                <span>{messageData.name?.charAt(0)}</span>
                                                                                            </div>
                                                                                        ) :
                                                                                        message?.['isIncoming'] === 1 ? (
                                                                                            messageData.profilePic ? (
                                                                                                <img src={messageData.profilePic} className="rounded-circle mr-1" alt={messageData.name} width="40" height="40" onError={(e) => { e.target.onerror = null; e.target.src = `https://via.placeholder.com/40?text=${messageData.name?.charAt(0)}` }} />
                                                                                            ) : (
                                                                                                <div className="rounded-circle mr-1" style={{ width: '40px', height: '40px', backgroundColor: '#2c2c2d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: "#fff" }}>
                                                                                                    <span>{messageData.name?.charAt(0)}</span>
                                                                                                </div>
                                                                                            )
                                                                                            
                                                                                        ) : (
                                                                                            <img src='https://bootdey.com/img/Content/avatar/avatar1.png' className="rounded-circle mr-1" alt={messageData.name} width="40" height="40" />
                                                                                        )
                                                                                    }
                                                                                    <div className="text-muted small text-nowrap mt-2">{moment(message?.['updatedOn']).format('hh mm A')}</div>
                                                                                </div>
                                                                                <div className={message?.['isIncoming'] === 1 ? 'flex-shrink-1 rounded py-2 px-3 mr-3 custom-msg-bg-gray' : 'flex-shrink-1 rounded py-2 px-3 mr-3 custom-msg-bg-blue'}>
                                                                                    <div className="font-weight-bold mb-1">
                                                                                        {(message['isIncoming'] && message['isIncoming'] === 1) ? (
                                                                                            <>
                                                                                            {messageData.name} <span className='text-muted'>(Guest)</span>
                                                                                            </>
                                                                                        ) : (message['userName'] && message['userName'] !== 'Soul At Home Chandapura') ? (
                                                                                            messageData.name
                                                                                        ) : (message['isUser'] && message['isUser'] === true) ? (
                                                                                            messageData.name
                                                                                        ) : (
                                                                                            'You'
                                                                                        )}
                                                                                    </div>
                                                                                    <div style={{whiteSpace: "pre-wrap"}}>
                                                                                        {
                                                                                            UserState.currentPMS?.['pmsType'] === 'StayFlexi' ? message?.['content'] : (UserState.isOfflineStatus === 'offline' && typeof message?.['content'] === 'string') ? message?.['content'] : message?.['body']
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ))
                                                                    }
                                                                    <div ref={chatEndRefMob} />
                                                                </div>
                                                            </div>
                                                        </>
                                                    )
                                                }

                                            </div>
                                            {
                                                messageData?.messages?.length > 0 && (
                                                    <div className="row mt-5">
                                                        <div className="col-md-8">
                                                            <textarea
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Type your message"
                                                                value={reply} onChange={(e) => setReply(e.target.value)}
                                                                ref={textAreaRef}
                                                                rows={1}
                                                            ></textarea>

                                                        </div>
                                                        {
                                                            UiState.isIpad ? (
                                                                <div className='d-flex'>
                                                                    {
                                                                        UserState.isOfflineStatus === "" && (
                                                                            <button className='btn' style={{border: "1px solid #000"}} onClick={getAnswer} disabled={btnLoading.aiBtn}>
                                                                                {
                                                                                    btnLoading.aiBtn ? (
                                                                                        <i className='fa fa-spinner fa-spin'></i>
                                                                                    ) : (
                                                                                        <img src={AI} alt="ai logo" />
                                                                                    )
                                                                                }
                                                                            </button>
                                                                        )
                                                                    }
                                                                    <button className='btn' style={{border: "1px solid #000",}} onClick={send} disabled={btnLoading.sendBtn}>
                                                                        {
                                                                            btnLoading.sendBtn ? (
                                                                                <i className='fa fa-spinner fa-spin'></i>
                                                                            ) : (
                                                                                <img src={SendIcon} alt="ai logo" />
                                                                            )
                                                                        }
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="col-md-4 mt-2">
                                                                    {
                                                                        UserState.isOfflineStatus === "" && (

                                                                            <button className='btn btn-block' style={{border: "1px solid #000"}} onClick={getAnswer} disabled={btnLoading.aiBtn}>
                                                                                {
                                                                                    btnLoading.aiBtn ? (
                                                                                        <i className='fa fa-spinner fa-spin'></i>
                                                                                    ) : (
                                                                                        <img src={AI} alt="ai logo" />
                                                                                    )
                                                                                }
                                                                            </button>
                                                                        )
                                                                    }
                                                                    <button className='btn btn-block' style={{border: "1px solid #000", marginLeft: "0px"}} onClick={send} disabled={btnLoading.sendBtn}>
                                                                        {
                                                                            btnLoading.sendBtn ? (
                                                                                <i className='fa fa-spinner fa-spin'></i>
                                                                            ) : (
                                                                                <img src={SendIcon} alt="ai logo" />
                                                                            )
                                                                        }
                                                                    </button>
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                )
                                            }
                                        </>
                                    )
                                }

                                {
                                    (activeIndex === 2 && showReservation) && (
                                        <>
                                        <div className="custom-border" style={{paddingLeft: "5%", paddingRight: "5%"}}>
                                            
                                            <div className='custom-flex'>
                                                <Button onClick={() => {setActiveIndex(1); setShowReservation(false)}} className='custom-btn' style={{padding: "0px"}}>
                                                    <i className='fa fa-arrow-left fa-2x'></i>
                                                </Button>
                                                <h3 className='mt-4'><strong>Reservation</strong></h3>
                                            </div>
                                            <div className="d-flex align-items-center py-1">
                                                <div className="flex-grow-1">
                                                    <p>Listing</p>
                                                </div>
                                            </div> 
                                            <div className={`d-flex align-items-start`}>
                                                <img src="https://chat.hostai.app/_next/image?url=https%3A%2F%2Fhostaway-platform.s3.us-west-2.amazonaws.com%2Flisting%2F38114-205503--o2U4-1xeT0A6IUapCXNY26ALUjNzTBOPMtd9KmpHvk-65329ef46ea64&w=96&q=75" className="rounded-circle mr-1" alt="Vanessa Tucker" width="40" height="40" />
                                                <div className="flex-grow-1 ml-3">
                                                    <h4 className='txt-black'>{resevartionData?.['listingName']}</h4>
                                                    <div className="small">
                                                        <p className='txt-black font-weight-100'>{resevartionData?.['address']}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='d-flex justify-content-between mt-5'>
                                                <div>
                                                    <p>Check in</p>
                                                    <div class="time-holder">
                                                        <p>{resevartionData['arrivalDate'] ? moment(resevartionData['arrivalDate']).format('DD MMM, YYYY') : null}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p>Check out</p>
                                                    <div class="time-holder">
                                                        <p>{resevartionData['departureDate'] ? moment(resevartionData['departureDate']).format('DD MMM, YYYY') : null}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='d-flex justify-content-between mt-5'>
                                                <div>
                                                    <p>Nights</p>
                                                    <p>{resevartionData?.['nights']}</p>
                                                </div>
                                                <div style={{marginRight: "20%"}}>
                                                    <p>Status</p>
                                                    <p>{resevartionData?.['status']}</p>
                                                </div>
                                            </div>

                                            <div className='d-flex justify-content-between'>
                                                <div>
                                                    <p>Guests</p>
                                                    <p>{resevartionData?.['numberOfGuests']}</p>
                                                </div>
                                                <div style={{marginRight: "16%"}}>
                                                    <p>Channel</p>
                                                    <p>{resevartionData?.['channelName']}</p>
                                                </div>
                                            </div>

                                            <div className='d-flex justify-content-between'>
                                                <div>
                                                    <p>Total price</p>
                                                    <p>{resevartionData?.['totalPrice']} {resevartionData?.['currency']} </p>
                                                </div>
                                                <div style={{marginRight: "15%"}}>
                                                    <p>Payment Status</p>
                                                    <p>{resevartionData?.['paymentStatus']}</p>
                                                </div>
                                            </div>
                                        </div>
                                        </>
                                    )
                                }
                            </div>
                        )
                    }
                </div>
            </Container>
        </>
    );
};
export default observer(Index);
