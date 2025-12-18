import React, { useState, useEffect } from 'react';
import { Button, Col, Container, Input, Progress, Row } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import Switch, { SwitchProps } from '@mui/material/Switch';
// @ts-ignore
import { propertyTypes, typeOfPlaces, favourites, amenities, safety } from "./data.json";

import "./Index.scss";
import { observer } from 'mobx-react-lite';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import axios from 'axios';
import useStore from 'apps/client/src/mobx/UseStore';
import ListingService from 'apps/client/src/services/ListingService';
import theme from '../../../../styled-theme'
import { styled } from '@mui/system';
import { toJS } from 'mobx';


const IOSSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
  ))(() => ({
    width: 73,
    height: 27,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      position: 'relative',
      left: 27,
      margin: 2,
      padding: 0,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(20px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: theme.palette.mode === 'dark' ? '#757575' : '#65C466',
          opacity: 1,
          border: 0,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff',
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color:
          theme.palette.mode === 'light'
            ? theme.palette['grey'][100]
            : theme.palette['grey'][600],
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 22,
      height: 22,
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
    },
  }));

const Index: React.FC = () => {
    const history = useHistory();
    const { UserState, UiState } = useStore();

    const [step, setStep] = useState(1);
    const [mapCenter, setMapCenter] = useState({ lat: -3.745, lng: -38.523 });
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyDb1RxdDKcMh7e2RpTpwwk_qzaKfry9fQA',
        libraries: ['places']
    });

    
    
    
    const generateUniqueNumber = () => {
        // Generate a random 5-digit number
        let uniqueNumber = Math.floor(10000 + Math.random() * 90000);
        return uniqueNumber.toString();
    };

    const handleSelectLocation = async (e) => {
        const destination = e.label;
        const currentSelectedLocation = { label: destination, value: { description: destination } };

        // setListingData((prev) => ({
        //     ...prev,
        //     location: destination,
        //     selectedLocation: currentSelectedLocation
        // }));
        UserState.setSelectLocation(e);
        
        const { error, data } = await ListingService.getLatAndLongOfAddress(`destination=${destination}`);
    
        if (!error) {
            if (data?.lat && data?.lng) {
                UserState.setSelectLocation(e, 'lat', { lat: data?.lat, lng: data?.lng })
            }
        } else {
            UiState.notify("Oops something went wrong while getting the lat and longitude, please enter them manually or try again later", 'error');
        }
    };

    const submitData = async () => {
        if (UserState.mode === 'create') {
            const uniqueNumber = generateUniqueNumber();
            const listingDetails = {
                hostawayListId: uniqueNumber,
                internalListingName: UserState.listingData.listingName.replace(/\s+$/, ""),
                thumbnailUrl: '',
                address: UserState.listingData.location,
                lat: UserState.listingData.lat,
                lng: UserState.listingData.lng,
                propertyType: UserState.listingData.propertyType,
                typeOfPlace: UserState.listingData.typeOfPlace,
                favourites: UserState.listingData.favourite,
                amenities: UserState.listingData.ameniti,
                safety: UserState.listingData.safety,
                otherInfo: UserState.listingData.basicInfo,
                // images: Array.from(UserState.listingData.images),
                responderStatus: false,
                nearBySpots: {},
            };

            

            const formData = new FormData();
            formData.append('botId', UserState.currentBotData?.['_id']);
            formData.append('isOffline', "isOffline");

            // get if any previous listing
            if (UserState.currentBotData?.['listing'] && UserState.currentBotData?.['listing'].length > 0) {
                UserState.currentBotData?.['listing'].push(listingDetails);
                formData.append('listing', JSON.stringify(UserState.currentBotData?.['listing']));
            } else {
                formData.append('listing', JSON.stringify([listingDetails]));
            }

            Array.from(UserState.listingData.images).forEach((file) => formData.append('files', file));

            
    
            const { error } = await ListingService.addListing(formData);
            if (!error) {
                UserState.setListingData({
                    currentIndex: -1,
                    propertyType: '',
                    typeOfPlace: '',
                    selectedLocation: {
                        label: '',
                        value: { description: '' },
                    },
                    location: '',
                    lat: '',
                    lng: '',
                    basicInfo: {
                        maximumGuestAllowed: 4,
                        bedroom: 1,
                        bed: 1,
                        bathroom: 1,
                        partyAllowed: '',
                        smokingAllowed: '',
                        petAllowed: '',
                        unmarriedCoupleAllowed: '',
                        alcoholAllowed: '',
                        wifiDetail: {userName: '', password: ''},
                        helpLineNumber: ''
                    },
                    favourite: [],
                    ameniti: [],
                    safety: [],
                    listingName: '',
                    hostawayListId: '',
                    images: []
                })
                history.push('/listing');
                UiState.notify('Listing is added successfully', 'success')
            } else {
                UiState.notify('Oops Something went wrong', 'error')
            }
        } else {
            let arrayListingUpdating = UserState.currentBotData?.['listing']
            arrayListingUpdating[UserState.listingData.currentIndex] = {
                hostawayListId: UserState.listingData.hostawayListId,
                internalListingName: UserState.listingData.listingName.replace(/\s+$/, ""),
                thumbnailUrl: '',
                address: UserState.listingData.location,
                lat: UserState.listingData.lat,
                lng: UserState.listingData.lng,
                propertyType: UserState.listingData.propertyType,
                typeOfPlace: UserState.listingData.typeOfPlace,
                favourites: UserState.listingData.favourite,
                amenities: UserState.listingData.ameniti,
                safety: UserState.listingData.safety,
                otherInfo: UserState.listingData.basicInfo,
                images: UserState.listingData.images,
                qrImg: UserState.listingData.qrImg,
                link: UserState.listingData.link,
            };
            
            const postData = {
                botId: UserState.currentBotData['_id'],
                listing: UserState.currentBotData?.['listing']
            }
    
            const { error } = await ListingService.updateListing(postData);
            if (!error) {
                history.push('/listing');
                UiState.notify('Listing is updated successfully', 'success')
            } else {
                UiState.notify('Oops Something went wrong', 'error')
            }
        }
    }


    useEffect(() => {
        // Update map center when lat and lng change
        if (UserState.listingData.lat && UserState.listingData.lng) {
            setMapCenter({ lat: parseFloat(UserState.listingData.lat), lng: parseFloat(UserState.listingData.lng) });
        }
    }, [UserState.listingData.lat, UserState.listingData.lng]);

    const handleMarkerDragEnd = (e) => {
        const newLat = e.latLng.lat();
        const newLng = e.latLng.lng();
        UserState.setSelectLocation(e, 'lat', {lat: newLat, lng: newLng});
        setMapCenter({ lat: newLat, lng: newLng });
    };



    return (
        <Container fluid>
            <div className="header-body mt-5">
                <div className="p-2 custom-height">
                    {step === 1 && (
                        <>
                            <h1 className='text-center mb-5'>Which of these best describes your place?</h1>
                            <Row>
                                {propertyTypes.map((type, key) => (
                                    <Col lg="4" md="4" sm="6" key={key} className='mb-1'>
                                        
                                        <div className={`card-style ${UserState.listingData.propertyType === type['label'] ? 'selected' : ''}`}>
                                            <Input
                                                type="radio"
                                                name="propertyType"
                                                id={`img${key}`}
                                                className="d-none imgbgchk"
                                                value={type['label']}
                                                checked={UserState.listingData.propertyType === type['label']}
                                                onChange={() => UserState.handleSelect(type['label'], 'propertyType')}
                                            />
                                            <label htmlFor={`img${key}`} className="label-style">
                                                <img src={`../../../../assets/svg/${type.icon}`} className='icon-style' alt={`${type['label']} icon`} />
                                                <h3>{type['label']}</h3>
                                            </label>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <h1 className='text-center mb-5'>What type of place will guests have?</h1>
                            <Row>
                                {typeOfPlaces.map((place, index) => (
                                    <Col lg="12" md="12" sm="12" key={index} className="mb-1 d-flex justify-content-center">
                                        <div className={`card-container ${UserState.listingData.typeOfPlace === place.label ? 'selected' : ''}`}>
                                            <Input
                                                type="radio"
                                                name="typeOfPlace"
                                                id={`img${index}`}
                                                className="d-none"
                                                value={place.label}
                                                checked={UserState.listingData.typeOfPlace === place.label}
                                                onChange={() => UserState.handleSelect(place.label, 'typeOfPlace')}
                                            />
                                            <label htmlFor={`img${index}`} className="card-label">
                                                <div>
                                                    <h3 className="label-title">{place.label}</h3>
                                                    <p className="label-text">Guests have the whole place to themselves.</p>
                                                </div>
                                                <img src={`../../../../assets/svg/${place.icon}`} className="icon-style" alt={`${place.label} icon`} />
                                            </label>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </>
                    )}
                    {step === 3 && isLoaded && (
                        <>
                        <h1>Where's your place located?</h1>
                        <h3 className='mb-5'>Your address is only shared with guests after they’ve made a reservation.</h3>
                            <GoogleMap
                                mapContainerStyle={{ width: "100%", height: "50vh" }}
                                center={mapCenter}
                                zoom={10}
                            >
                                <GooglePlacesAutocomplete
                                    selectProps={{
                                        value: UserState.listingData.selectedLocation,
                                        onChange: handleSelectLocation,
                                    }}
                                />
                                <Marker
                                    position={mapCenter}
                                    draggable={true}
                                    onDragEnd={handleMarkerDragEnd}
                                />
                            </GoogleMap>
                        </>
                    )}
                    {
                        step === 4 && (
                            <>
                            <h1>Share some basics about your place</h1>
                            <h3 className='mb-5'>You'll add more details later, like bed types.</h3>
                            <Row className='mb-2'>
                                <Col lg="12" md="12" sm="12" className="mb-1 d-flex flex-wrap justify-content-center">
                                    <div className="d-flex flex-wrap justify-content-between align-items-center guest-controls">
                                        <p className="guest-label">Guests</p>
                                        <div className="d-flex align-items-center">
                                            <Button className="qtyBtn" size="sm" disabled={UserState.listingData.basicInfo.maximumGuestAllowed === 1} onClick={() => UserState.handleBasicInfo(UserState.listingData.basicInfo.maximumGuestAllowed - 1, 'maximumGuestAllowed')}>
                                            -
                                            </Button>
                                            <span className="guest-count mx-2">{UserState.listingData.basicInfo.maximumGuestAllowed}</span>
                                            <Button className="qtyBtn" size="sm" onClick={() => UserState.handleBasicInfo(UserState.listingData.basicInfo.maximumGuestAllowed + 1, 'maximumGuestAllowed')}>
                                            +
                                            </Button>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className='mb-2'>
                                <Col lg="12" md="12" sm="12" className="mb-1 d-flex flex-wrap justify-content-center">
                                    <div className="d-flex flex-wrap justify-content-between align-items-center guest-controls">
                                        <p className="guest-label">Bedrooms</p>
                                        <div className="d-flex align-items-center">
                                            <Button className="qtyBtn" size="sm" disabled={UserState.listingData.basicInfo.bedroom === 1} onClick={() => UserState.handleBasicInfo(UserState.listingData.basicInfo.bedroom - 1, 'bedroom')}>
                                            -
                                            </Button>
                                            <span className="guest-count mx-2">{UserState.listingData.basicInfo.bedroom}</span>
                                            <Button className="qtyBtn" size="sm" onClick={() => UserState.handleBasicInfo(UserState.listingData.basicInfo.bedroom + 1, 'bedroom')}>
                                            +
                                            </Button>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className='mb-2'>
                                <Col lg="12" md="12" sm="12" className="mb-1 d-flex flex-wrap justify-content-center">
                                    <div className="d-flex flex-wrap justify-content-between align-items-center guest-controls">
                                        <p className="guest-label">Beds</p>
                                        <div className="d-flex align-items-center">
                                            <Button className="qtyBtn" size="sm" disabled={UserState.listingData.basicInfo.bed === 1} onClick={() => UserState.handleBasicInfo(UserState.listingData.basicInfo.bed - 1, 'bed')}>
                                            -
                                            </Button>
                                            <span className="guest-count mx-2">{UserState.listingData.basicInfo.bed}</span>
                                            <Button className="qtyBtn" size="sm" onClick={() => UserState.handleBasicInfo(UserState.listingData.basicInfo.bed + 1, 'bed')}>
                                            +
                                            </Button>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className='mb-2'>
                                <Col lg="12" md="12" sm="12" className="mb-1 d-flex flex-wrap justify-content-center">
                                    <div className="d-flex flex-wrap justify-content-between align-items-center guest-controls">
                                        <p className="guest-label">Bathrooms</p>
                                        <div className="d-flex align-items-center">
                                            <Button className="qtyBtn" size="sm" disabled={UserState.listingData.basicInfo.bathroom === 1} onClick={() => UserState.handleBasicInfo(UserState.listingData.basicInfo.bathroom + 1, 'bathroom')}>
                                            -
                                            </Button>
                                            <span className="guest-count mx-2">{UserState.listingData.basicInfo.bathroom}</span>
                                            <Button className="qtyBtn" size="sm" onClick={() => UserState.handleBasicInfo(UserState.listingData.basicInfo.bathroom + 1, 'bathroom')}>
                                            +
                                            </Button>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row className='mb-2'>
                                <Col lg="12" md="12" sm="12" className="mb-1 d-flex flex-wrap justify-content-center">
                                    <div className="d-flex flex-wrap justify-content-between align-items-center guest-controls">
                                        <p className="guest-label">Parties allowed</p>
                                        <IOSSwitch
                                            checked={UserState.listingData.basicInfo.partyAllowed === 'Yes'}
                                            onChange={() => {
                                                if (UserState.listingData.basicInfo.partyAllowed === 'No') {
                                                    UserState.handleBasicInfo('Yes', 'partyAllowed');
                                                } else {
                                                    UserState.handleBasicInfo('No', 'partyAllowed')
                                                }
                                            }}
                                            name="activate-switch"
                                            inputProps={{ 'aria-label': 'user account status switch' }}
                                            sx={{ m: 1 }}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row className='mb-2'>
                                <Col lg="12" md="12" sm="12" className="mb-1 d-flex flex-wrap justify-content-center">
                                    <div className="d-flex flex-wrap justify-content-between align-items-center guest-controls">
                                        <p className="guest-label">Smoking allowed</p>
                                        <IOSSwitch
                                            checked={UserState.listingData.basicInfo.smokingAllowed === 'Yes'}
                                            onChange={() => {
                                                if (UserState.listingData.basicInfo.smokingAllowed === 'No') {
                                                    UserState.handleBasicInfo('Yes', 'smokingAllowed');
                                                } else {
                                                    UserState.handleBasicInfo('No', 'smokingAllowed')
                                                }
                                            }}
                                            name="activate-switch"
                                            inputProps={{ 'aria-label': 'user account status switch' }}
                                            sx={{ m: 1 }}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row className='mb-2'>
                                <Col lg="12" md="12" sm="12" className="mb-1 d-flex flex-wrap justify-content-center">
                                    <div className="d-flex flex-wrap justify-content-between align-items-center guest-controls">
                                        <p className="guest-label">Pets allowed</p>
                                        <IOSSwitch
                                            checked={UserState.listingData.basicInfo.petAllowed === 'Yes'}
                                            onChange={() => {
                                                if (UserState.listingData.basicInfo.petAllowed === 'No') {
                                                    UserState.handleBasicInfo('Yes', 'petAllowed');
                                                } else {
                                                    UserState.handleBasicInfo('No', 'petAllowed')
                                                }
                                            }}
                                            name="activate-switch"
                                            inputProps={{ 'aria-label': 'user account status switch' }}
                                            sx={{ m: 1 }}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row className='mb-2'>
                                <Col lg="12" md="12" sm="12" className="mb-1 d-flex flex-wrap justify-content-center">
                                    <div className="d-flex flex-wrap justify-content-between align-items-center guest-controls">
                                        <p className="guest-label">Unmarried couples allowed</p>
                                        <IOSSwitch
                                            checked={UserState.listingData.basicInfo.unmarriedCoupleAllowed === 'Yes'}
                                            onChange={() => {
                                                if (UserState.listingData.basicInfo.unmarriedCoupleAllowed === 'No') {
                                                    UserState.handleBasicInfo('Yes', 'unmarriedCoupleAllowed');
                                                } else {
                                                    UserState.handleBasicInfo('No', 'unmarriedCoupleAllowed')
                                                }
                                            }}
                                            name="activate-switch"
                                            inputProps={{ 'aria-label': 'user account status switch' }}
                                            sx={{ m: 1 }}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row className='mb-2'>
                                <Col lg="12" md="12" sm="12" className="mb-1 d-flex flex-wrap justify-content-center">
                                    <div className="d-flex flex-wrap justify-content-between align-items-center guest-controls">
                                        <p className="guest-label">Alcohol allowed</p>
                                        <IOSSwitch
                                            checked={UserState.listingData.basicInfo.alcoholAllowed === 'Yes'}
                                            onChange={() => {
                                                if (UserState.listingData.basicInfo.alcoholAllowed === 'No') {
                                                    UserState.handleBasicInfo('Yes', 'alcoholAllowed');
                                                } else {
                                                    UserState.handleBasicInfo('No', 'alcoholAllowed')
                                                }
                                            }}
                                            name="activate-switch"
                                            inputProps={{ 'aria-label': 'user account status switch' }}
                                            sx={{ m: 1 }}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row className='mb-3'>
                                <Col lg="12" md="12" sm="12" className="mb-1 d-flex flex-wrap justify-content-center">
                                    <div className="d-flex flex-wrap justify-content-between align-items-center guest-controls">
                                        <p className="guest-label">WiFi details</p>
                                    </div>
                                </Col>
                                <Col lg="12" md="12" sm="12" className="mb-1 d-flex flex-wrap justify-content-center">
                                <Col lg={3} md={3}>
                                    <Input
                                        id="wifiName"
                                        name="wifiName"
                                        placeholder="Enter wifi user name"
                                        type="text"
                                        value={UserState.listingData.basicInfo.wifiDetail?.['userName']}
                                        onChange={(e) => UserState.setWifiDetail('userName', e.target.value)}
                                        className='mb-2'
                                    />
                                </Col>
                                <Col lg={3} md={3}>
                                    <Input
                                        id="password"
                                        name="password"
                                        placeholder="Enter wifi password"
                                        type="text"
                                        value={UserState.listingData.basicInfo.wifiDetail?.['password']}
                                        onChange={(e) => UserState.setWifiDetail('password', e.target.value)}
                                    />
                                </Col>
                                </Col>
                            </Row>
                            <Row className='mb-2'>
                                <Col lg="12" md="12" sm="12" className="mb-1 d-flex flex-wrap justify-content-center">
                                    <div className="d-flex flex-wrap justify-content-between align-items-center guest-controls">
                                        <p className="guest-label">Helpline Number</p>
                                        <Input
                                            id="helpLineNumber"
                                            name="helpLineNumber"
                                            placeholder=""
                                            className='w-50'
                                            type="text"
                                            value={UserState.listingData.basicInfo.helpLineNumber}
                                            onChange={(e) => UserState.handleBasicInfo(e.target.value, 'helpLineNumber')}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            </>
                        )
                    }
                    {
                        step === 5 && (
                            <>
                            <h1>Tell guests what your place has to offer</h1>
                            <h3 className='mb-5'>You can add more amenities after you publish your listing.</h3>
                            <h3>What about these guest favorites?</h3>
                            <Row className='mb-4'>
                                {favourites.map((type, key) => (
                                    <Col lg="4" md="4" sm="6" key={key} className='mb-1'>
                                        <div className={`card-style ${UserState.listingData.favourite.includes(type['label']) ? 'selected' : ''}`}>
                                            <Input
                                                type="checkbox"
                                                name="favourite"
                                                id={`favourite-img${key}`}
                                                className="d-none imgbgchk"
                                                value={type['label']}
                                                checked={UserState.listingData.favourite.includes(type['label'])}
                                                onChange={() => UserState.handleCheckboxSelect(type['label'], 'favourite')}
                                            />
                                            <label htmlFor={`favourite-img${key}`} className="label-style">
                                                <img src={`../../../../assets/svg/${type.icon}`} className='icon-style' alt={`${type.label} icon`} />
                                                <h3>{type['label']}</h3>
                                            </label>
                                        </div>
                                    </Col>
                                ))}
                            </Row>

                            <h3>Do you have any standout amenities?</h3>
                            <Row className='mb-4'>
                                {amenities.map((type, key) => (
                                    <Col lg="4" md="4" sm="6" key={key} className='mb-1'>
                                        <div className={`card-style ${UserState.listingData.ameniti.includes(type['label']) ? 'selected' : ''}`}>
                                            <Input
                                                type="checkbox"
                                                name="ameniti"
                                                id={`ameniti-img${key}`}
                                                className="d-none imgbgchk"
                                                value={type['label']}
                                                checked={UserState.listingData.ameniti.includes(type['label'])}
                                                onChange={() => UserState.handleCheckboxSelect(type['label'], 'ameniti')}
                                            />
                                            <label htmlFor={`ameniti-img${key}`} className="label-style">
                                                <img src={`../../../../assets/svg/${type.icon}`} className='icon-style' alt={`${type.label} icon`} />
                                                <h3>{type['label']}</h3>
                                            </label>
                                        </div>
                                    </Col>
                                ))}
                            </Row>

                            <h3>Do you have any of these safety items?</h3>
                            <Row>
                                {safety.map((type, key) => (
                                    <Col lg="4" md="4" sm="6" key={key} className='mb-1'>
                                        <div className={`card-style ${UserState.listingData.safety.includes(type['label']) ? 'selected' : ''}`}>
                                            <Input
                                                type="checkbox"
                                                name="safety"
                                                id={`safety-img${key}`}
                                                className="d-none imgbgchk"
                                                value={type['label']}
                                                checked={UserState.listingData.safety.includes(type['label'])}
                                                onChange={() => UserState.handleCheckboxSelect(type['label'], 'safety')}
                                            />
                                            <label htmlFor={`safety-img${key}`} className="label-style">
                                                <img src={`../../../../assets/svg/${type.icon}`} className='icon-style' alt={`${type.label} icon`} />
                                                <h3>{type['label']}</h3>
                                            </label>
                                        </div>
                                    </Col>
                                ))}
                            </Row>

                            </>
                        )
                    }
                    {
                        step === 6 && (
                            <Row>
                                <Col lg="6" md="6">
                                    <label htmlFor="listingname">
                                        Listing Name
                                    </label>
                                    <Input
                                        id="listingName"
                                        name="listingName"
                                        placeholder="Enter Listing Name"
                                        type="text"
                                        value={UserState.listingData.listingName}
                                        onChange={(e) => UserState.setListingName(e.target.value)}
                                    />
                                </Col>
                                <Col lg="6" md="6">
                                    <label htmlFor="aptImages">
                                        Apartment Images
                                    </label>
                                    <Input
                                        id="aptImages"
                                        name="aptImages"
                                        type="file"
                                        multiple
                                        onChange={(e) => {
                                            console.log(e.target.files);
                                            UserState.setImages(e.target.files)
                                        }}
                                    />
                                </Col>
                            </Row>
                        )
                    }
                </div>

                <div className='custom-footer'>
                    <Progress 
                        className="my-3" style={{ height: '5px' }}
                        value={
                            step === 1 ? 16.67
                            :step === 2 ? 33.33
                            :step === 3 ? 50
                            :step === 4 ? 66.67
                            :step === 5 ? 83.33
                            :100
                        }
                    />
                    <div className="d-flex justify-content-between">
                        <Button outline disabled={step === 1} style={{ textDecoration: "underline" }} className='mb-3' onClick={() => setStep(step - 1)}>
                            Back
                        </Button>
                        <Button 
                            style={{ backgroundColor: '#051E5C', color: 'white' }}
                            className='mb-3'
                            onClick={() => {
                                if (step === 6) {
                                    submitData();
                                } else {
                                    setStep(step + 1);
                                }
                            }}
                        >
                            { step === 6 ? 'Submit' : 'Next'}
                        </Button>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default observer(Index);
