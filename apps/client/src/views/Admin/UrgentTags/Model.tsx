/* eslint-disable prettier/prettier */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { toJS } from "mobx";
import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, CardTitle, Input, Row, Col, CardBody, Container, Form, FormGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader, FormFeedback, CardText } from 'reactstrap';
import useStore from '../../../mobx/UseStore';
import UserService from 'apps/client/src/services/UserService';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { confirmAlert } from 'react-confirm-alert';
import './Index.css'
import TagService from 'apps/client/src/services/TagService';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AutomatedResponseService from 'apps/client/src/services/AutomatedResponseService';
// eslint-disable-next-line arrow-body-style

const TagModel = (props) => {
    const { className, isOpen, toggle, mode, currentTag, response, callback, automatedResponse } = props;
    const { UiState, UserState } = useStore();
    const textAreaRef = useRef(null);
    const [formData, setFormData] = useState({
        _id: mode === 'edit' && currentTag ? currentTag['_id'] : '',
        title: mode === 'edit' && currentTag ? currentTag['title'] : '',
        description: mode === 'edit' && currentTag ? currentTag['description'] : '',
        userId: mode === "edit" && currentTag ? currentTag["userId"] : UserState.userData.userId,
        titleValidation: false,
        titleError: '',
        descriptionValidation: false,
        descriptionError: '',
    });
    const [autoResponse, setAutoResponse] = useState({
        timedelay: mode === 'response' && Object.keys(response).length > 0 ? response['timedelay'] : '3minutes',
        message: mode === 'response' && Object.keys(response).length > 0 ? response['message'] : '',
        messageValidation: false,
        messageError: ''
    })
    const onChangeHandler = (e) => {
        const key = e.target.name
        const value = e.target.value
        setFormData(
            { ...formData, [key]: value }
        )
        const textArea = textAreaRef.current;
        if (textArea) {
            textArea.style.height = 'auto';
            textArea.style.height = `${textArea.scrollHeight}px`;
        }

    }

    const onChangeAutomatedResposeHandler = (e) => {
        const key = e.target.name
        const value = e.target.value
        setAutoResponse(
            { ...autoResponse, [key]: value }
        )
    }
    console.log(autoResponse)
    // @ts-ignore
    const onClickAutomatedResponse = async () => {
        if (autoResponse['message'] === '') {
            setAutoResponse({ ...autoResponse, messageValidation: true, messageError: 'Please enter message' })
            return false;
        }
        AutomatedResponseService.updateResponse(autoResponse).then(({ error, msg }) => {
            if (!error) {
                automatedResponse()
                toggle();
                UiState.notify('Automated response updated successfully', 'success');

            } else {
                UiState.notify(msg, 'error');
            }
        });
    }

    // @ts-ignore
    const onClickHandler = async () => {
        if (formData['title'] === '') {
            setFormData({ ...formData, titleValidation: true, titleError: 'Please enter Title' })
            return false;
        }
        if (formData['description'] === '') {
            setFormData({ ...formData, descriptionValidation: true, descriptionError: 'Please enter description' })
            return false;
        }
        if (mode === 'edit') {
            TagService.editTag(formData).then(({ error, msg }) => {
                if (!error) {
                    toggle();
                    UiState.notify('Tag Successfully Updated', 'success');
                    callback();
                } else {
                    UiState.notify(msg, 'error');
                }
            });
        } else if (mode === 'add') {
            TagService.createTag(formData).then(({ error, msg }) => {
                if (!error) {
                    toggle();
                    UiState.notify('Tag added successfully', 'success');
                    callback();
                } else {
                    UiState.notify(msg, 'error');
                }
            });
        }
    };

    const deleteConfirm = () => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        await deleteHandler();
                        callback()
                    }

                },
                {
                    label: 'No',
                    onClick: () => null
                }
            ]
        });
    }

    const deleteHandler = async () => {
        // @ts-ignore
        const { error, msg } = TagService.deleteTag(currentTag)
        if (!error) {
            UiState.notify('Tag deleted successfully', 'success');
            callback();
        } else {
            UiState.notify('Something went wrong', 'error');
        }

    }

    const closeBtn = (
        <button className="close" onClick={toggle} type="button">
            &times;
        </button>
    );
    return (
        <Container fluid>
            <div className="header-body mt-5 ">
                <Modal isOpen={isOpen} toggle={toggle} centered>
                    {
                        mode === 'response' ?
                            <>
                                <ModalHeader toggle={toggle}>
                                    <h3>Automated Response</h3>
                                    <CardText> <small className="text-muted">Set a delay and a message for HostAI to send when you are not available</small></CardText>
                                </ModalHeader>
                                <ModalBody className='modal-body'>
                                    <div className="App">
                                        <Form className="form">
                                            <FormGroup>
                                                <Label for="timedelay">Time Delay</Label>
                                                <Input
                                                    type="select"
                                                    name="timedelay"
                                                    id="timedelay"
                                                    onChange={(e) => onChangeAutomatedResposeHandler(e)}
                                                    value={autoResponse['timedelay']}
                                                    defaultValue={'3minutes'}
                                                >
                                                    <option id='never' value="never">
                                                        Never
                                                    </option>
                                                    <option id='immediately' value="immediately">
                                                        Immediately
                                                    </option>
                                                    <option id='3minutes' value="3minutes">
                                                        3 Minutes
                                                    </option>
                                                    <option id='5minutes' value="5minutes">
                                                        5 Minutes
                                                    </option>
                                                    <option id='15minutes' value="15minutes">
                                                        15 Minutes
                                                    </option>
                                                    <option id='30minutes' value="30minutes">
                                                        30 Minutes
                                                    </option>
                                                </Input>
                                            </FormGroup>
                                            {
                                                autoResponse['timedelay'] === 'never' ? null :
                                                    <FormGroup className='mt-2'>
                                                        <Label for="messge">Message</Label>
                                                        <Input
                                                            type="textarea"
                                                            name="message"
                                                            id="message"
                                                            placeholder="We're currently unavailable. For maintenance emergencies, call XXXXXXXXXX,
For medical emergencies, dial 911. For all other inquiries, our team will get back to you shortly."
                                                            onChange={(e) => onChangeAutomatedResposeHandler(e)}
                                                            invalid={autoResponse['messageValidation'] ? true : false}
                                                            value={autoResponse['message']}
                                                            style={{ height: 'auto', resize: 'none', overflow: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Added style
                                                            rows={5}
                                                        />
                                                        {
                                                            autoResponse['messageValidation'] ? (
                                                                <FormFeedback>
                                                                    {autoResponse['messageError']}
                                                                </FormFeedback>
                                                            )
                                                                : null
                                                        }
                                                    </FormGroup>
                                            }
                                        </Form>
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button className='btn-darkblue' onClick={onClickAutomatedResponse}>
                                        Create
                                    </Button>
                                    <Button color="secondary" onClick={toggle}>
                                        Cancel
                                    </Button>
                                </ModalFooter>
                            </>
                            :
                            <>
                                <ModalHeader toggle={toggle}><h3>{mode === 'edit' ? 'Edit Urgent Tag' : 'Save Urgent Tag'}</h3>
                                    <CardText> <small className="text-muted">Save topic that AutoHostAI should not handle </small></CardText>
                                </ModalHeader>
                                <ModalBody className='modal-body'>
                                    <div className="App">
                                        <Form className="form">
                                            <FormGroup>
                                                <Label for="title">Tag Title</Label>
                                                <Input
                                                    type="text"
                                                    name="title"
                                                    id="title"
                                                    placeholder="Topic you want tagged urgent"
                                                    onChange={(e) => onChangeHandler(e)}
                                                    invalid={formData['titleValidation']}
                                                    value={formData['title']}
                                                />
                                                {
                                                    formData['titleValidation'] ? (
                                                        <FormFeedback>
                                                            {formData['titleError']}
                                                        </FormFeedback>
                                                    )
                                                        : null
                                                }
                                            </FormGroup>
                                            <FormGroup className='mt-2'>
                                                <Label for="description">Tag Description</Label>
                                                <Input
                                                    type="textarea"
                                                    name="description"
                                                    id="description"
                                                    placeholder="When guests..."
                                                    onChange={(e) => onChangeHandler(e)}
                                                    invalid={formData['descriptionValidation'] ? true : false}
                                                    value={formData['description']}
                                                    style={{ height: 'auto', resize: 'none', overflow: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Added style
                                                    rows={5}
                                                />
                                                {
                                                    formData['descriptionValidation'] ? (
                                                        <FormFeedback>
                                                            {formData['descriptionError']}
                                                        </FormFeedback>
                                                    )
                                                        : null
                                                }
                                            </FormGroup>
                                        </Form>
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    {mode === 'edit' && currentTag ? (
                                        <IconButton aria-label="delete" onClick={() => { toggle(); deleteConfirm(); callback() }} className='mr-3' sx={{ size: 'lg' }}>
                                            <DeleteIcon />
                                        </IconButton>
                                    ) : null
                                    }
                                    <Button className='btn-darkblue' onClick={onClickHandler}>
                                        {mode === 'edit' ? 'Update' : 'Create'}
                                    </Button>
                                    <Button color="secondary" onClick={toggle}>
                                        Cancel
                                    </Button>
                                </ModalFooter>
                            </>
                    }

                </Modal>
            </div>
        </Container>
    )
}

export default TagModel;