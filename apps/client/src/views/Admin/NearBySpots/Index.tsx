/** @format */
// @ts-nocheck
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from 'react';
import './Index.css'; // Optionally add styling for your App component
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input, FormFeedback } from 'reactstrap';
import PlaceSection from './PlaceSection'; // Import the PlaceSection component
import NearBySpotsService from "apps/client/src/services/NearBySpotsService";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import useStore from '../../../mobx/UseStore';
import { confirmAlert } from "react-confirm-alert";
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from "@mui/material";

interface ModalProps {
  isOpen: boolean;
  toggle: () => void;
  onSave: (entry: PlaceEntry) => void;
  botDetails: [];
  category: string;
  mode: string;
  editPlace: object;
  callBack: () => void
}

interface PlaceEntry {
  location: string;
  address: string;
  description: string;
  image: string;
  minutes: number;
  distance: number;
}


const AddPlaceModal: React.FC<ModalProps> = ({ isOpen, toggle, onSave, botDetails, category, mode, editPlace, callBack }) => {
  const { UserState, UiState } = useStore();
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<PlaceEntry>({
    location: '',
    address: '',
    description: '',
    image: '',
    minutes: null,
    distance: null,
  });
  const [validation, setValidation] = useState({
    locationValidation: false,
    locationError: '',
    addressValidation: false,
    addressError: '',
  })
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSave = async () => {
    if (formData['location'] === '') {
      setValidation({ ...validation, locationValidation: true, locationError: 'Please enter the location' })
      return false;
    }
    if (formData['address'] === '') {
      setValidation({ ...validation, addressValidation: true, addressError: 'Please enter the Address' })
      return false;
    }
    setFormData({ ...formData })
    await onSave(formData);
    setValidation({ addressValidation: false, locationValidation: false })
    setFormData({
      location: '',
      address: '',
      description: '',
      image: '',
      minutes: null,
      distance: null,
    });
    toggle();
  };
  const handleSelect = async (e) => {
    setIsLoading(true)
    const destination = e.label
    const { error, msg, data, diraction } = await NearBySpotsService.nearByPlaces(destination, botDetails.lat, botDetails.lng);
    if (!error) {
      setValidation({ ...validation, locationValidation: false })
      const distance = diraction.routes[0] ? diraction.routes[0].legs[0].distance.value / 1000 : null
      const dutation = diraction.routes[0] ? Math.ceil(diraction.routes[0].legs[0].duration.value / 60) : null
      const photoReference = data.results[0].photos[0].photo_reference
      const imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=AIzaSyDb1RxdDKcMh7e2RpTpwwk_qzaKfry9fQA`
      setFormData({
        ...formData, location: destination, address: data.results[0].formatted_address, image: imageUrl, distance: distance, minutes: dutation
      })
    } else {
      UiState.notify('Some thing went wrong', 'error')
    }
    setIsLoading(false)
  };

  const deleteConfirm = (rowData) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure to do this.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteHandler()
        },
        {
          label: 'No',
          onClick: () => null
        }
      ]
    });
  }

  const deleteHandler = async () => {

    const aptDetails = {
      botId: UserState.currentBotData?.['_id'],
      // @ts-ignore
      aptNo: botDetails['internalListingName'],
      listIndex: UserState.currentListingIndex,
      index: editPlace.index,
      category: category,
    }

    const { error, msg } = await NearBySpotsService.deleteSpots(aptDetails)
    if (!error) {
      callBack()
      UiState.notify('Place Deleted', 'success')
    } else {
      UiState.notify('Some thing went wrong', 'error')
    }
  }
  useEffect(() => {
    if (mode === 'edit' && editPlace) {
      setFormData({
        location: editPlace.placeDetails.location,
        address: editPlace.placeDetails.address,
        description: editPlace.placeDetails.description,
        image: editPlace.placeDetails.image,
        minutes: editPlace.placeDetails.minutes,
        distance: editPlace.placeDetails.distance,
      });
    } else {
      setFormData({
        location: '',
        address: '',
        description: '',
        image: '',
        minutes: null,
        distance: null,
      });
    }
  }, [mode, editPlace]);
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>
        <div className="text-lg p-0">
          {mode === 'edit' ? 'Edit Place' : 'Add new place'}
        </div>
      </ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="location">Enter a location</Label>
            <GooglePlacesAutocomplete
              apiKey='AIzaSyDb1RxdDKcMh7e2RpTpwwk_qzaKfry9fQA'
              selectProps={{
                onChange: handleSelect,
                placeholder: 'type a address or place to search',
                // defaultOptions:[{value: '', label: 'type a address or place '}]
              }}
            />
            {
              validation['locationValidation'] ? (
                <FormFeedback>
                  {validation['locationError']}
                </FormFeedback>
              )
                : null
            }
          </FormGroup>
          {formData.location ?
            <>
              <FormGroup>
                <Label for="address">Address</Label>
                <Input type="text" name="address" id="address" placeholder="Enter an address" value={formData.address} onChange={handleChange} invalid={validation['addressValidation']} />
                {
                  validation['addressValidation'] === true ? (
                    <FormFeedback>
                      {validation['addressError']}
                    </FormFeedback>
                  )
                    : null
                }
              </FormGroup>
              <FormGroup>
                <Label for="description">Description</Label>
                <Input type="textarea" name="description" id="description" placeholder="Enter a description" value={formData.description} onChange={handleChange} />
              </FormGroup>
              <FormGroup>
                <Label for="image">Image URL</Label>
                <Input type="text" name="image" id="image" placeholder="Enter an image URL" value={formData.image} onChange={handleChange} />
              </FormGroup>
              <FormGroup>
                <Label for="minutes">Minutes from Property</Label>
                <Input type="number" name="minutes" id="minutes" placeholder="Enter minutes from property" value={formData.minutes} onChange={handleChange} />
              </FormGroup>
              <FormGroup>
                <Label for="distance">Distance from Property (km)</Label>
                <Input type="number" name="distance" id="distance" placeholder="Enter distance from property" value={formData.distance} onChange={handleChange} />
              </FormGroup>
            </> : null
          }
        </Form>
      </ModalBody>
      <ModalFooter>
        {mode === 'edit' && editPlace ? (
          <IconButton aria-label="delete" onClick={() => { toggle(null); deleteConfirm(editPlace) }} className='mr-3' sx={{ size: 'lg' }}>
            <DeleteIcon />
          </IconButton>
        ) : null
        }
        <Button color="secondary" onClick={toggle}>Cancel</Button>
        <Button className="" onClick={handleSave} style={{ backgroundColor: '#051E5C', color: 'white' }} disabled={isLoading}>{mode === 'edit' ? isLoading ? (<><i className='fa fa-refresh fa-spin'></i> <span>update</span></>) : (<span>update</span>) : isLoading ? (<><i className='fa fa-refresh fa-spin'></i> <span>Save</span></>) : (<span>Save</span>)}</Button>
      </ModalFooter>
    </Modal>
  );
};

const Index = (botDetails) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { UserState, UiState } = useStore();
  const [mode, setMode] = useState('')
  const [places, setPlaces] = useState<{ [key: string]: PlaceEntry[] }>({
    restaurants: [],
    activities: [],
    shopping: [],
    supermarket: [],
    airport: [],
    bus: [],
    train: [],
    medical: [],
  });

  const [editPlace, setEditPlace] = useState({});
  const botId = UserState.currentBotData?.['_id'];
  const [newCategoryName, setNewCategoryName] = useState('');
  const fetchSpots = async () => {
    const aptDetaile = {
      botId,
      // @ts-ignore
      aptNo: botDetails['internalListingName']
    }
    const { error, data } = await NearBySpotsService.fetchSpots(aptDetaile)
    if (!error) {
      const predefinedCategories = {
        restaurants: [],
        activities: [],
        shopping: [],
        supermarket: [],
        airport: [],
        bus: [],
        train: [],
        medical: [],
      };
      if (data.listing.length > 0 && data.listing[0].nearBySpots) {
        const spots = data.listing[0].nearBySpots
        // setPlaces({ 
        //   ...places,
        //   restaurants: spots.restaurants && spots.restaurants.length > 0 ? spots.restaurants : [],
        //   activities: spots.activities && spots.activities.length > 0 ? spots.activities : [],
        //   shopping: spots.shopping && spots.shopping.length > 0 ? spots.shopping : [],
        //   airport: spots.airport && spots.airport.length > 0 ? spots.airport : [],
        //   bus: spots.bus && spots.bus.length > 0 ? spots.bus : [],
        //   train: spots.train && spots.train.length > 0 ? spots.train : [],
        //   supermarket: spots.supermarket && spots.supermarket.length > 0 ? spots.supermarket : [],
        //   medical: spots.medical && spots.medical.length > 0 ? spots.medical : []
        // })
        
        const mergedCategories = {
          ...predefinedCategories,
          ...spots,
        };
  
        setPlaces(mergedCategories);
      } else {
        setPlaces(predefinedCategories);
      }
    } else {
      UiState.notify('Some thing went wrong', 'error')
    }
  }

  const toggleModal = (category: string | null = null, placeDetails: object | null = null, index: number | null = null) => {
    if (placeDetails !== null) {
      setEditPlace({ placeDetails, index })
    }
    setActiveCategory(category);
    setIsModalOpen(!isModalOpen);
  };


  const handleSave = async (entry: PlaceEntry) => {
    if (activeCategory) {
      if (mode === 'add') {
        const addPlaces = {
          [activeCategory]: [entry]
        }

        if (addPlaces[activeCategory]) {
          const aptDetaile = {
            botId,
            listIndex: UserState.currentListingIndex,
            category: activeCategory,
            // @ts-ignore
            aptNo: botDetails['internalListingName'],
            nearBySpots: addPlaces
          }

          const { error, data } = await NearBySpotsService.addSpots(aptDetaile)
          if (!error) {
            fetchSpots()
            UiState.notify('Place added', 'success')
          } else {
            UiState.notify('Some thing went wrong', 'error')
          }
        }
      } else {
        const aptDetails = {
          botId,
          // @ts-ignore
          aptNo: botDetails['internalListingName'],
          listIndex: UserState.currentListingIndex,
          index: editPlace.index,
          category: activeCategory,
          updateDetails: entry
        }
        const { error, data } = await NearBySpotsService.editSpots(aptDetails)
        if (!error) {
          fetchSpots()
          UiState.notify('Updated', 'success')
        } else {
          UiState.notify('Some thing went wrong', 'error')
        }
      }
    }
  };

  const handleAddCategory = () => {
    if (newCategoryName === '') {
      UiState.notify("Please enter the category name", "error");
      return false;
    }
    if (newCategoryName.trim() && !places[newCategoryName]) {
      setPlaces({
        ...places,
        [newCategoryName]: [],
      });
      setNewCategoryName('');
      UiState.notify('Category added', 'success');
    } else {
      UiState.notify('Category already exists or name is invalid', 'error');
    }
  };

  useEffect(() => {
    fetchSpots()
  }, [])
  return (
    <>
      <div className="d-flex flex-wrap">
        <input
          type="text"
          className={`form-control ${UiState.isDesktop ? "w-25 mr-2" : UiState.isIpad ? "w-50 mr-2" : "w-100"}`}
          placeholder="Enter category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <button onClick={handleAddCategory} className={`btn btn-outline-default ${UiState.isMobile && "w-100 mt-1"}`}>Add Category</button>
      </div>
      {/* <PlaceSection
        title="Restaurants"
        places={places.restaurants}
        toggleModal={(placeDetails, index) => toggleModal('restaurants', placeDetails, index)}
        setMode={setMode}
      />

      <PlaceSection
        title="Activities"
        places={places.activities}
        toggleModal={(placeDetails, index) => toggleModal('activities', placeDetails, index)}
        setMode={setMode}
      />

      <PlaceSection
        title="Shopping"
        places={places.shopping}
        toggleModal={(placeDetails, index) => toggleModal('shopping', placeDetails, index)}
        setMode={setMode}
      />

      <PlaceSection
        title="Airport"
        places={places.airport}
        toggleModal={(placeDetails, index) => toggleModal('airport', placeDetails, index)}
        setMode={setMode}
      />

      <PlaceSection
        title="Bus"
        places={places.bus}
        toggleModal={(placeDetails, index) => toggleModal('bus', placeDetails, index)}
        setMode={setMode}
      />

      <PlaceSection
        title="Train"
        places={places.train}
        toggleModal={(placeDetails, index) => toggleModal('train', placeDetails, index)}
        setMode={setMode}
      />

      <PlaceSection
        title="Super Market"
        places={places.supermarket}
        toggleModal={(placeDetails, index) => toggleModal('supermarket', placeDetails, index)}
        setMode={setMode}
      />

      <PlaceSection
        title="Medical"
        places={places.medical}
        toggleModal={(placeDetails, index) => toggleModal('medical', placeDetails, index)}
        setMode={setMode}
      /> */}
      {Object.keys(places).map((category) => (
        <PlaceSection
          key={category}
          title={category.charAt(0).toUpperCase() + category.slice(1)}
          places={places[category]}
          toggleModal={(placeDetails, index) => toggleModal(category, placeDetails, index)}
          setMode={setMode}
        />
      ))}


      <AddPlaceModal isOpen={isModalOpen} toggle={() => toggleModal(null)} onSave={handleSave} botDetails={botDetails} category={activeCategory} mode={mode} editPlace={editPlace} callBack={fetchSpots} />
    </>
  );
};

export default observer(Index);
