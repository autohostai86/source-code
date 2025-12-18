/* eslint-disable prettier/prettier */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { toJS } from "mobx";
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Doughnut, Pie, Bar } from 'react-chartjs-2';
import { Button, Card, CardTitle, Input, Row, Col, CardBody, Container, Form, FormGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader, FormFeedback } from 'reactstrap';
import MaterialTable from 'material-table'
// import { Colxx } from '../../../components/common/CustomBootstrap';
// import { NotificationManager } from '../../../components/common/react-notifications';
import IntlMessages from '../../../helpers/IntlMessages';
import useStore from '../../../mobx/UseStore';
// import { chartColors } from '../../../components/common/colors';
import BotService from 'apps/client/src/services/BotService';
import { ClassNames } from '@emotion/react';
import UserService from 'apps/client/src/services/UserService';
import PropTypes from 'prop-types';
import { action } from 'mobx';
import DeleteIcon from '@mui/icons-material/Delete';
import tableIcons from 'apps/client/src/components/TableIcon';
import Edit from '@material-ui/icons/Edit';
import Switch, { SwitchProps } from '@mui/material/Switch';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { styled } from '@mui/system';
import theme from '../../../styled-theme'
import { SxProps } from '@mui/system';
import './Index.scss'
import routes from '../routes';
import FormControlLabel from '@mui/material/FormControlLabel';
// eslint-disable-next-line arrow-body-style
const CreateUserModel = (props) => {
  const { className, isOpen, toggle, mode, currentUser, callback } = props;
  const { UserState, UiState } = useStore();
  const [formData, setFormData] = useState({
    _id: currentUser['_id'],
    userName: mode === 'edit' && currentUser ? currentUser['userName'] : '',
    email: mode === 'edit' && currentUser ? currentUser['email'] : '',
    contactNo: mode === 'edit' && currentUser ? currentUser['contactNo'] : '',
    roles: [], //mode === 'edit' && currentUser ? currentUser['roles'] : '',
    password: '',
    userNameValidation: false,
    userNameError: '',
    emailValidation: false,
    emailError: '',
    contactNoValidation: false,
    contactNoError: '',
    passwordValidation: false,
    passwordError: ''
  });
  const [cSelected, setCSelected] = useState([]);
  console.log(formData)
  const onChangeHandler = (e) => {
    const key = e.target.name
    const value = e.target.value
    setFormData(
      { ...formData, [key]: value }
    )
    // console.log(formData)
  }
  console.log(formData.roles)
  // @ts-ignore
  const onClickHandler = async () => {
    if (formData['userName'] === '') {
      setFormData({ ...formData, userNameValidation: true, userNameError: 'Please enter user name' })
      return false;
    }
    if (formData['email'] === '') {
      setFormData({ ...formData, emailValidation: true, emailError: 'Please enter your email ID' })
      return false;
    }
    if (formData['contactNo'] === '') {
      setFormData({ ...formData, contactNoValidation: true, contactNoError: 'Please enter your contact Number' })
      return false;
    }
    if (formData['password'] === '' && mode !== 'edit') {
      setFormData({ ...formData, passwordValidation: true, passwordError: 'Please enter password' })
      return false;
    }
    setFormData(prevFormData => {
      const updatedFormData = { ...prevFormData, roles: cSelected };
      if (mode === 'edit') {
        UserService.editUser(updatedFormData).then(({ error, msg }) => {
          if (!error) {
            toggle();
            UiState.notify(msg, 'success');
            callback();
          } else {
            UiState.notify(msg, 'error');
          }
        });
      } else if (mode === 'add') {
        UserService.createuser(updatedFormData).then(({ error, msg }) => {
          if (!error) {
            toggle();
            UiState.notify(msg, 'success');
            callback();
          } else {
            UiState.notify(msg, 'error');
          }
        });
      }
      return updatedFormData;
    });
  };


  // @ts-ignore
  const handleSwitchChange = async (selected) => {
    // Update the user's account status based on the switch state
    const index = cSelected.indexOf(selected);
    if (index < 0) {
      cSelected.push(selected);
    } else {
      cSelected.splice(index, 1);
    }
    setCSelected([...cSelected]);
  }

  useEffect(() => {
    if (currentUser.roles != null) {
      setCSelected(currentUser.roles);
    }

    setFormData({
      ...formData,
      roles: currentUser.roles
    })
  }, [currentUser.roles])

  const closeBtn = (
    <button className="close" onClick={toggle} type="button">
      &times;
    </button>
  );
  return (
    <Container fluid>
      <div className="header-body mt-5 ">
        <Modal isOpen={isOpen} toggle={toggle} centered>
          <ModalHeader toggle={toggle}><h3>{mode === 'edit' ? 'Update User' : 'Create User'}</h3></ModalHeader>
          <ModalBody>
            <div className="App">
              <Form className="form">
                <FormGroup>
                  <Label for="userName">User Name</Label>
                  <Input
                    type="text"
                    name="userName"
                    id="userName"
                    placeholder="User"
                    onChange={(e) => onChangeHandler(e)}
                    invalid={formData['userNameValidation']}
                    value={formData['userName']}
                  />
                  {
                    formData['userNameValidation'] ? (
                      <FormFeedback>
                        {formData['userNameError']}
                      </FormFeedback>
                    )
                      : null
                  }
                </FormGroup>
                <FormGroup>
                  <Label for="exampleEmail">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    id="exampleEmail"
                    placeholder="example@example.com"
                    onChange={(e) => onChangeHandler(e)}
                    invalid={formData['emailValidation'] ? true : false}
                    value={formData['email']}
                  />
                  {
                    formData['emailValidation'] ? (
                      <FormFeedback>
                        {formData['emailError']}
                      </FormFeedback>
                    )
                      : null
                  }
                </FormGroup>
                <FormGroup>
                  <Label for="exampleContactNo">Contact Number (Whatsapp)</Label>
                  <Input
                    type="tel"
                    name="contactNo"
                    id="exampleContactNo"
                    placeholder="Contact Number"
                    onChange={(e) => onChangeHandler(e)}
                    invalid={formData['contactNoValidation'] ? true : false}
                    value={formData['contactNo']}
                  />
                  {
                    formData['contactNoValidation'] ? (
                      <FormFeedback>
                        {formData['contactNoError']}
                      </FormFeedback>
                    )
                      : null
                  }
                </FormGroup>
                <FormGroup>
                  <Label for="examplePassword">Password</Label>
                  <Input
                    type="password"
                    name="password"
                    id="examplePassword"
                    placeholder="********"
                    onChange={(e) => onChangeHandler(e)}
                    invalid={formData['passwordValidation'] ? true : false}
                  />
                  {
                    formData['passwordValidation'] ? (
                      <FormFeedback>
                        {formData['passwordError']}
                      </FormFeedback>
                    )
                      : null
                  }
                </FormGroup>
                <FormGroup>
                  <Label for="userPermition">User Permission</Label>
                  <Col md={12}>
                    {UserState.userData.userType === "admin" && (
                      <Row>
                        {routes.map((route, index) => (
                          // Use conditional rendering to exclude the "Logout" item
                          route.name !== "Dashboard" && route.isAdmin === false && (
                            <Col md={6} key={index}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <IOSSwitch
                                      name="permition-switch"
                                      sx={{ m: 1 }}
                                    />
                                  }
                                  checked={cSelected.includes(route.name)}
                                  onChange={() => handleSwitchChange(route.name)}
                                  label={route.name}
                                />

                              </FormGroup>
                            </Col>
                          )
                        ))}
                      </Row>
                    )}
                  </Col>
                </FormGroup>

              </Form>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button className='btn-darkblue' onClick={onClickHandler}>
              {mode === 'edit' ? 'Update' : 'Create'}
            </Button>
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
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState(false);
  const [check, setCheck] = useState('')
  const [currentUser, setCurretnUser] = useState({})
  const [mode, setMode] = useState('')
  const toggleModal = async () => {
    setModal(!modal);
  };
  const userDetails = async () => {
    // @ts-ignore
    const { data, error } = await UserService.fetchUser()
    if (!error) {
      setUsers(data)
    }
  }
  const deleteConfirm = (e, id) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure to do this.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteHandler(id)
        },
        {
          label: 'No',
          onClick: () => null
        }
      ]
    });
  }
  const deleteHandler = async (reqData) => {
    const { error, msg } = await UserService.deleteUser({ _id: reqData['_id'] })
    if (!error) {
      UiState.notify('User deleted', 'success')
      userDetails()
    } else {
      UiState.notify('Some thing went wrong', 'error')
    }
  }

  const handleSwitchChange = async (rowData, checked) => {
    // Update the user's account status based on the switch state
    try {
      const updatedUser = { ...rowData, accountStatus: checked };
      const { error, msg } = await UserService.editUser(updatedUser);
      if (!error) {
        userDetails(); // Refresh the user data
        UiState.notify(`User ${checked ? 'enabled' : 'disabled'} successfully`, 'success');
      } else {
        UiState.notify('Something went wrong', 'error');
      }
    } catch {
      UiState.notify('Something went wrong', 'error');
    }
  };


  // console.log(currentUser)
  useEffect(() => {
    userDetails()
  }, [])
  return (
    <div>
      <Container fluid >
        <div className="header-body mt-5">
          <div className='createuser-btn'>
            <Button onClick={() => { toggleModal(); setMode('add'); setCurretnUser({}) }} className='mb-3 btn-darkblue' >
              <i className="fa fa-plus" aria-hidden="true"></i> &nbsp;
              Create User
            </Button>
          </div>
          <div className='table-style'>
            <MaterialTable
              // sx={{}}
              title="Users"
              icons={tableIcons}
              columns={[
                { title: 'Name', field: 'userName', align: 'center' },
                { title: 'Email', field: 'email', align: 'center' },
                { title: 'User Type', field: 'userType', align: 'center' },
                { title: 'Contact No', field: 'contactNo', align: 'center' },
                {
                  title: 'Active', field: 'active', align: 'center', render: rowData => (
                    <IOSSwitch
                      checked={rowData['accountStatus']}
                      onChange={(event) => handleSwitchChange(rowData, event.target.checked)}
                      name="activate-switch"
                      inputProps={{ 'aria-label': 'user account status switch' }}
                      sx={{ m: 1 }}
                    />
                  ),
                },
              ]}
              data={users}
              actions={[
                {
                  icon: () => <Edit className='edit-icon' />,
                  tooltip: 'Edit',
                  onClick: (event, rowData) => {
                    toggleModal()
                    setMode('edit')
                    setCurretnUser(rowData)
                  }
                },
                {
                  icon: () => <DeleteIcon className='delet-icon' />,
                  tooltip: 'Delete',
                  onClick: (event, rowData) => {
                    deleteConfirm(event, rowData)
                  }
                },
              ]}
              options={{
                actionsColumnIndex: -1,
                headerStyle: {
                  textAlign: 'center',
                  border: '1px solid rgba(224, 224, 224, 1)',
                  backgroundColor: '#f2f2f2',
                },
                rowStyle: {
                  border: '1px solid rgba(224, 224, 224, 1)',
                  textAlign: 'center'
                },
                paging: false,
              }}
            />
          </div>
        </div>
        {
          modal && (<CreateUserModel isOpen={modal} toggle={toggleModal} mode={mode} currentUser={currentUser} callback={userDetails} />)
        }
      </Container>
    </div>

  );
};
export default observer(Index);