import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import useStore from '../../../mobx/UseStore';
import SandBox from "../Chatbot/SandBox";
import AIKnowledge from "../AIKnowledge/AIknowledge"
import NearbySpots from "../NearBySpots/Index"
import Customer from "../Customer/Index";
import './Index.css'
import { Button, Col, Row, Spinner } from "reactstrap";
import BotService from "apps/client/src/services/BotService";
import { Typography } from "@mui/material";
import axios from 'axios';
import { baseURL } from '../../../utils/API';

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

const Index = () => {
    const history = useHistory();
    const { UserState, UiState } = useStore();
    const location = useLocation();
    const [value, setValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [genBtnLoading, setGenBtnLoading] = useState(false);
    const [scripts, setScripts] = useState([]);
    const [genQrBtnloading, setGenQrBtnloading] = useState(false);
    // this for QR Code Functionlity
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // @ts-ignore
    const trainChatbot = async () => {
        if (UserState.currentBotData?.['_id']) {
            setLoading(true);
            const { error, msg, data } = await BotService.trainBot({ botId: UserState.currentBotData?.['_id'] });
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
        if (UserState.currentBotData?.['_id']) {
            setGenBtnLoading(true);
            const { error, msg, data } = await BotService.createScript({ botId: UserState.currentBotData?.['_id'] });
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
    const generateQRCode = async () => {
        setGenQrBtnloading(true)
        const postData = {
            botId: UserState.currentBotData?.['_id'],
            hostawayListId: UserState.selectedListing?.['hostawayListId'],
            aptName: UserState.selectedListing?.['internalListingName']
        }
        const res = await BotService.generateQR(postData);
        if (res.error) {
            UiState.notify(res.msg, 'error');
        } else {
            if (res?.data) {
                UserState.setSelectedListing({
                    ...UserState.selectedListing,
                    qrImg: res.data,
                    link: res?.link
                });
                UiState.notify(res?.msg, 'success');
            }
        }
        setGenQrBtnloading(false);
    };
    const printQRCode = () => {
        const printWindow = window.open('', '', 'width=600,height=600');
        const qrCodeSection = document.getElementById('qrCodeSection').innerHTML;
    
        printWindow.document.write(`
            <html>
            <head>
                <title>Print QR Code</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        text-align: center;
                    }
                    img {
                        max-width: 100%;
                        height: auto;
                    }
                </style>
            </head>
            <body>
                ${qrCodeSection}
            </body>
            </html>
        `);
    
        printWindow.document.close();
        printWindow.focus();
    
        // Ensure the image is fully loaded before printing
        printWindow.onload = function() {
            printWindow.print();
            printWindow.onafterprint = function () {
                printWindow.close();
            };
        };
    };
    



    return (
        <>
            <div>
                <div className="md:h-screen lg:py-0">
                    <div className='mb-1 mt-3 pl-2'>
                        <div className="font-extrabold">
                            <h2 className="font-extrabold custom-font-listing">{UserState.selectedListing?.['internalListingName']}</h2>
                            <p className="text-black">{UserState.selectedListing?.['address']}</p>
                        </div>
                    </div>
                </div>

                <hr />
                <div className="bg-white px-1 pt-0">

                    <Row>
                        <Col md={12}>
                            <Tabs
                                // orientation="vertical"
                                variant="scrollable"
                                value={value}
                                onChange={handleChange}
                                aria-label="Vertical tabs example"
                                sx={{ borderRight: 1, borderColor: 'divider' }}
                            >

                                <Tab label="AI Knowledge" {...a11yProps(0)} style={{marginRight: 5}} />
                                <Tab label="Nearby Spots" {...a11yProps(1)} style={{marginRight: 5}} />
                                <Tab label="Train or Share Bot" {...a11yProps(2)} style={{marginRight: 5}} />
                                <Tab label="Chat sandbox" {...a11yProps(3)} />

                                {UserState.isOfflineStatus &&
                                    <Tab label="QR Code" {...a11yProps(4)} style={{marginRight: 5}} />}
                                {UserState.isOfflineStatus &&
                                    <Tab label="Customer Data" {...a11yProps(5)} />}

                            </Tabs>
                            <TabPanel value={value} index={0}>
                                <div className="md:h-screen lg:py-0">
                                    <div className="bg-white p-0 sm:p-6 sm:pb-4">
                                        <AIKnowledge />
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <div className="md:h-screen lg:py-0">
                                    <div className="bg-white p-0 sm:p-6 sm:pb-4">
                                        <NearbySpots {...UserState.selectedListing} />
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel value={value} index={2}>
                                <div className="md:h-screen lg:py-0">
                                    <div className="bg-white p-0 sm:p-6 sm:pb-4">
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
                                            <div className={scripts.length > 0 ? 'bg-light p-3 d-block' : 'd-none'} style={{overflow: "scroll", width: "100%"}}>
                                                {

                                                    scripts.length > 0 && scripts.map((item) => (

                                                        <p>{item}</p>

                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel value={value} index={3}>
                                <div className="md:h-screen lg:py-0">
                                    <div className="bg-white p-0 sm:p-6 sm:pb-4">
                                        <SandBox />
                                    </div>
                                </div>
                            </TabPanel>
                            {UserState.isOfflineStatus &&
                                <TabPanel value={value} index={4}>
                                    <div className="md:h-screen lg:py-0">
                                        <div className="bg-white p-0 sm:p-6 sm:pb-4">
                                            {UserState.selectedListing?.['qrImg'] === '' || UserState.selectedListing?.['qrImg'] === undefined ?

                                                (<Button
                                                    style={{ backgroundColor: '#051E5C', color: 'white' }}
                                                    onClick={() => {
                                                        generateQRCode();
                                                    }}
                                                    className='mb-3'>
                                                    {genQrBtnloading ? (
                                                        <Spinner color="primary" size="sm" /> // Show loader for Offline button
                                                    ) : (
                                                        <>
                                                            <i className="fa fa-qrcode" aria-hidden="true"></i> Generate QR Code
                                                        </>
                                                    )}


                                                </Button>) : (<>
                                                    <Button
                                                        style={{ backgroundColor: '#051E5C', color: 'white', float: 'right' }}
                                                        onClick={() => printQRCode()}
                                                        className="mt-3"
                                                    >
                                                        <i className="fa fa-print" aria-hidden="true"></i> Print QR Code
                                                    </Button>
                                                    {
                                                        (UserState.selectedListing?.['qrImg'] && UserState.selectedListing?.['qrImg'] !== '') && (
                                                            <div id="qrCodeSection">
                                                                <img src={`${baseURL}/uploads/${UserState.currentBotData?.['_id']}/${UserState.selectedListing?.['qrImg']}`} />
                                                            </div>
                                                        )
                                                    }
                                                    {
                                                        (UserState.selectedListing?.['link'] && UserState.selectedListing?.['link'] !== '') && (
                                                            <p>You can scan above QR code or visit <a href={UserState.selectedListing?.['link']} target="_blank">{UserState.selectedListing?.['link']}</a></p>
                                                        )
                                                    }


                                                </>)
                                            }


                                            <div>

                                            </div>
                                        </div>
                                    </div>
                                </TabPanel>
                            }
                            {UserState.isOfflineStatus === 'offline' && 
                                <TabPanel value={value} index={5}>
                                    <div className="md:h-screen lg:py-0">
                                        <div className="bg-white p-0 sm:p-6 sm:pb-4">
                                            <Customer />
                                        </div>
                                    </div>
                                </TabPanel>
                            }
                        </Col>
                    </Row>
                </div>
            </div >
        </>
    );
};

export default observer(Index);
