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
import { Button, Card, CardTitle, Input, Row, Col, CardBody, Container, CardImg, CardText } from 'reactstrap';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';

import useStore from '../../../mobx/UseStore';
// import './index.scss';
import ChatbotImg from '../../../assets/img/icons/common/chatbot-vector.jpg';
import BotService from 'apps/client/src/services/BotService';


// eslint-disable-next-line arrow-body-style
const Index: React.FC = () => {
    const history = useHistory();
    const { UserState, UiState } = useStore();
    const [bots, setBots] = useState();
    const getBots = async () => {
        const { error, data } = await BotService.getBotsByUserId({ userId: UserState.userData.userId, userType: UserState.userData.userType });
        if (!error) {
            setBots(data);
        }
    }

    const editBot = (e, id) => {
        e.preventDefault();
        UserState.setCurrentBotId(id);
        history.push('/chatbot/edit');
    }

    const deleteBot = async (id) => {
        const postData = {
            botId: id
        }
        const { error, msg } = await BotService.deleteChatbot(postData);

        if (!error) {
            UiState.notify(msg, 'success');
            getBots();
        } else {
            UiState.notify(msg, 'error');
        }
    }

    const deleteConfirm = (e, id) => {
        e.preventDefault();
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deleteBot(id)
                },
                {
                    label: 'No',
                    onClick: () => null
                }
            ]
        });
    }

    useEffect(() => {
        getBots();
    }, []);
    return (
        <>
            <Container fluid>
                <div className="header-body mt-5 p-5 bg-white shadow-lg">
                    <Row>
                        <Col md={6}>
                            <h1>Chatbots</h1>
                        </Col>
                        <Col md={2} className='offset-md-4'>
                            <Link to="/chatbot/create" className='text-white'>
                                <Button color="default" type="button">
                                    New Bot
                                </Button>
                            </Link>
                        </Col>
                    </Row>
                    <Row>
                        {
                            // @ts-ignore
                            (bots && bots.length > 0) && bots.map((bot, index) => (
                                <Col lg={3} md={6} sm={12} xs={12} key={index}>

                                    <Card className='w-100 shadow-lg mb-5 bg-white' >
                                        <CardImg
                                            alt="..."
                                            src={ChatbotImg}
                                            top
                                        />
                                        <CardBody>
                                            <CardTitle className='text-center'><h2>{bot['title']}</h2></CardTitle>
                                            <CardText className='text-center'>
                                                <p>{bot['userId']?.['userName']}</p>
                                                <p>{bot['userId']?.['email']}</p>
                                            </CardText>
                                            {/* <CardText>
                                                Some quick example text to build on the card title and make up
                                                the bulk of the card's content.
                                            </CardText> */}

                                            <div className='mb-2'>
                                                <Button
                                                    color="primary"
                                                    href="#pablo"
                                                    onClick={(e) => editBot(e, bot['_id'])}
                                                    className='btn-block cus-btn'
                                                >
                                                    <i className='fa fa-pencil'></i> Edit
                                                </Button>
                                            </div>
                                            <div className='mb-2'>
                                                <Button
                                                    color="danger"
                                                    href="#pablo"
                                                    onClick={(e) => deleteConfirm(e, bot['_id'])}
                                                    className='btn-block cus-btn'
                                                >
                                                    <i className='fa fa-trash'></i> Delete
                                                </Button>

                                            </div>
                                            <div>
                                                {/* <Button
                                                    color="default"
                                                    href="#pablo"
                                                    onClick={(e) => window.open('http://localhost:3001', '_blank')}
                                                    className='btn-block cus-btn'
                                                >
                                                    <i className='fa fa-eye'></i> View
                                                </Button> */}
                                                <a href={`https://autohostai.com/chatapp?botId=${bot['_id']}`} target="_blank" rel="noopener noreferrer" className='btn btn-default btn-block cus-btn'>
                                                    <i className='fa fa-eye'></i> View
                                                </a>

                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                            ))
                        }
                    </Row>
                </div>
            </Container>
        </>
    );
};
export default observer(Index);
