/** @format */
// @ts-nocheck
import { observer } from "mobx-react-lite";
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './Index.css'; // Optionally add styling for your App component
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import Select from 'react-select';
import upload from "../../../assets/img/upload.png"
import UiState from "apps/client/src/mobx/states/UiState";
const Index = () => {
  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const optionList = [
    { label: 'abc', value: 'abc' }
  ]
  const [dataSource, setdataSource] = useState({});
const handlSubmit= async () => {
  console.log(dataSource);
  
  if(JSON.stringify(dataSource) === "{}"){
    UiState.notify("Enter Data Source", error)
    return ; 
  }
}
  return (
    <div className="App mt-6">
      <Label for="pmsType">Data Source Type</Label>
      <Select
        id='pmsType'
        options={optionList}
        value={dataSource}
        onChange={(e) => setdataSource(e)}
      // required={true}
      />
      <header className="App-header mt-5">
        <div className="upload-container" {...getRootProps()}>
          <input {...getInputProps()} />
          <div className="icon-container">

            <div className="upload-icon">
              <img src={upload} alt="" />
            </div>
            {isDragActive ? (
              <p className="drag-text">Drop the files here...</p>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-2">Drag and drop some files</p>
                <p className="text-gray-600 text-sm">Or </p>
                <p className="text-gray-600 text-sm">Browse</p>
              </div>

            )}
          </div>
        </div>
      </header>

      <div className="button-container">
        <Button type="submit" className="custom-button-settings btn btn-secondary" onSubmit={handlSubmit}>Upload</Button>
      </div>
    </div>
  );
}

export default observer(Index);
