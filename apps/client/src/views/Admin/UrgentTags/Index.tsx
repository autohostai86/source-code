/* eslint-disable prettier/prettier */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { toJS } from "mobx";
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Doughnut, Pie, Bar } from 'react-chartjs-2';
import { Button, Card, CardTitle, Input, Row, Col, CardBody, Container, Form, FormGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader, FormFeedback, InputGroup, InputGroupText, InputGroupAddon, CardText } from 'reactstrap';
import MaterialTable from 'material-table'
// import { Colxx } from '../../../components/common/CustomBootstrap';
// import { NotificationManager } from '../../../components/common/react-notifications';
import IntlMessages from '../../../helpers/IntlMessages';
import useStore from '../../../mobx/UseStore';
// import { chartColors } from '../../../components/common/colors';
import BotService from 'apps/client/src/services/BotService';
import { ClassNames } from '@emotion/react';
import UserService from 'apps/client/src/services/UserService';
import PropTypes from 'prop-types';
import { action } from 'mobx';
import DeleteIcon from '@mui/icons-material/Delete';
import tableIcons from 'apps/client/src/components/TableIcon';
import Edit from '@material-ui/icons/Edit';
import Switch, { SwitchProps } from '@mui/material/Switch';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { styled } from '@mui/system';
import theme from '../../../styled-theme'
import { SxProps } from '@mui/system';
import TagModel from './Model';
import './Index.css'
import TagService from 'apps/client/src/services/TagService';
import AutomatedResponseService from 'apps/client/src/services/AutomatedResponseService';
import { IconButton, InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
// eslint-disable-next-line arrow-body-style

const Index: React.FC = () => {
    const { UserState, UiState } = useStore();
    const [tags, setTags] = useState([]);
    const [modal, setModal] = useState(false);
    const [check, setCheck] = useState('')
    const [currentTag, setCurretnTag] = useState({})
    const [mode, setMode] = useState('')
    const [isActive, setIsActive] = useState(false)
    const [response, setResponse] = useState({})
    const [noData, setNoData] = useState()
    const [search, setSearch] = useState('')
    const automatedResponse = async () => {
        // @ts-ignore
        const { data, error } = await AutomatedResponseService.getResponse()
        if (!error && data.length > 0) {
            setResponse(data[0])
        }
    }
    console.log(response)
    const toggleModal = async () => {
        setModal(!modal);
    };

    const tagDetails = async () => {
        // @ts-ignore
        const { data, error, msg } = await TagService.fetchTags({ userId: UserState.userData.userId })
        if (!error) {
            setTags(data);
        } else {
            UiState.notify('Something went wrong', 'error');
        }
    }

    const clickSwitch = async (e) => e.stopPropagation();

    const handleSwitchChange = async (tag, checked) => {
        // Update the user's account status based on the switch state
        try {
            const updatedTag = { ...tag, isActive: checked };
            console.log(tag)
            const { error, msg } = await TagService.editTag(updatedTag);
            if (!error) {
                tagDetails(); // Refresh the user data
                UiState.notify(`Tag ${checked ? 'activated' : 'deactivated'} successfully`, 'success');
            } else {
                UiState.notify('Something went wrong', 'error');
            }
        } catch {
            UiState.notify('Something went wrong', 'error');
        }
    };
    const handleSearchChange = async (e) => {
        setSearch(e.target.value)
        const { error, msg, data } = await TagService.getTagBySearch({ input: search, userId: UserState.userData.userId });
        if (e.target.value === '') {
            tagDetails()
        } else {
            if (!error) {
                // @ts-ignore
                setTags(data);
            } else {
                UiState.notify('Some thing went wrong', 'error');
            }
        }
    }

    const closeBtn = async () => {
        setSearch('')
        tagDetails()
    }

    useEffect(() => {
        tagDetails()
        automatedResponse()
    }, [])

    return (
        <>
            <Container fluid>
                <div className="header-body mt-5">
                    <Row className='mb-5'>
                        <Col>
                            <h1>Urgent Tags</h1>
                            <p>Tag the topics of messages you don't want AutoHostAI to handle </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='mb-4' lg={3} md={6} sm={6} xs={6}>
                            <Paper
                                component="form"
                                sx={{ display: 'flex', alignItems: 'center', width: 'auto', border: '1px solid #ccc', borderRadius: '4px' }}
                            >
                                <SearchIcon className='ml-2 text-muted' />
                                <InputBase
                                    sx={{ ml: 1, flex: 1, height: 40 }}
                                    placeholder="Search..."
                                    inputProps={{ 'aria-label': 'search' }}
                                    onChange={handleSearchChange}
                                    value={search}
                                />
                                {search &&
                                    <IconButton type="button" sx={{ p: '10px' }} aria-label="close" onClick={closeBtn}>
                                        <CloseIcon fontSize='small' />
                                    </IconButton>
                                }
                            </Paper>
                        </Col>
                        <Col md={6} sm={6} xs={6} className='mb-4'>
                            <Button className='btn-darkblue' onClick={() => { toggleModal(); setMode('add'); setCurretnTag({}) }}>
                                <i className="fa fa-plus" aria-hidden="true"></i> &nbsp;Add Tags
                            </Button>
                        </Col>
                        <Col lg={-6} md={-6} sm={-6} xs={-6} className='automated-response-btn'>
                            <Button onClick={() => { toggleModal(); setMode('response') }} className='px-1'>
                                <i className="fa fa-clock-o" aria-hidden="true"></i> &nbsp;Automated Response
                            </Button>
                        </Col>
                    </Row>
                    {tags.length !== 0 ? (
                        <Row className='mt-5'>
                            {tags.map((tag, index) =>
                                <Col lg={3} md={6} sm={12} xs={12} key={index}>
                                    <Card
                                        body
                                        className="my-2 mx-2 urgent-tag-card"
                                        onClick={(e) => { toggleModal(); setMode('edit'); setCurretnTag({ ...currentTag, _id: tag['_id'], title: tag['title'], description: tag['description'], isActive: tag['isAvtive'] }); }}
                                    >
                                        <CardTitle>
                                            <Row>
                                                <Col>
                                                    <i className='fa fa-exclamation-circle fa-lg urgent-tag-card-icone' aria-hidden="true"></i>
                                                </Col>
                                                <Col className='d-flex justify-content-end'>
                                                    <Switch
                                                        checked={tag.isActive}
                                                        onChange={(e) => handleSwitchChange(tag, e.target.checked)}
                                                        onClick={clickSwitch}
                                                    />
                                                </Col>
                                            </Row>
                                        </CardTitle>
                                        <CardText>
                                            {tag.title}
                                        </CardText>
                                        <CardText>
                                            <small className="text-muted">
                                                {tag.description}
                                            </small>
                                        </CardText>
                                    </Card>
                                </Col>
                            )}
                        </Row>
                    ) : (<div className='no-data-message'><p className="text-muted">No Tag exist</p></div>)
                    }
                </div>
                {
                    modal && (<TagModel isOpen={modal} toggle={toggleModal} tags={tags} mode={mode} currentTag={currentTag} response={response} automatedResponse={automatedResponse} isActive={isActive} callback={tagDetails} />)
                }
            </Container >
        </>
    )
}

export default observer(Index);