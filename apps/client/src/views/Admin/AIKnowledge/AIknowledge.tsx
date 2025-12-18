/* eslint-disable prettier/prettier */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */

// import { toJS } from "mobx";
// copied from Edit chatbot
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
import useStore from 'apps/client/src/mobx/UseStore';
import uploadIcon from "../../../assets/img/icons/common/cloud-computing.png"
import BotService from 'apps/client/src/services/BotService';
import { toJS } from 'mobx';
import "react-chatbotify/dist/react-chatbotify.css";
import QA from '../Chatbot/Edit/QA';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import './Index.css';
import { baseURL } from 'apps/client/src/utils/API';
import { confirmAlert } from 'react-confirm-alert';

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
        accept: "application/pdf,text/plain,application/json",
    });

    //     reading current input from inputRef hook of react-dropzone
    const currentFile = UserState.currentFile ? UserState.currentFile : undefined;

    return (
        <div>
            <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />

                <div className="d-flex flex-column align-items-center w-50 m-auto">
                    <img src={uploadIcon} alt="upload" width="25%" />
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

                    <h6>
                        <strong>
                            Accepted file formats: PDF, TXT and JSON
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
    const [value, setValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [scripts, setScripts] = useState([]);

    const [initialValues, setInitialValues] = useState({
        title: '',
        titleErrorMsg: '',
        message: '',
        messageErrorMsg: '',
    });

    const [dataSourceType, setDataSourceType] = useState('');
    const [currentProperty, setCurrentProperty] = useState('');

    

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
    
    const [isMobile, setIsMobile] = useState(false);

    const [previousDataSources, setPreviousDataSources] = useState([]);

    const handleDrop = (selectedFile) => {
        const currentSelectedFile = selectedFile[0];
        UserState.setCurrentFile(currentSelectedFile);
    };


    // @ts-ignore
    const uploadDataSource = async () => {
        if (UserState.currentFile) {
            let apartment = UserState.selectedListing?.['internalListingName'];
            if (apartment === 'Shriram (Luxury 1bhk close to wipro)') {
                apartment = UserState.selectedListing?.['internalListingName'].replace(/ /g, '_');
            }
            const formData = new FormData();
            formData.append('botId', UserState.currentBotData?.['_id']);
            formData.append('sources', UserState.currentFile);
            formData.append('apartment', apartment);
            // formData.append('test', 'dsd');
            setLoading(true);
            // @ts-ignore
            const { error, msg, updatedBot } = await BotService.addDataSource(formData, apartment);
            if (!error) {
                UiState.notify(msg, 'success');
                UserState.setCurrentFile(false);
                // setCurrentProperty([])
                // setCurrentApartmentNo('');
                UserState.setCurrentBotData(updatedBot);
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
    

    const getDataSources = async () => {
        if (UserState.currentBotData?.['dataSourceFiles']?.length > 0) {
            const dataSources = UserState.currentBotData['dataSourceFiles'].filter((x: any) => x.apartMent === UserState.selectedListing['internalListingName']);
            if (dataSources.length > 0) {
                setPreviousDataSources(dataSources);
            }
        } else {
            setPreviousDataSources([]);
        }
    }

    const handleResize = () => {
        setIsMobile(window.innerWidth <= 470); // Adjust the breakpoint as needed
    };

    const deleteFile = async (postData) => {
        postData["botId"] = UserState.currentBotData["_id"];
        const { error, msg, updatedBot } = await BotService.deleteDataSources(postData);
        if (!error) {
            UserState.setCurrentBotData(updatedBot);
            UiState.notify(msg, 'success');
        } else {
            UiState.notify(msg, 'error');
        }
    }
    const deleteConfirm = (reqData) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure to do this?',
            buttons: [
            {
                label: 'Yes',
                onClick: () => deleteFile(reqData),
            },
            {
                label: 'No',
                onClick: () => null,
            },
            ],
        });
    };

    useEffect(() => {
        UserState.setCurrentFile(false);
        // getBotData();
        setScripts([]);
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
            isUpdate: false
        });

        setPreviousDataSources([]);

        // Add event listener to window resize
        window.addEventListener('resize', handleResize);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (value === 0) {
            UserState.setCurrentFile(false);
            // getBotData();
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
        }

        // getListings();

    }, [value]);

    useEffect(() => {
        if (dataSourceType === 'File') {
            getDataSources();
        }
    }, [dataSourceType]);

    useEffect(() => {
        getDataSources();
    }, [UserState.currentBotData])

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
                <div className="header-body">
                    <Card className='bg-white'>
                        <CardBody className='custom-card'>
                            <div className='text-center'>
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

                                {/* <FormGroup className="mb-3">
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
                                            UserState.currentBotData?.['listing'].length > 0 && UserState.currentBotData?.['listing'].map((apt) => (
                                                <option value={apt?.['internalListingName']}>{apt?.['internalListingName']}</option>
                                            ))
                                        }
                                    </Input>
                                </FormGroup> */}
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
                                            {
                                                previousDataSources.length > 0 && (
                                                    <div className='text-center'>
                                                        <h4>Previously uploaded files</h4>
                                                    {
                                                        previousDataSources.map((prevFile, index) => (
                                                            <div key={index} className='d-flex justify-content-between flex-wrap mb-1'>
                                                                <p className='text-dark'>{prevFile.path.split('/').pop()}</p>
                                                                <div>
                                                                    <a 
                                                                        className="btn btn-outline-dark"
                                                                        href={`${baseURL}/${prevFile.path}`}
                                                                        target='_blank'
                                                                    >
                                                                        <VisibilityIcon className="text-lg" /> View
                                                                    </a>
                                                                    <a 
                                                                        className="btn btn-outline-danger"
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            deleteConfirm({filePath: prevFile.path, arrayIndex: index});
                                                                        }}
                                                                    >
                                                                        <DeleteSweepIcon className="text-lg" /> Delete
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                    </div>
                                                )
                                            }
                                        </>
                                    )
                                        :
                                        dataSourceType === 'Q&A' ? (
                                            // @ts-ignore
                                            <QA apartmentNo={UserState.selectedListing?.['internalListingName']} />
                                        )
                                            : null
                                }


                            </div>
                        </CardBody>
                    </Card>
                </div>
            </Container>
        </>
    );
};
export default observer(Edit);
