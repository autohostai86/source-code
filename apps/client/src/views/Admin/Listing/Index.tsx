/* eslint-disable prettier/prettier */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { toJS } from "mobx";
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Button, Card, CardTitle, Input, Row, Col, CardBody, Container, Form, FormGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader, FormFeedback } from 'reactstrap';
import axios from 'axios';

import MaterialTable from 'material-table'
import useStore from '../../../mobx/UseStore';
import tableIcons from 'apps/client/src/components/TableIcon';
import Switch, { SwitchProps } from '@mui/material/Switch';
import { confirmAlert } from 'react-confirm-alert';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { styled } from '@mui/system';
import theme from '../../../styled-theme'
import './Index.scss'
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import { useHistory } from 'react-router-dom';
import HostawayService from 'apps/client/src/services/HostawayService';
import ListingService from 'apps/client/src/services/ListingService';
import BotService from 'apps/client/src/services/BotService';
import StayFlexiService from 'apps/client/src/services/StayFlexiService';
import { baseURL } from 'apps/client/src/utils/API';
import fallBack from "../../../assets/img/fallback_Image.jpg";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-cyan/theme.css"

// eslint-disable-next-line arrow-body-style
const CreateUserModel = (props) => {
  const { className, isOpen, toggle, mode, currentUser, callback } = props;
  const { UserState, UiState } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState<any>([])

  const history = useHistory();

  const getListingFromHostaway = async () => {

    if (Object.keys(UserState.currentPMS).length === 0) {
      UiState.notify('Please update the PMS settings ', 'success');
    } else {
      if (UserState.currentPMS['pmsType'] === 'Hostaway') {
        // @ts-ignore
        const { data, error } = await HostawayService.getListings(UserState.currentPMS['accessToken']);
        if (!error) {
          setList(data)
        } else {
          UiState.notify('Some thing went wrong', 'error')
        }
      } else if (UserState.currentPMS['pmsType'] === 'StayFlexi') {
        // @ts-ignore
        const { data, error } = await StayFlexiService.getListings(UserState.currentPMS['accessToken'], UserState.currentPMS?.['groupId']);
        if (!error) {
          setList(data)
        } else {
          UiState.notify('Some thing went wrong', 'error')
        }
      } else {
        UiState.notify('Unrecognized PMS', 'error')
      }
    }

  }

  // @ts-ignore
  const importListingClick = async () => {
    let listing: any = [];
    setIsLoading(true);
    if (UserState.currentPMS['pmsType'] === 'Hostaway') {
      for (const element of list ) {
        // get amenities
        const amenities = [];
        const otherInfoObj = {};
        if (element.listingAmenities && element.listingAmenities.length > 0) {
          const amenitiesArr = element.listingAmenities;
          for (const item of amenitiesArr) {
            amenities.push(item?.amenityName);
          }
        }

        if (element.personCapacity) {
          otherInfoObj['maximumGuestAllowed'] = element.personCapacity;
        }

        if (element.bedroomsNumber) {
          otherInfoObj['bedroom'] = element.bedroomsNumber;
        }

        if (element.bedsNumber) {
          otherInfoObj['bed'] = element.bedsNumber;
        }

        if (element.bathroomsNumber) {
          otherInfoObj['bathroom'] = element.bathroomsNumber;
        }
        
        if (element.bedsNumber) {
          otherInfoObj['bed'] = element.bedsNumber;
        }
        if (element.maxPetsAllowed) {
          otherInfoObj['petAllowed'] = element.maxPetsAllowed === null ? "Information is not available" : "Yes";
        }
        if (element.wifiUsername) {
          otherInfoObj['wifiDetail'] = {};
          otherInfoObj['wifiDetail']['userName'] = element.wifiUsername;
        }
        if (element.wifiPassword) {
          otherInfoObj['wifiDetail']['password'] = element.wifiPassword;
        }
        if (element.contactPhone1) {
          otherInfoObj['helpLineNumber'] = element.contactPhone1;
        }

        // otherInfoObj['partyAllowed'] = "Information is not available";
        // otherInfoObj['smokingAllowed'] = "Information is not available";

        listing.push({
          hostawayListId: element.id,
          internalListingName: element.internalListingName,
          thumbnailUrl: element.thumbnailUrl,
          address: element.address,
          lat: element.lat,
          lng: element.lng,
          favourites: [],
          amenities: amenities,
          safety: [],
          otherInfo: otherInfoObj,
          responderStatus: false,
          nearBySpots: {},
        });
      }
      // listing = list.map((X) => {
      //   const newList = {
      //     hostawayListId: X.id,
      //     internalListingName: X.internalListingName,
      //     thumbnailUrl: X.thumbnailUrl,
      //     address: X.address,
      //     lat: X.lat,
      //     lng: X.lng,
      //     favourites: [],
      //     amenities: "",
      //     safety: "",
      //     otherInfo: "",
      //     responderStatus: false,
      //     nearBySpots: {},
      //   }
      //   return newList
      // });
    }

    if (UserState.currentPMS['pmsType'] === 'StayFlexi') {
      // listing = list.map((X) => {
      //   const newList = {
      //     hostawayListId: X.hotelId,
      //     internalListingName: X.hotelName,
      //     thumbnailUrl: '',
      //     address: X.hotelAddress,
      //     lat: X.hotelLat,
      //     lng: X.hotelLng,
      //     responderStatus: false,
      //     nearBySpots: {},
      //   }
      //   return newList
      // });
      
      for (const element of list ) {
        const content = await StayFlexiService.getRoomsByHotel(UserState.currentPMS['accessToken'], element.hotelId);
        // @ts-ignore
        if (!content.error && content.data) {
          listing.push({
            hostawayListId: content?.['data']?.['propertyId'],
            internalListingName: content?.['data']?.['propertyName'],
            thumbnailUrl: content?.['data']?.['hotelImages']?.[0],
            address: content?.['data']?.['address'],
            lat: content?.['data']?.['latitude'],
            lng: content?.['data']?.['longitude'],
            propertyType: content?.['data']?.['propertyType'],
            typeOfPlace: "N/A",
            favourites: [],
            amenities: content?.['data']?.['hotelAmenities'],
            safety: [],
            otherInfo: {
              wifiDetail: {userName: '', password: ''},
              helpLineNumber: `email: ${content?.['data']?.['contactDetail']?.['name']} name: ${content?.['data']?.['contactDetail']?.['name']} phone: ${content?.['data']?.['contactDetail']?.['phone']}`
            },
            
          })
        }
        
      }
      
    }


    if (list) {
      const listingDetails = {
        botId: UserState.currentBotData['_id'],
        listing
      }

      if (UserState.isOfflineStatus === 'offline') {
        const { data, error } = await ListingService.addListing(listingDetails)
        if (!error) {
          callback()
          toggle()
          UiState.notify('Listing imported', 'success')
        } else {
          // toggle()
          UiState.notify('Some thing went wrong', 'error')
        }
      } else {
        const { data, error } = await ListingService.addPMSListing(listingDetails)
        if (!error) {
          callback()
          toggle()
          UiState.notify('Listing imported', 'success')
        } else {
          // toggle()
          UiState.notify('Some thing went wrong', 'error')
        }
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getListingFromHostaway()

  }, []);

  const closeBtn = (
    <button className="close" onClick={() => {
      UserState.setSelectedListing({})
      toggle()
    }}
      type="button" >
      & times;
    </button >
  );
  return (
    <Container fluid>
      <div className="header-body mt-5 ">
        <Modal isOpen={isOpen} toggle={toggle} centered size='full'>
          <ModalHeader toggle={toggle}><h2>Import Listing</h2></ModalHeader>
          <ModalBody>
            <div className="App">
              <Form className="form">
                <div className='text-center'>
                  {
                    Object.keys(UserState.currentPMS).length === 0 ? (
                      <h3>Please update the PMS settings</h3>
                    ) : UserState.currentBotData?.['listing'].length > 0 ? (
                      <h3>You have already imported all the listings</h3>
                    ) : (
                      <h3>You have {list.length} listings</h3>
                    )
                  }
                </div>
              </Form>
            </div>
          </ModalBody>
          <ModalFooter>
            {
              (Object.keys(UserState.currentPMS).length > 0 && UserState.currentBotData?.['listing'].length === 0) ? (
                <Button style={{ backgroundColor: '#051E5C', color: 'white' }} disabled={isLoading} onClick={importListingClick}>
                  {isLoading ? (<><i className='fa fa-refresh fa-spin'></i> <span> Importing... </span></>) : (<><i className='fa fa-refresh'></i> <span>Import</span></>)}
                </Button>
              ) : null
            }
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </Container>
  )
}

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
  const { UserState, UiState } = useStore();
  const [list, setList] = useState([]);
  const [modal, setModal] = useState(false);
  const [check, setCheck] = useState('')
  const [currentUser, setCurretnUser] = useState({})
  const [botData, setBotData] = useState({})
  const [mode, setMode] = useState('')


  const [selectedLocation, setSelectedLocation] = useState({
    label: '',
    value: { description: '' },
  });

  const [selectedImage, setSelectedImage] = useState(null)
  const [listingFormData, setlistingFormData] = useState<any>({})
  const [modeListing, setModeListing] = useState('')
  const [arrayIndexingListing, setArrayIndexingListing] = useState('')



  const toggleModal = async () => {
    setModal(!modal);
  };
  const history = useHistory();
  const [modalOfflineListing, setModalOfflineListing] = useState(false);

  const toggle = () => setModalOfflineListing(!modalOfflineListing);
  // image Uploading 
  const handleImageUpload = (e) => {
    setSelectedImage(e.target.files[0]); // Capture the selected file
  }
  // end of image uploading function
  // location code adding here
  const handleSelectLocation = async (e) => {
    const destination = e.label

    setlistingFormData(Prev => ({
      ...Prev, location: destination
    }))
    setSelectedLocation({
      label: destination,  // Displayed address
      value: { description: destination },  // Actual value for autocomplete
    });
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(destination)}&key=AIzaSyDb1RxdDKcMh7e2RpTpwwk_qzaKfry9fQA`
      );

      const { lat, lng } = response?.data?.results?.[0]?.geometry?.location || {};
      if (lat) {
        setlistingFormData(Prev => ({
          ...Prev, lat: lat
        }))

      }
      if (lng) {
        setlistingFormData(Prev => ({
          ...Prev, lan: lng
        }))
      }
    } catch (error) {
      console.error("Error Fetching Address Coordinates:", error);
      UiState.notify("Error Fetching Address Coordinates... So Please Enter Manually", 'error');
    }

  };
  const handleInputValue = (event) => {
    setlistingFormData(Prev => ({
      ...Prev, [
        event.target.name
      ]: event.target.value
    }))
  }

  const generateUniqueNumber = () => {
    // Generate a random 5-digit number
    let uniqueNumber = Math.floor(10000 + Math.random() * 90000);
    return uniqueNumber.toString();
  };

  const submitFormListing = async (event) => {
    event.preventDefault();
    if (!listingFormData.listingName) {
      UiState.notify('Listing Name is Required', 'error');
    } else if (!listingFormData.location) {
      UiState.notify('Address  is Required', 'error');
    } else if (!listingFormData.lat) {
      UiState.notify('latitude is Required', 'error');
    } else if (!listingFormData.lan) {
      UiState.notify('longitude is Required', 'error');

    } else {
      // this code For Add
      if (modeListing === "Add") {
        const uniqueNumber = generateUniqueNumber();
        const listing = [{
          hostawayListId: uniqueNumber,
          internalListingName: listingFormData.listingName,
          thumbnailUrl: selectedImage,
          address: listingFormData.location,
          lat: listingFormData.lat,
          lng: listingFormData.lan,
          responderStatus: false,
          nearBySpots: {},
        }]
        const listingDetails = {
          botId: UserState.currentBotData['_id'],
          listing,
          isOffline: "isOffline"
        }

        const { data, error } = await ListingService.addListing(listingDetails)
        if (!error) {
          getBotByUserId();
          setlistingFormData({})
          setSelectedLocation({
            label: '',
            value: { description: '' },
          })
          toggle()
          UiState.notify('Listing Added Successfully', 'success')

        } else {
          UiState.notify('Some thing went wrong', 'error')
          toggle()
        }

      }
      else {

        let arrayListingUpdating = UserState.currentBotData?.['listing']
        arrayListingUpdating[arrayIndexingListing] = {
          address: listingFormData.location,
          lat: listingFormData.lat,
          lng: listingFormData.lan,
          internalListingName: listingFormData.listingName,
          responderStatus: false,
          thumbnailUrl: '',
          hostawayListId: listingFormData.listingHostawayListId

        };


        const postData = {
          botId: UserState.currentBotData['_id'],
          listing: UserState.currentBotData?.['listing']
        }

        const { data, error } = await ListingService.updateListing(postData)
        if (!error) {
          getBotByUserId();
          toggle()
          setlistingFormData({})
          setArrayIndexingListing('')
          setSelectedLocation({
            label: '',
            value: { description: '' },
          })
          UiState.notify('Listing Updated Successfully', 'success')
        } else {
          toggle()
          UiState.notify('Some thing went wrong', 'error')
        }
      }

    }
  }


  const handleSwitchChange = async (rowData, checked, index) => {
    // console.log(rowData, checked);
    // if (UserState.currentBotData && UserState.currentBotData['listing'] && UserState.currentBotData['listing'][rowData['tableData'].id]) {
    //   UserState.currentBotData['listing'][rowData['tableData'].id].responderStatus = checked;
    // }

    if (UserState.currentBotData && UserState.currentBotData['listing'] && UserState.currentBotData['listing'][index]) {
      UserState.currentBotData['listing'][index].responderStatus = checked;
    }

    const updateResponderStatus = { botId: UserState.currentBotData?.['_id'], updateData: UserState.currentBotData };
    const { error, msg } = await ListingService.responderStatus(updateResponderStatus);

    if (!error) {
      getBotByUserId();
      UiState.notify(`AI respons Status ${checked ? 'enabled' : 'disabled'}`, 'success');
    } else {
      UiState.notify('Something went wrong', 'error');
    }
    
  };

  const getBotByUserId = async () => {
    const { error, data } = await BotService.getBotsByUserId({ userId: UserState.userData.userId });
    if (!error) {
      UserState.setCurrentBotData(data[0]);
    }
  }
  const deleteListing = async (id) => {
    const FilterArray = UserState.currentBotData?.['listing'];
    const images = FilterArray[id]?.images?.length > 0 ? FilterArray[id]?.images : [];
    FilterArray.splice(id, 1);
    
    const postData = {
      botId: UserState.currentBotData['_id'],
      listing: UserState.currentBotData?.['listing'],
      images: images
    }
    const { data, error } = await ListingService.deleteListing(postData)
    if (!error) {
      getBotByUserId();
      UiState.notify('Listing Deleted Successfully', 'success');
    } else {
      UiState.notify('Something went wrong', 'error');
    }
  }
  const deleteConfirm = (id) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure to do this.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteListing(id),
        },
        {
          label: 'No',
          onClick: () => null,
        },
      ],
    });
  };

  const header = (
    <h2>Listings ({list.length})</h2>
  );

  const titleCol = (data) => {
    let imageUrl = '';
    if (UserState.isOfflineStatus === 'offline') {
      imageUrl = `${baseURL}/${data?.['images']?.[0]?.['path']}`
    } else {
      imageUrl = data?.['thumbnailUrl']?.split("?")[0];
    }
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* @ts-ignore */}
        <img src={imageUrl} alt="" style={{ width: '30px', height: '30px', marginRight: '10px', borderRadius: '50%' }} onError={(e) => e.target.src = fallBack} />
        <span>{data.internalListingName}</span>
      </div>
    );
  }

  const aiStatus = (data, index) => {
    return (<IOSSwitch
      checked={data['responderStatus']}
      onChange={(event) => handleSwitchChange(data, event.target.checked, index)}
      name="activate-switch"
      inputProps={{ 'aria-label': 'user account status switch' }}
      sx={{ m: 1 }}
    />)
  }

  const actionCol = (data, key) => {
    return (
      <div className='d-flex justify-content-between'>
        <a
          style={{color: "#212529", cursor: "pointer"}}
          onClick={(e) => {
              e.preventDefault();
              UserState.setCurrentListingIndex(key);
              UserState.setSelectedListing(data);
              history.push('view-listings')
            }
          }
        >
          <VisibilityIcon className="text-lg" />
        </a>
        {
          UserState.isOfflineStatus === "offline" && (
            <a
              style={{color: "#fb6340", cursor: "pointer"}}
              onClick={(e) => {
                e.preventDefault();
                UserState.setMode('update');
                UserState.setSelectedListing(data);
                UserState.setListingData({
                  currentIndex: key,
                  propertyType: data?.propertyType,
                  typeOfPlace: data?.typeOfPlace,
                  selectedLocation: {
                    label: data?.address,
                    value: { description: data?.address },
                  },
                  location: data?.address,
                  lat: data?.lat,
                  lng: data?.lng,
                  basicInfo: {
                    maximumGuestAllowed: data?.otherInfo?.maximumGuestAllowed ? data?.otherInfo.maximumGuestAllowed : 4,
                    bedroom: data?.otherInfo?.bedroom ? data?.otherInfo.bedroom : 1,
                    bed: data?.otherInfo?.bed ? data?.otherInfo.bed : 1,
                    bathroom: data?.otherInfo?.bathroom ? data?.otherInfo.bathroom : 1,
                    partyAllowed: data?.otherInfo?.partyAllowed ? data?.otherInfo?.partyAllowed : 'No',
                    smokingAllowed: data?.otherInfo?.smokingAllowed ? data?.otherInfo?.smokingAllowed : 'No',
                    petAllowed: data?.otherInfo?.petAllowed ? data?.otherInfo?.petAllowed : 'No',
                    unmarriedCoupleAllowed: data?.otherInfo?.unmarriedCoupleAllowed ? data?.otherInfo?.unmarriedCoupleAllowed : 'No',
                    alcoholAllowed: data?.otherInfo?.alcoholAllowed ? data?.otherInfo?.alcoholAllowed : 'No',
                    wifiDetail: { userName: data?.otherInfo?.wifiDetail?.userName, password: data?.otherInfo?.wifiDetail?.password },
                    helpLineNumber: data?.otherInfo?.helpLineNumber
                  },
                  favourite: data?.favourites ? data?.favourites : [],
                  ameniti: data?.amenities ? data?.amenities : [],
                  safety: data?.safety ? data?.safety : [],
                  listingName: data?.internalListingName,
                  hostawayListId: data?.hostawayListId,
                  images: data?.images ? data?.images : [],
                  qrImg: data?.qrImg ? data?.qrImg : "",
                  link: data?.link ? data?.link : ""
                });
                history.push('/listing/create-or-update')
              }}
            >
              <EditIcon className="text-lg" />
            </a>
          )}

        <a
          style={{color: "#f5365c", cursor: "pointer"}}
          onClick={() => deleteConfirm(key)}
        >
          <DeleteSweepIcon className="text-lg" />
        </a>
      </div>
    )
  }


  useEffect(() => {
    // getListingFromHostaway()
    getBotByUserId();
  }, []);

  useEffect(() => {
    if (UserState?.currentBotData?.['listing']) {
      setList(UserState.currentBotData?.['listing']);
    }
  }, [UserState.currentBotData]);
  return (
    <div>
      <Modal isOpen={modalOfflineListing} toggle={() => {
        setlistingFormData({})
        setSelectedLocation({
          label: '',
          value: { description: '' },
        })

        toggle()
      }} >
        <ModalHeader toggle={() => {
          setlistingFormData({})
          setSelectedLocation({
            label: '',
            value: { description: '' },
          })
          toggle()
        }}>   {modeListing === "Add" ? ("Add Listing") : ("Update Listing")} </ModalHeader>
        <ModalBody>
          <Label for="listingname">
            Listing Name
          </Label>
          <Input
            id="listingName"
            name="listingName"
            placeholder="Enter Listing Name"
            type="text"
            value={listingFormData.listingName}
            onChange={handleInputValue}
          />
          <Label className='mt-2' for="enterAddress">
            Address
          </Label>
          <GooglePlacesAutocomplete
            apiKey='AIzaSyDb1RxdDKcMh7e2RpTpwwk_qzaKfry9fQA'
            selectProps={{
              value: selectedLocation,
              onChange: handleSelectLocation,
            }}
          />

          <Label className='mt-2' for="latitude">
            Latitude
          </Label>
          <Input
            id="lat"
            name="lat"
            placeholder="Enter Latitude"
            type="text"
            value={listingFormData.lat}
            onChange={handleInputValue}
          />
          <Label className='mt-2' for="longitude">
            Longitude
          </Label>
          <Input
            id="lan"
            name="lan"
            placeholder="Enter Longitude"
            type="text"
            value={listingFormData.lan}
            onChange={handleInputValue}
          />
          <Label className='mt-2' for="imageUpload">Upload Image</Label>
          <Input
            id="imageUpload"
            name="imageUpload"
            type="file"
            accept="image/*"  // Only allow image files
            onChange={handleImageUpload} // Handler for image selection
          />
          {selectedImage && <p>Selected Image: {selectedImage.name}</p>}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={submitFormListing}>
            {modeListing === "Add" ? ("Create") : ("Update Listing")}
          </Button>{' '}
          <Button color="secondary" onClick={() => {
            setlistingFormData({})
            setSelectedLocation({
              label: '',
              value: { description: '' },
            })
            toggle()
          }}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

      <Container fluid >
        <div className="header-body mt-5">
          <div className='createuser-btn'>
            {UserState.isOfflineStatus === 'offline' ? (
              <Button
                style={{ backgroundColor: '#051E5C', color: 'white' }}

                onClick={() => {
                  UserState.setMode("create");
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
                        partyAllowed: 'No',
                        smokingAllowed: 'No',
                        petAllowed: 'No',
                        unmarriedCoupleAllowed: 'No',
                        alcoholAllowed: 'No',
                        wifiDetail: {userName: '', password: ''},
                        helpLineNumber: ''
                    },
                    favourite: [],
                    ameniti: [],
                    safety: [],
                    listingName: '',
                    hostawayListId: '',
                    images: []
                });
                  // toggle()
                  history.push(`/listing/create-or-update`);
                }}
                className='mb-3'>
                Add Listing
              </Button>
            ) : (
              <Button
                style={{ backgroundColor: '#051E5C', color: 'white' }}
                onClick={() => { toggleModal(); setMode('add'); }}
                className='mb-3'>
                Import Listings
              </Button>

            )}
          </div>

          {/* <div className='table-style'>
            <MaterialTable
              title={<div style={{ fontWeight: 'bold' }}>Listings</div>}
              icons={tableIcons}
              columns={[
                {
                  title: 'Name',
                  field: 'internalListingName',
                  render: rowData => {
                    let imageUrl = '';
                    if (UserState.isOfflineStatus === 'offline') {
                      imageUrl = `${baseURL}/${rowData?.['images']?.[0]?.['path']}`
                    } else {
                      imageUrl = rowData?.['thumbnailUrl']?.split("?")[0];
                    }
                    return (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={imageUrl} alt="" style={{ width: '30px', height: '30px', marginRight: '10px', borderRadius: '50%' }} />
                        <span>{rowData.internalListingName}</span>
                      </div>
                    );
                  }
                },
                {
                  title: 'AI response status', field: 'response_status', align: 'center', render: rowData => (
                    <IOSSwitch
                      checked={rowData['responderStatus']}
                      onChange={(event) => handleSwitchChange(rowData, event.target.checked)}
                      name="activate-switch"
                      inputProps={{ 'aria-label': 'user account status switch' }}
                      sx={{ m: 1 }}
                    />
                  ),
                },
                { title: 'Address', field: 'address', align: 'center' },
              ]}
              actions={[
                {
                  icon: () => (
                    <VisibilityIcon className="text-lg" />
                  ),
                  tooltip: 'View',
                  onClick: (event, rowData) => {
                    UserState.setSelectedListing(rowData);
                    history.push('view-listings')
                  }
                },

                UserState.isOfflineStatus === "offline" && {
                  icon: () => (
                    <EditIcon className="text-lg" />
                  ),
                  tooltip: 'Edit',
                  onClick: (event, rowData) => {
                    UserState.setMode('update');
                    UserState.setSelectedListing(rowData);
                    console.log(rowData);
                    UserState.setListingData({
                      currentIndex: rowData.tableData.id,
                      propertyType: rowData?.propertyType,
                      typeOfPlace: rowData?.typeOfPlace,
                      selectedLocation: {
                          label: rowData?.address,
                          value: { description: rowData?.address },
                      },
                      location: rowData?.address,
                      lat: rowData?.lat,
                      lng: rowData?.lng,
                      basicInfo: {
                          maximumGuestAllowed: rowData?.otherInfo?.maximumGuestAllowed ? rowData?.otherInfo.maximumGuestAllowed : 4,
                          bedroom: rowData?.otherInfo?.bedroom ? rowData?.otherInfo.bedroom : 1,
                          bed: rowData?.otherInfo?.bed ? rowData?.otherInfo.bed : 1,
                          bathroom: rowData?.otherInfo?.bathroom ? rowData?.otherInfo.bathroom : 1,
                          partyAllowed: rowData?.otherInfo?.partyAllowed ? rowData?.otherInfo?.partyAllowed : 'No',
                          smokingAllowed: rowData?.otherInfo?.smokingAllowed ? rowData?.otherInfo?.smokingAllowed : 'No',
                          petAllowed: rowData?.otherInfo?.petAllowed ? rowData?.otherInfo?.petAllowed : 'No',
                          unmarriedCoupleAllowed: rowData?.otherInfo?.unmarriedCoupleAllowed ? rowData?.otherInfo?.unmarriedCoupleAllowed : 'No',
                          alcoholAllowed: rowData?.otherInfo?.alcoholAllowed ? rowData?.otherInfo?.alcoholAllowed : 'No',
                          wifiDetail: {userName: rowData?.otherInfo?.wifiDetail?.userName, password: rowData?.otherInfo?.wifiDetail?.password},
                          helpLineNumber: rowData?.otherInfo?.helpLineNumber
                      },
                      favourite: rowData?.favourites ? rowData?.favourites : [],
                      ameniti: rowData?.amenities ? rowData?.amenities : [],
                      safety: rowData?.safety ? rowData?.safety : [],
                      listingName: rowData?.internalListingName,
                      hostawayListId: rowData?.hostawayListId,
                      images: rowData?.images ? rowData?.images : []
                    });
                    history.push('/listing/create-or-update')

                  }
                },
                UserState.isOfflineStatus === "offline" && {
                  icon: () => (
                    <DeleteSweepIcon className="text-lg" />
                  ),
                  tooltip: 'Delete',
                  onClick: (event, rowData) => {
                    deleteConfirm(rowData.tableData.id);

                  }
                }
              ]}
              data={list}
              options={{
                actionsColumnIndex: -1,
                headerStyle: {
                  textAlign: 'center',
                  border: '1px solid rgba(224, 224, 224, 1)',
                  backgroundColor: '#f2f2f2',
                  fontWeight: 'bold'
                },
                rowStyle: {
                  // borderBottom: 'none',//'1px solid rgba(224, 224, 224, 1)',
                  // borderTop: 'none',
                  textAlign: 'center'
                },
                paging: false,
              }}
            />
          </div> */}
          {/* card style */}
          <DataTable value={list} header={header} className='shadow p-3 mb-5 bg-white rounded' style={{borderBottom: "2px solid rgb(5, 30, 92)"}}>
            <Column header="Title" body={titleCol}></Column>
            <Column field="response_status" header="AI Response" body={(data, options) => aiStatus(data, options.rowIndex)}></Column>
            {/* <Column field="address" header="Address"></Column>
            <Column body={(data, options) => actionCol(data, options.rowIndex)}></Column> */}
            {!UiState.isMobile && (
              <Column field="address" header="Address"></Column>
            )}

            {!UiState.isMobile && (
              <Column body={(data, options) => actionCol(data, options.rowIndex)}></Column>
            )}
          </DataTable>
         
          {/* <div>
            <h2>Listings</h2>
          </div> */}
          {
            // list.length > 0 ? list.map((data, key) => (
            //   <div className="row mb-2" key={key}>
            //     <div className="col-12">
            //       <div className="card">
            //         <div className="card-body">
            //         <div className="card-body">
            //           <div className="d-flex justify-content-between flex-wrap">
            //             <div>
            //               <h3>{data?.internalListingName}</h3>
            //               <h5>{data?.address}</h5>
            //               {
            //                 UserState.isOfflineStatus !== 'offline' && (
            //                   <div className='flex flex-wrap'>
            //                     <p>AI response status</p>
            //                     <IOSSwitch
            //                       checked={data?.['responderStatus']}
            //                       onChange={(event) => handleSwitchChange(data, event.target.checked)}
            //                       name="activate-switch"
            //                       inputProps={{ 'aria-label': 'user account status switch' }}
            //                       sx={{ m: 1 }}
            //                     />
            //                   </div>

            //                 )
            //               }
            //               <div className='mt-2'>
            //                 <button 
            //                   type="button" 
            //                   className="btn btn-outline-dark mb-2"
            //                   onClick={() => { 
            //                       UserState.setCurrentListingIndex(key);
            //                       UserState.setSelectedListing(data);
            //                       history.push('view-listings')
            //                     }
            //                   }
            //                 >
            //                   <VisibilityIcon className="text-lg" /> View
            //                 </button>
            //                 {
            //                   UserState.isOfflineStatus === "offline" && (
            //                   <button
            //                     type="button"
            //                     className="btn btn-outline-warning mb-2"
            //                     onClick={() => {
            //                       UserState.setMode('update');
            //                       UserState.setSelectedListing(data);
            //                       UserState.setListingData({
            //                         currentIndex: key,
            //                         propertyType: data?.propertyType,
            //                         typeOfPlace: data?.typeOfPlace,
            //                         selectedLocation: {
            //                             label: data?.address,
            //                             value: { description: data?.address },
            //                         },
            //                         location: data?.address,
            //                         lat: data?.lat,
            //                         lng: data?.lng,
            //                         basicInfo: {
            //                             maximumGuestAllowed: data?.otherInfo?.maximumGuestAllowed ? data?.otherInfo.maximumGuestAllowed : 4,
            //                             bedroom: data?.otherInfo?.bedroom ? data?.otherInfo.bedroom : 1,
            //                             bed: data?.otherInfo?.bed ? data?.otherInfo.bed : 1,
            //                             bathroom: data?.otherInfo?.bathroom ? data?.otherInfo.bathroom : 1,
            //                             partyAllowed: data?.otherInfo?.partyAllowed ? data?.otherInfo?.partyAllowed : 'No',
            //                             smokingAllowed: data?.otherInfo?.smokingAllowed ? data?.otherInfo?.smokingAllowed : 'No',
            //                             petAllowed: data?.otherInfo?.petAllowed ? data?.otherInfo?.petAllowed : 'No',
            //                             unmarriedCoupleAllowed: data?.otherInfo?.unmarriedCoupleAllowed ? data?.otherInfo?.unmarriedCoupleAllowed : 'No',
            //                             alcoholAllowed: data?.otherInfo?.alcoholAllowed ? data?.otherInfo?.alcoholAllowed : 'No',
            //                             wifiDetail: {userName: data?.otherInfo?.wifiDetail?.userName, password: data?.otherInfo?.wifiDetail?.password},
            //                             helpLineNumber: data?.otherInfo?.helpLineNumber
            //                         },
            //                         favourite: data?.favourites ? data?.favourites : [],
            //                         ameniti: data?.amenities ? data?.amenities : [],
            //                         safety: data?.safety ? data?.safety : [],
            //                         listingName: data?.internalListingName,
            //                         hostawayListId: data?.hostawayListId,
            //                         images: data?.images ? data?.images : [],
            //                         qrImg: data?.qrImg ? data?.qrImg : "",
            //                         link: data?.link ? data?.link : ""
            //                       });
            //                       history.push('/listing/create-or-update')
            //                     }}
            //                   >
            //                     <EditIcon className="text-lg" /> Edit
            //                   </button>
            //                 )}
                            
            //                   <button
            //                     type="button"
            //                     className="btn btn-outline-danger mb-2"
            //                     onClick={() => deleteConfirm(key)}
            //                   >
            //                     <DeleteSweepIcon className="text-lg" /> Delete
            //                   </button>
            //               </div>
            //             </div>
            //             <div>
            //               {(() => {
            //                 let imageUrl = '';
                            

            //                 if (UserState.isOfflineStatus === 'offline') {
            //                   imageUrl = `${baseURL}/${data?.['images']?.[0]?.['path']}`;
            //                 } else {
            //                   imageUrl = data?.['thumbnailUrl']?.split("?")[0];
            //                 }

            //                 // Check if the image URL is empty or invalid, and fallback to default image
            //                 const isValidImageUrl = imageUrl && imageUrl !== 'undefined' && imageUrl !== 'null';
                            
            //                 return (
            //                   <img
            //                     src={isValidImageUrl ? imageUrl : fallBack}
            //                     alt=""
            //                     style={{
            //                       width: UiState.isMobile ? '100%' : '50%',
            //                       // height: '15rem',
            //                     }}
            //                     // @ts-ignore
            //                     onError={(e) => e.target.src = fallBack}
            //                   />
            //                 );
            //               })()}
            //             </div>

            //           </div>
            //         </div>

            //         </div>
            //       </div>
            //     </div>
            //   </div>
            // )) : (
            //   <h3 className='text-center'>No data found</h3>
            // )
          }
        </div>
        {
          modal && (<CreateUserModel isOpen={modal} toggle={toggleModal} mode={mode} currentUser={currentUser} callback={getBotByUserId} />)
        }
      </Container>
    </div>

  );
};
export default observer(Index);