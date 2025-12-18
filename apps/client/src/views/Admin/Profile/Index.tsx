import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import { observer } from "mobx-react-lite";
import useStore from "apps/client/src/mobx/UseStore";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';
import "./Index.scss";
import AuthService from "apps/client/src/services/AuthService";
import Api, { baseURL } from "../../../utils/API";
import jwt_decode from "jwt-decode"

const Index: React.FC = () => {
  const { UserState, UiState } = useStore();
  const [profile, setProfile] = useState({
    name: UserState.userData.name,
    email: UserState.userData.email,
    mobile: UserState.userData.contactNo,
    profile: UserState.userData.profileImg
  });

  const [localPhoto, setLocalPhoto] = useState<string | null>(profile.profile);
  const photoInput = useRef<HTMLInputElement | null>(null);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        setLocalPhoto(evt.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("id", UserState.userData.userId);

    const { error, msg, token } = await AuthService.uploadImage(formData);

    if (!error) {
      Api.defaults.headers.common.Authorization = token
      localStorage.setItem("jwtToken", token)
      const decoded: any = jwt_decode(token)
      const isAuthenticated = true;
      const {
        id,
        email,
        name,
        userType,
        roles,
        profileImg,
        contactNo
      } = decoded;
      let rules_data = []
      if (roles != null || roles != undefined) {
        rules_data = roles;
      }

      await UserState.setCurrentUserState({
        id,
        email,
        name,
        userType,
        rules_data,
        isAuthenticated,
        profileImg,
        contactNo
      });

      UiState.notify(msg, "success");
    } else {
      UiState.notify(msg, "error");
    }

  };

  // @ts-ignore
  const handleSave = async () => {
    if (profile.name === "") {
      UiState.notify("Please enter the name", "error");
      return false;
    }

    if (profile.mobile === "") {
      UiState.notify("Please enter the mobile number", "error");
      return false;
    }

    const postData = {
      name: profile.name,
      contactNo: profile.mobile,
      id: UserState.userData.userId
    }

    const { error, msg, token } = await AuthService.updateProfile(postData);

    if (!error) {
      Api.defaults.headers.common.Authorization = token
      localStorage.setItem("jwtToken", token)
      const decoded: any = jwt_decode(token)
      const isAuthenticated = true;
      const {
        id,
        email,
        name,
        userType,
        roles,
        profileImg,
        contactNo
      } = decoded;
      let rules_data = []
      if (roles != null || roles != undefined) {
        rules_data = roles;
      }

      await UserState.setCurrentUserState({
        id,
        email,
        name,
        userType,
        rules_data,
        isAuthenticated,
        profileImg,
        contactNo
      });

      UiState.notify(msg, "success");
    } else {
      UiState.notify(msg, "error");
    }

  };



  return (
    <Card className="mt-5 mx-auto shadow-lg" style={{ maxWidth: "700px" }}>
      <CardBody>
        <CardTitle tag="h4" className="text-center mb-4">Profile</CardTitle>
        <div className="d-flex justify-content-center">
          <div className="position-relative text-center">
            <img
              src={
                localPhoto?.startsWith("data:image")
                  ? localPhoto
                  : `${baseURL}/${localPhoto}`
              }

              alt="Profile"
              className="rounded-circle border border-3 border-primary shadow"
              style={{ width: "130px", height: "130px", objectFit: "cover" }}
              onError={(e) => {
                // @ts-ignore
                e.target.onerror = null;
                // @ts-ignore
                e.target.src = "https://bootdey.com/img/Content/avatar/avatar1.png";
              }}
            />
            <Button
              color="primary"
              size="sm"
              className="position-absolute p-1 rounded-circle"
              style={{
                bottom: "10px",
                right: "10px",
                transform: "translate(50%, 50%)", // aligns it neatly on the image border
              }}
              onClick={() => photoInput.current?.click()}
            >
              <i className="fa fa-picture-o"></i>
            </Button>
            <input
              type="file"
              ref={photoInput}
              hidden
              accept="image/*"
              onChange={handlePhotoChange}
            />
          </div>
        </div>


        <div className="d-flex flex-column flex-md-row align-items-center gap-4">

          <Form className="flex-grow-1" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <FormGroup>
              <Label for="name">
                <i className="fa fa-user mr-2"></i>
                Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={profile.name}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="email">
                <i className="fa fa-envelope mr-2"></i>
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                disabled={true}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="mobile">
                <i className="fa fa-phone  mr-2"></i>
                Mobile
              </Label>
              <PhoneInput
                country={'in'}
                placeholder="Contact Number"
                // @ts-ignore
                type="number"
                id='numberInput'
                name='contactnumber'
                autoComplete="new-number"
                value={profile.mobile ? `+${profile.mobile}` : ''}
                onChange={(value) => {
                  // Remove the "+" before saving
                  const mobile = value.replace(/^\+/, '');
                  setProfile((prev) => ({ ...prev, mobile }));
                }}
                inputClass={`form-control w-100`}
              />
            </FormGroup>

            <div className="d-flex flex-wrap justify-content-between mt-4 gap-2">
              <Button type="submit" color="success">Save</Button>
            </div>
          </Form>
        </div>
      </CardBody>
    </Card>
  );
};

export default observer(Index);
