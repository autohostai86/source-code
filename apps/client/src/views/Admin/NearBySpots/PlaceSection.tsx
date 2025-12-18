import { ClassNames } from '@emotion/react';
import { Card } from '@material-ui/core';
import { CardActionArea, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import UiState from 'apps/client/src/mobx/states/UiState';
import NearBySpotsService from 'apps/client/src/services/NearBySpotsService';
import React, { useEffect, useState } from 'react';
import { Button, Col, Row } from 'reactstrap';

interface PlaceEntry {
  location: string;
  address: string;
  description: string;
  image: string;
  minutes: number;
  distance: number;
}

interface PlaceSectionProps {
  title: string;
  places: PlaceEntry[];
  toggleModal: (place, index) => void;
  setMode
}

const PlaceSection: React.FC<PlaceSectionProps> = ({ title, places, toggleModal, setMode }) => {
  // console.log(places)
  return (
    <div className="App mt-4">
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: "wrap" }}>
        <label className="text-lg font-extrabold">{title}</label>
        <button className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded"
          style={{ backgroundColor: "white", border: '1px solid grey' }}
          onClick={() => { setMode('add'); toggleModal('', '') }}>
          + Add
        </button>
      </div>
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          {places.length === 0 ? <p>Add {title} in this listing</p> :
            <div className="mt-2">
              <Row className='mt-5'>
                {places.map((place, index) => (
                  <Col lg={3} md={6} sm={12} xs={12} key={index}>
                    <Card onClick={() => {
                      setMode('edit')
                      toggleModal(place, index)
                    }} className='near-by-spots'>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="140"
                          style={{ alignContent: "center" }}
                          image={place.image}
                          alt={place.location}
                        />
                        <CardContent>
                          <Grid container spacing={1}>
                            <Grid item xs={12}>
                              <Typography variant="body2" component="p" textAlign="left">
                                <strong>Location:</strong> {place.location}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="body2" component="p" textAlign="left">
                                <strong>Address:</strong> {place.address}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="body2" component="p" textAlign="left">
                                <strong>Distance:</strong> {place.distance} km ({place.minutes} mins)
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default PlaceSection;
