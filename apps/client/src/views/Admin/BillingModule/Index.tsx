/* eslint-disable prettier/prettier */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { toJS } from "mobx";
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Doughnut, Pie, Bar } from 'react-chartjs-2';
import {
  Button,
  Card,
  CardTitle,
  Input,
  Row,
  Col,
  CardBody,
  Container,
  Form,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  FormFeedback,
} from 'reactstrap';
import MaterialTable from 'material-table';
import { TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import useStore from '../../../mobx/UseStore';
import DeleteIcon from '@mui/icons-material/Delete';
import tableIcons from 'apps/client/src/components/TableIcon';
import Edit from '@material-ui/icons/Edit';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import './Index.scss';
import BillingService from 'apps/client/src/services/BillingService';
// eslint-disable-next-line arrow-body-style
const CreateBillingModel = (props) => {
  const { isOpen, toggle, mode, currentBilling, callback } = props;
  const { UserState, UiState } = useStore();
  const [formData, setFormData] = useState({
    id: currentBilling['_id'] ? currentBilling['_id'] : '',
    title: currentBilling['title'] ? currentBilling['title'] : '',
    description: currentBilling['description'] ? currentBilling['description'] : '',
    durationType: currentBilling['durationType'] ? currentBilling['durationType'] : '',
    validityPeriod: currentBilling['validityPeriod'] ? currentBilling['validityPeriod'] : '',
    price: currentBilling['price'] ? currentBilling['price'] : '',
    titleValidation: false,
    titleError: '',
    descriptionValidation: false,
    descriptionError: '',
    validityPeriodValidation: false,
    validityPeriodError: '',
    isPriceError: false,
    priceErrorMsg: '',
    category: currentBilling['category'] ? currentBilling['category'] : 'free',
    isCategoryError: false,
    categoryErrorMsg: '',
  });
  const onChangeHandler = (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setFormData({ ...formData, [key]: value });
  };
  // @ts-ignore
  const onClickHandler = async () => {
    if (formData['title'] === '') {
      setFormData({
        ...formData,
        titleValidation: true,
        titleError: 'Please enter a title',
      });
      return false;
    }
    if (formData['description'] === '') {
      setFormData({
        ...formData,
        descriptionValidation: true,
        descriptionError: 'Please enter the description',
      });
      return false;
    }
    if (formData['category'] !== "payAsYouGo") {      
      if (formData['validityPeriod'] === '' || !(/^[1-9]\d*$/.test(formData['validityPeriod']))) {
        setFormData({
          ...formData,
          validityPeriodValidation: true,
          validityPeriodError: 'Please enter a valid number',
        });
        return false;
      }
  
      if (formData['price'] === '') {
        setFormData({
          ...formData,
          isPriceError: true,
          priceErrorMsg: 'Please enter the price',
        });
        return false;
      }
    }
    if (mode === 'edit') {
      const { error, msg } = await BillingService.editBilling(formData);
      if (!error) {
        toggle();
        UiState.notify('Successfully Updated', 'success');
        callback();
      } else {
        UiState.notify('Something went wrong', 'error');
      }
    }
    if (mode === 'add') {
      const { error, msg } = await BillingService.createBilling(formData);
      if (!error) {
        toggle();
        UiState.notify('Record is added successfully', 'success');
        callback();
      } else {
        UiState.notify('Something went wrong', 'error');
      }
    }
  };

  const closeBtn = (
    <button className="close" onClick={toggle} type="button">
      &times;
    </button>
  );
  return (
    <Container fluid>
      <div className="header-body mt-5 ">
        <Modal isOpen={isOpen} toggle={toggle} centered>
          <ModalHeader toggle={toggle}>
            <h3>{mode === 'edit' ? 'Edit Billings' : 'Create Billings'}</h3>
          </ModalHeader>
          <ModalBody>
            <div className="App">
              <Form className="form">
                <FormGroup>
                  <Label for="category">Category</Label>
                  <Input
                    type="select"
                    name="category"
                    id="category"
                    onChange={(e) => onChangeHandler(e)}
                    value={formData['category']}
                  >
                    <option value="free">Free</option>
                    <option value="payAsYouGo">Pay As You Go</option>
                  </Input>
                  {formData['isCategoryError'] ? (
                    <FormFeedback>{formData['categoryErrorMsg']}</FormFeedback>
                  ) : null}
                </FormGroup>
                <FormGroup>
                  <Label for="title">Title</Label>
                  <Input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Title"
                    onChange={(e) => onChangeHandler(e)}
                    value={formData['title']}
                    invalid={formData['titleValidation'] ? true : false}
                  />
                  {formData['titleValidation'] ? (
                    <FormFeedback>{formData['titleError']}</FormFeedback>
                  ) : null}
                </FormGroup>
                <FormGroup>
                  <Label for="description">Description</Label>
                  <Input
                    type="text"
                    name="description"
                    id="description"
                    placeholder="Description"
                    onChange={(e) => onChangeHandler(e)}
                    value={formData['description']}
                    invalid={formData['descriptionValidation'] ? true : false}
                  />
                  {formData['descriptionValidation'] ? (
                    <FormFeedback>{formData['descriptionError']}</FormFeedback>
                  ) : null}
                </FormGroup>
                {
                  formData['category'] !== "payAsYouGo" && (
                    <>
                    <FormGroup>
                      <Label for="durationType">Duration Type</Label>
                      <Input
                        type="select"
                        name="durationType"
                        id="durationType"
                        onChange={(e) => onChangeHandler(e)}
                        value={formData['durationType']}
                      >
                        <option value="months">Months</option>
                        <option value="years">Years</option>
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <Label for="validityPeriod">validity period</Label>
                      <Input
                        type="number"
                        name="validityPeriod"
                        id="validityPeriod"
                        placeholder={'Enter ' + formData['durationType'] + ' in plain numbers'}
                        onChange={(e) => onChangeHandler(e)}
                        value={formData['validityPeriod']}
                        invalid={
                          formData['validityPeriodValidation'] ? true : false
                        }
                      />
                      {formData['validityPeriodValidation'] ? (
                        <FormFeedback>
                          {formData['validityPeriodError']}
                        </FormFeedback>
                      ) : null}
                    </FormGroup>
                    <FormGroup>
                      <Label for="price">Price</Label>
                      <Input
                        type="number"
                        name="price"
                        id="price"
                        onChange={(e) => onChangeHandler(e)}
                        value={formData['price']}
                        invalid={
                          formData['isPriceError'] ? true : false
                        }
                      />
                      {formData['isPriceError'] ? (
                        <FormFeedback>
                          {formData['priceErrorMsg']}
                        </FormFeedback>
                      ) : null}
                    </FormGroup>
                    </>
                  )
                }
              </Form>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button className='btn-darkblue' onClick={onClickHandler}>
              {mode === 'edit' ? 'Edit' : 'Create'}
            </Button>
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </Container>
  );
};

const Index: React.FC = () => {
  const { UserState, UiState } = useStore();
  const [billings, setBillings] = useState([]);
  const [modal, setModal] = useState(false);
  const [currentBilling, setCurrentBilling] = useState({
    _id: '',
    title: '',
    description: '',
    durationType: 'months',
    validityPeriod: '',
    price: ''
  });
  const [mode, setMode] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(0);

  const toggleModal = async () => {
    setModal(!modal);
  };
  const billingDetails = async () => {
    const offset = currentPage - 1;
    const limit = pageSize;
    const filter = JSON.stringify({});
    const orderBy = 'createdAt';
    const orderDir = 'asc';
    // @ts-ignore
    const { data, count, error } = await BillingService.fetchBilling(
      offset,
      limit,
      filter,
      orderBy,
      orderDir
    );
    if (!error) {
      setBillings(data);
      setTotalPage(Math.ceil(count / pageSize));
    }
  };

  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setCurrentPage(newPage);
  };

  const deleteConfirm = (e, id) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure to do this.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteHandler(id),
        },
        {
          label: 'No',
          onClick: () => null,
        },
      ],
    });
  };

  const handleSearchChange = async (e) => {
    const { error, msg, data } = await BillingService.getBillingByTitle({ title: e });
    if (e === '') {
      billingDetails()
    } else {
      if (!error) {
        setBillings(data);
      } else {
        UiState.notify('Some thing went wrong', 'error');
      }
    }
  }

  const deleteHandler = async (reqData) => {
    const { error, msg } = await BillingService.deleteBilling({
      _id: reqData['_id'],
    });
    if (!error) {
      UiState.notify('User deleted', 'success');
      billingDetails();
    } else {
      UiState.notify('Some thing went wrong', 'error');
    }
  }

  useEffect(() => {
    billingDetails();
  }, [currentPage, pageSize]);
  return (
    <div>
      <Container fluid>
        <div className="header-body mt-5">
          <div className="createuser-btn">
            <Button
              onClick={() => {
                toggleModal();
                setMode('add');
                setCurrentBilling({
                  _id: '',
                  title: '',
                  description: '',
                  durationType: 'months',
                  validityPeriod: '',
                  price: ''
                });
              }}
              className="mb-3 btn-darkblue"
            >
              <i className="fa fa-plus" aria-hidden="true"></i> &nbsp; Create
              Billings
            </Button>
          </div>
          <div className="table-style">
            <MaterialTable
              title="Billing Table"
              icons={tableIcons}
              columns={[
                { title: 'Title', field: 'title', align: 'center' },
                { title: 'Description', field: 'description', align: 'center', searchable: false },
                { title: 'Duration Type', field: 'durationType', align: 'center', searchable: false },
                { title: 'Validity Period', field: 'validityPeriod', align: 'center', searchable: false },
                { title: 'Price', field: 'price', align: 'center', searchable: false },
              ]}
              data={billings}
              actions={[
                {
                  icon: () => <Edit className="edit-icon" />,
                  tooltip: 'Edit',
                  onClick: (event, rowData) => {
                    setCurrentBilling(rowData);
                    setMode('edit');
                    toggleModal();
                  },
                },
                {
                  icon: () => <DeleteIcon className="delet-icon" />,
                  tooltip: 'Delete',
                  onClick: (event, rowData) => {
                    deleteConfirm(event, rowData);
                  },
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
                  textAlign: 'center',
                },
                paging: false,
              }}
              onSearchChange={handleSearchChange}
              localization={{
                toolbar: {
                  searchPlaceholder: 'Search by Title'
                }
              }}
            />
          </div>
          <Stack spacing={2} alignItems="center">
            <Typography>Page: {currentPage}</Typography>
            <Pagination
              count={totalPage}
              page={currentPage}
              onChange={handlePageChange}
            />
          </Stack>
        </div>
        {modal && (
          <CreateBillingModel
            isOpen={modal}
            toggle={toggleModal}
            mode={mode}
            currentBilling={currentBilling}
            callback={billingDetails}
          />
        )}
      </Container>
    </div>
  );
};
export default observer(Index);
