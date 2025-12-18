/* eslint-disable prettier/prettier */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
// import { toJS } from "mobx";
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Button, Card, CardTitle, Input, Row, Col, CardBody, Container, CardImg, CardText, ButtonGroup, CardHeader, InputGroup, InputGroupAddon, FormFeedback } from 'reactstrap';
import { confirmAlert } from 'react-confirm-alert'; // Import
import moment from "moment";
import InfiniteScroll from 'react-infinite-scroll-component';

import useStore from '../../../mobx/UseStore';
import HostawayService from '../../../services/HostawayService';
import BotService from '../../../services/BotService';

import './Index.css';
import MessageSkelaton from './MessageSkelaton';
import botIcon from "../../../assets/img/bot.png";
import userIcon from "../../../assets/img/profile.png";
import { CardActionArea, CardContent, FormGroup, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { CardActions } from '@material-ui/core';
// import Card from 'react-bootstrap/Card';




// eslint-disable-next-line arrow-body-style
const Index: React.FC = () => {
    const { UserState, UiState } = useStore();

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 470); // Set an initial value based on your mobile breakpoint

    const [activeIndex, setActiveIndex] = useState(0);

    const [searchValidation, setSearchValidation] = useState({
        validateSearch: false,
        searchError: ''
    })

    const [conversations, setConversations] = useState([]);

    const [activeCard, setActiveCard] = useState('');

    const [clearSearch, setClearSearch] = useState(false)

    const [searchTerm, setSearchTerm] = useState("");

    const [messageData, setMessageData] = useState({
        botId: '',
        userId: '',
        messages: [],
    });

    const [loading, setLoading] = useState(false);

    const [btnLoading, setBtnLoading] = useState({
        aiBtn: false,
        sendBtn: false,
        messageLoadBtn: false,
    });


    const getConversations = async () => {
        const userDetails = {
            userId: UserState.userData.userId,
            userType: UserState.userData.userType
        }
        const { error, msg, data } = await BotService.getConversations(userDetails);

        if (!error && data) {
            setConversations(data);
        } else {
            UiState.notify(msg, 'error');
        }
    }

    const getMessages = async (id, botId, userId, messages) => {
        setMessageData({ ...messageData, userId: userId, botId: botId, messages: messages });
    }

    const onSearch = async () => {
        const regex = /^\d{4}\-\d{2}\-\d{2}$/;

        if (!regex.test(searchTerm)) {
            setSearchValidation({ validateSearch: true, searchError: 'Please make sure your using MM/DD/YYYY format' });
        } else {
            const date = {
                updatedAt: searchTerm,
                userType: UserState.userData.userType,
                userId: UserState.userData.userId
            };

            const { data, error, msg } = await BotService.getConversationsByDate(date);
            if (!error) {
                setConversations(data);
            } else {
                UiState.notify(msg, 'error');
                getConversations();
            }
        }
        setClearSearch(!clearSearch);
    };

    const handleSearchChange = async (event) => {
        setClearSearch(false)
        setSearchTerm(event.target.value);

    };

    const handleClearSearch = () => {
        setSearchTerm("");
        getConversations()
        setClearSearch(!clearSearch)
        setSearchValidation({ searchError: false })
    };

    useEffect(() => {
        // getConversations();
        // updateNotification();

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 991); // Adjust the breakpoint as needed
        };

        // Add event listener to window resize
        window.addEventListener('resize', handleResize);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [messageData]);

    useEffect(() => {
        getConversations();
    }, []);


    return (
        <>
            <Container fluid className='p-1'>


                <div className="header-body mt-5 mb-5 bg-white rounded-lg">
                    <Row className='mb-5'>
                        <Col>
                            <h2>Conversational Log</h2>
                        </Col>
                    </Row>
                    {
                        !isMobile ? (
                            <div>
                                <div className='search-bar-width'>
                                    <FormGroup>
                                        <TextField
                                            type='date'
                                            variant="standard"
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            onInvalid={searchValidation['validateSearch']}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        {clearSearch ? (
                                                            <IconButton onClick={handleClearSearch}>
                                                                <ClearIcon />
                                                            </IconButton>
                                                        ) : (
                                                            <IconButton onClick={onSearch}>
                                                                <SearchIcon />
                                                            </IconButton>
                                                        )}
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        {
                                            searchValidation['validateSearch'] ? (
                                                <FormFeedback>
                                                    {searchValidation['searchError']}
                                                </FormFeedback>
                                            )
                                                : null
                                        }
                                    </FormGroup>
                                </div>
                                <div className="row g-0">
                                    <div className="col-12 col-lg-5 col-xl-3 mt-2">
                                        <div className="conversation-scroll">
                                            {
                                                loading && (
                                                    <MessageSkelaton cards={10} />
                                                )
                                            }

                                            {
                                                conversations && conversations.length > 0 ? conversations.map((item, index) => (
                                                    <a href="#/" onClick={(e) => { e.preventDefault(); setActiveCard(index); getMessages(item?.['_id'], item?.['botId'], item?.['userId'], item?.['messages']) }} className="list-group-item list-group-item-action border-right " key={index}>
                                                        <Card className={activeCard === index ? 'left-outline conversation-card' : 'conversation-card'}>
                                                            <CardActionArea>
                                                                <CardContent style={{ display: 'flex', flexDirection: 'column' }}>
                                                                    <CardBody>
                                                                        <Typography variant="body2" component="h5" style={{ fontWeight: 'bold', marginBottom: 20 }}>
                                                                            <strong>{moment(item?.['updatedAt']).format("DD MMM YY")}</strong>
                                                                        </Typography>
                                                                        <Typography variant="body2" component="p" style={{ fontWeight: 'bold' }}>
                                                                            <strong>{item.messages[item['messages'].length - 1].content.substring(0, 20)}...</strong>
                                                                        </Typography>
                                                                    </CardBody>
                                                                </CardContent>
                                                            </CardActionArea>
                                                        </Card >
                                                    </a>
                                                )) : (
                                                    <div className='no-conversations border-right'>
                                                        <p>
                                                            No conversations found
                                                        </p>
                                                    </div>
                                                )
                                            }
                                            <hr className="d-block d-lg-none mt-1 mb-0" />
                                        </div>
                                    </div>
                                    <div className="col-12 col-lg-7 col-xl-9">
                                        <div className="conversation-scroll">
                                            {
                                                messageData.botId !== '' ? (
                                                    <div className="position-relative">
                                                        <div className="chat-messages p-4 screollbar">
                                                            {messageData.messages && messageData.messages.length > 0 && messageData.messages.map((message, index) => (
                                                                <div className={message?.['isUser'] === true ? 'chat-message-right pb-4' : 'chat-message-left pb-4'} style={{ width: "75%" }} key={index}>
                                                                    <div className='mr-2'>
                                                                        <img
                                                                            src={
                                                                                message?.['isUser'] === false
                                                                                    ? botIcon
                                                                                    : userIcon
                                                                            }
                                                                            className="rounded-circle mr-1"
                                                                            alt="Chris Wood"
                                                                            width="40"
                                                                            height="40"
                                                                        />
                                                                        <div className="text-muted small text-nowrap mt-2">{moment(message?.['timestamp']).format('hh mm A')}</div>
                                                                    </div>
                                                                    <div className={message?.['isUser'] === true ? 'bg-light flex-shrink-1 py-2 px-3 mr-3' : 'message-left flex-shrink-1 py-2 px-3 mr-3 text-black'}>
                                                                        {message.content}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className='no-Data'>
                                                        <img className='fade-in' src='../../../assets/img/autohost-logo.png'></img>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) :
                            (
                                <div className="card p-3">
                                    {activeIndex === 0 ?
                                        <div className='search-bar-width'>
                                            <FormGroup>
                                                <TextField
                                                    type='date'
                                                    variant="standard"
                                                    value={searchTerm}
                                                    onChange={handleSearchChange}
                                                    onInvalid={searchValidation['validateSearch']}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                {clearSearch ? (
                                                                    <IconButton onClick={handleClearSearch}>
                                                                        <ClearIcon />
                                                                    </IconButton>
                                                                ) : (
                                                                    <IconButton onClick={onSearch}>
                                                                        <SearchIcon />
                                                                    </IconButton>
                                                                )}
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                                {
                                                    searchValidation['validateSearch'] ? (
                                                        <FormFeedback>
                                                            {searchValidation['searchError']}
                                                        </FormFeedback>
                                                    )
                                                        : null
                                                }
                                            </FormGroup>
                                        </div> : null

                                    }
                                    <div className="row gap-0 ml-2">
                                        {
                                            activeIndex === 0 && (
                                                <div className="mt-3">
                                                    {
                                                        conversations && conversations.length > 0 ? conversations.map((item, index) => (
                                                            <a href="#/" onClick={(e) => { e.preventDefault(); setActiveIndex(1); getMessages(item?.['_id'], item?.['botId'], item?.['userId'], item?.['messages']) }} className="list-group-item list-group-item-action border-0" key={index}>
                                                                <Card className='w-auto left-outline'>
                                                                    <CardActionArea>
                                                                        <CardContent style={{ display: 'flex', flexDirection: 'column' }}>
                                                                            <CardBody>
                                                                                <Typography variant="body2" component="h5" style={{ fontWeight: 'bold', marginBottom: 20 }}>
                                                                                    <strong>{moment(item?.['updatedAt']).format("DD MMM YY")}</strong>
                                                                                </Typography>
                                                                                <Typography variant="body2" component="p" style={{ fontWeight: 'bold' }}>
                                                                                    <strong>{item.messages[item['messages'].length - 1].content.substring(0, 25)}...</strong>
                                                                                </Typography>
                                                                            </CardBody>
                                                                        </CardContent>
                                                                    </CardActionArea>
                                                                </Card >
                                                            </a>
                                                        )) : (
                                                            <div className='no-conversations'>
                                                                <p>
                                                                    No conversations found for {searchTerm}
                                                                </p>
                                                            </div>
                                                        )
                                                    }
                                                    <hr className="d-block d-lg-none mt-1 mb-0" />
                                                    {
                                                        (conversations.length > 0 && conversations.length < 10) && (
                                                            <Button className='load-btn' onClick={getConversations} disabled={btnLoading.messageLoadBtn} >{btnLoading.messageLoadBtn ? (<span><i className='fa fa-spinner fa-spin'></i> Loading</span>) : 'Load More'}</Button>
                                                        )
                                                    }
                                                </div>
                                            )
                                        }
                                        {
                                            activeIndex === 1 && (
                                                <>
                                                    <Button onClick={() => setActiveIndex(0)} className='custom-btn'>
                                                        <i className='fa fa-arrow-left back-arrow'></i>
                                                    </Button>
                                                    <div className="col-12 col-lg-7 col-xl-9">
                                                        {
                                                            messageData.messages.length > 0 && (
                                                                <>
                                                                    <div className="position-relative">
                                                                        <div className="chat-messages p-4">

                                                                            {messageData.messages.map((message, index) => (
                                                                                <div className={message?.['isUser'] === true ? 'chat-message-right pb-4' : 'chat-message-left pb-4'} style={{ width: "75%" }} key={index}>
                                                                                    <div className='mr-2'>
                                                                                        <img
                                                                                            src={
                                                                                                message?.['isUser'] === false
                                                                                                    ? botIcon
                                                                                                    : userIcon
                                                                                            }
                                                                                            className="rounded-circle mr-1"
                                                                                            alt="Chris Wood"
                                                                                            width="40"
                                                                                            height="40"
                                                                                        />
                                                                                        <div className="text-muted small text-nowrap mt-2">{moment(message?.['timestamp']).format('hh mm A')}</div>
                                                                                    </div>
                                                                                    <div className={message?.['isUser'] === true ? 'bg-light flex-shrink-1 py-2 px-3 mr-3' : 'message-left flex-shrink-1 py-2 px-3 mr-3 text-black'}>
                                                                                        {message.content}
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )
                                                        }
                                                    </div>
                                                </>
                                            )
                                        }
                                    </div>
                                </div>
                            )
                    }
                </div>
            </Container >

        </>
    );
};
export default observer(Index);
