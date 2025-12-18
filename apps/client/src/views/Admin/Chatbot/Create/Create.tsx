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
import { useDropzone } from "react-dropzone";
// import TabPanel from '@mui/lab/TabPanel';
import useStore from '../../../../mobx/UseStore';
import uploadIcon from "../../../../assets/img/icons/common/cloud-computing.png";
import BotService from 'apps/client/src/services/BotService';
import { toJS } from 'mobx';
import { useHistory } from 'react-router-dom';

// import './index.scss';

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
    const currentFile = UserState.currentFile ? UserState.currentFile: inputRef.current ? inputRef.current.files[0] :  undefined;
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
const Create: React.FC = () => {
    const { UserState, UiState } = useStore();
    const [activeIndex, setActiveIndex] = useState(0);
    const [value, setValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const history = useHistory();
    const [initialValues, setInitialValues] = useState({
        title: '',
        titleErrorMsg: '',
        message: '',
        messageErrorMsg: '',
    });

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
            // setActiveIndex(1);
            setTimeout(() => {
                setLoading(false);
                history.push('/chatbot/edit')
            }, 3000);
        } else {
            UiState.notify('Oops something went wrong', 'error');
            setLoading(false);
        }

        // if (activeIndex === 0) {
        //     setActiveIndex(1);
        // } else {
        //     setActiveIndex(0);
        // }
    }


    // @ts-ignore
    const uploadDataSource = async () => {
        if (UserState.currentFile) {
            const formData = new FormData();
            formData.append('botId', UserState.currentBotId);
            formData.append('sources', UserState.currentFile);
            // formData.append('test', 'dsd');
            setLoading(true);
            const { error, msg } = await BotService.addDataSource(formData);
            if (!error) {
                UiState.notify(msg, 'success');
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
            const { error, msg } = await BotService.trainBot({botId: UserState.currentBotId});
            if (!error) {
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
    
    useEffect(() => {
        UserState.setCurrentFile(false);
    },[])

    return (
        <>
            <Container fluid>
                <div className="header-body mt-5">
                    <Row>
                        <Col md={8} className='offset-md-2'>
                            <Card className='shadow  mb-5 bg-white'>
                                <CardBody>
                                    <div className='text-center mb-5'>
                                        <h1>{activeIndex === 1 ? 'Data Sources' : 'Configuration'}</h1>
                                        <h5>{activeIndex === 1 ? 'Add your data sources to train your chatbot' : 'You can customize your bot'}</h5>
                                    </div>
                                    <Form role="form">
                                                <Row>
                                                    <Col md={4} className='offset-md-2'>

                                                        <FormGroup className="mb-3">
                                                            <Label>Title</Label>
                                                            <Input
                                                                placeholder="AI Assistant"
                                                                type="text"
                                                                name='title'
                                                                value={initialValues.title}
                                                                onChange={(e) => handleInput(e)}
                                                                invalid={initialValues.titleErrorMsg !== '' ? true : false}
                                                            />
                                                            {
                                                                initialValues.titleErrorMsg !== '' ? (
                                                                    <FormFeedback>
                                                                        {initialValues.titleErrorMsg}
                                                                    </FormFeedback>
                                                                )
                                                                    : null
                                                            }
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={4}>

                                                        <FormGroup className="mb-3">
                                                            <Label>Initial Message</Label>
                                                            <Input
                                                                placeholder="Hi how may i help you?"
                                                                type="text"
                                                                name='message'
                                                                value={initialValues.message}
                                                                onChange={(e) => handleInput(e)}
                                                                invalid={initialValues.messageErrorMsg !== '' ? true : false}
                                                            />
                                                            {
                                                                initialValues.messageErrorMsg !== '' ? (
                                                                    <FormFeedback>
                                                                        {initialValues.messageErrorMsg}
                                                                    </FormFeedback>
                                                                )
                                                                    : null
                                                            }
                                                        </FormGroup>
                                                    </Col>

                                                </Row>
                                                <Row>
                                                    <Col md={8} className='offset-md-2'>
                                                        <div className="text-center">
                                                            <Button className="my-4 w-100" color="default" type="button" onClick={createBot} disabled={loading}>
                                                                {loading ? (
                                                                    <i className='fa fa-spinner fa-spin'></i>
                                                                ): 'Submit'}
                                                            </Button>
                                                        </div>
                                                    </Col>
                                                </Row>


                                            </Form>
                                    {/* {
                                        activeIndex === 1 && (
                                            <Box
                                            // sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 224 }}
                                            >
                                                <Row>
                                                    <Col md={12}>
                                                        <Tabs
                                                            // orientation="vertical"
                                                            // variant="scrollable"
                                                            value={value}
                                                            onChange={handleChange}
                                                            aria-label="Vertical tabs example"
                                                            sx={{ borderRight: 1, borderColor: 'divider' }}
                                                        >
                                                            <Tab label="Files" {...a11yProps(0)} />
                                                            <Tab label="Q&A" {...a11yProps(1)} />

                                                        </Tabs>
                                                        <TabPanel value={value} index={0}>
                                                            <DragAndUpload handleDrop={handleDrop} />
                                                        </TabPanel>
                                                        <TabPanel value={value} index={1}>
                                                            <Row>
                                                                <Col md={12} className='offset-md-2'>

                                                                    <FormGroup className="mb-3">
                                                                        <Label>Title</Label>
                                                                        <Input
                                                                            placeholder="AI Assistant"
                                                                            type="text"
                                                                            name='title'
                                                                            value={initialValues.title}
                                                                            onChange={(e) => handleInput(e)}
                                                                            invalid={initialValues.titleErrorMsg !== '' ? true : false}
                                                                        />
                                                                        {
                                                                            initialValues.titleErrorMsg !== '' ? (
                                                                                <FormFeedback>
                                                                                    {initialValues.titleErrorMsg}
                                                                                </FormFeedback>
                                                                            )
                                                                                : null
                                                                        }
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md={12}>

                                                                    <FormGroup className="mb-3">
                                                                        <Label>Initial Message</Label>
                                                                        <Input
                                                                            placeholder="Hi how may i help you?"
                                                                            type="text"
                                                                            name='message'
                                                                            value={initialValues.message}
                                                                            onChange={(e) => handleInput(e)}
                                                                            invalid={initialValues.messageErrorMsg !== '' ? true : false}
                                                                        />
                                                                        {
                                                                            initialValues.messageErrorMsg !== '' ? (
                                                                                <FormFeedback>
                                                                                    {initialValues.messageErrorMsg}
                                                                                </FormFeedback>
                                                                            )
                                                                                : null
                                                                        }
                                                                    </FormGroup>
                                                                </Col>

                                                            </Row>
                                                        </TabPanel>

                                                    </Col>
                                                </Row>
                                                <Row>
                                                    {
                                                        isUploaded ? (
                                                            <Col md={4} className='offset-md-4'>
                                                                <div className="text-center">
                                                                    <Button className="my-4 w-100" color="default" type="button" onClick={trainChatbot} disabled={loading}>
                                                                        {loading ? (<><i className='fa fa-refresh fa-spin'></i> <span>Train chatbot</span></>) : (<><i className='fa fa-refresh'></i> <span>Train chatbot</span></>)} 
                                                                    </Button>
                                                                </div>
                                                            </Col>
                                                        )
                                                        :
                                                        (
                                                            <Col md={4} className='offset-md-4'>
                                                                <div className="text-center">
                                                                    <Button className="my-4 w-100" color="default" type="button" onClick={uploadDataSource} disabled={loading}>
                                                                        <i className='fa fa-cloud-upload'></i> Upload
                                                                    </Button>
                                                                </div>
                                                            </Col>

                                                        )
                                                    }
                                                </Row>
                                            </Box>
                                        )
                                    } */}


                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                </div>
            </Container>
        </>
    );
};
export default observer(Create);
