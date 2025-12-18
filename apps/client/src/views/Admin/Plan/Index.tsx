/* eslint-disable prettier/prettier */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { toJS } from "mobx";
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Doughnut, Pie, Bar } from 'react-chartjs-2';
import { Badge, CardText, Button, Card, CardTitle, Input, Row, Col, CardBody, Container, Form, FormGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader, FormFeedback } from 'reactstrap';
import MaterialTable from 'material-table'
import moment from "moment";
import { Toaster } from 'react-hot-toast';

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
import PlanService from 'apps/client/src/services/PlanService';

import BillingService from 'apps/client/src/services/BillingService';

import PaymentIcon from '@material-ui/icons/Payment';
import EditIcon from '@material-ui/icons/Edit';
import VisibleIcon from '@material-ui/icons/Visibility';
import TransactionModel from '../Transactions/TransactionModel';
// eslint-disable-next-line arrow-body-style







const Index: React.FC = () => {
  const [modal, setModal] = useState(false);
  const [billings, setBillings] = useState([]);
  const [type, setType] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [currentPlan, setcurrentPlan] = useState<any>([]);
  const tableRef = React.useRef<any>();
  const [searchmodal, setSearchModal] = useState(false);
  const [userDetails, setUserDetails] = useState([])

  const searchToggle = () => setSearchModal(!searchmodal);
  const toggle = (modalType) => {
    setModal(!modal)
    setType(modalType)
  }
  const { UserState, UiState } = useStore();
  const [plan, setPlan] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [check, setCheck] = useState('')
  const [currentUser, setCurretnUser] = useState({})
  const [mode, setMode] = useState('')
  const [selectedRow, setSelectedRow] = useState()
  const toggleModal = async () => {
    setModal(!modal);
  };
  // search submit form 
  const [coloumnTitleFilter, setecoloumnTitleFilter] = useState<string>('');
  const [valueInputSearch, setvalueInputSearch] = useState<string>('');
  const searchFilterInput = async (event) => {
    if (event.target.name == 'coloumFilter') {
      setecoloumnTitleFilter(event.target.value);
      if (event.target.value === 'user') {
        const { data, error } = await UserService.fetchUser()
        if (!error) {
          setUserDetails(data)
        } else {
          UiState.notify('Internal server error', 'error');
        }
      }
    } else if (event.target.name == 'searchValueFilter') {
      setvalueInputSearch(event.target.value);
    }
  }
  const submitForm = async (event) => {
    event.preventDefault();
    if (coloumnTitleFilter !== "" && valueInputSearch !== "") {
      tableRef.current && tableRef.current.onQueryChange();

      searchToggle();

    } else {
      UiState.notify('All Field Are Required To Search....!!', 'error');
    }

  }
  const resetFilter = async (event) => {
    event.preventDefault();
    setecoloumnTitleFilter('');
    setvalueInputSearch('');

    tableRef.current && tableRef.current.onQueryChange();

  }

  // end search submit form 






  const billingDetails = async (type, rowData) => {
    const offset = 0;
    const limit = 100;
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
    if (!error && data) {
      setBillings(data);
      if (type === "makePayment") {
        data.map((object, index) => {
          if (object.title === rowData.billings.title) {
            setcurrentPlan(object);
          }
        })

      } else if (type === "changePlan") {
        const arrayBilling = data.map((object, index) => {
          if (object.title === rowData.billings.title) {
            // setcurrentPlan(object);
            object.current = true;
          }
          return object;

        })
        setBillings(arrayBilling)


      }

    }
  };

  // razopr pay code started  here
  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = src
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }

  // make payment function 
  const makePayment = async (e, object) => {
    toggle("basicmodal");
    toggle("changemodal");
    const { error, msg, data, updatedSubscription, newTransactionData } = await PlanService.createOrder({
      userId: UserState.userData.userId,
      price: object.price,
      suscribeId: plan[0]._id,
      notes: {
        title: object.title,
        description: object.description,
        userName: UserState.userData.name,
        UserEmail: UserState.userData.email,
      }
    })

    if (!error) {
      //  razorpay logic here 

      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

      if (!res) {
        alert('Razropay failed to load!!')
        return
      }



      const options = {
        "key": "rzp_test_0GwNj3bZJ0qhXv", // Enter the Key ID generated from the Dashboard
        "amount": data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "AIHOSTCHATBOT",
        // "description": "Test Transaction",
        // "image": "https://example.com/your_logo",
        "order_id": data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        // "callback_url":"http://localhost:1769/verify",
        "handler": async function (response) {
          // alert(response.razorpay_payment_id);
          // alert(response.razorpay_order_id);
          // alert(response.razorpay_signature)
          const { error, msg, data } = await PlanService.makePayment({
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            Expiry: object.validityPeriod,
            orderStatus: "Completed",
            paymentStatus: "Completed",
            userId: UserState.userData.userId,
            billingId: object._id,
            orderId: newTransactionData.orderId,
            receiptId: newTransactionData.receiptId,
            amount: newTransactionData.amount,
            suscribeId: updatedSubscription._id
          })

          tableRef.current && tableRef.current.onQueryChange()
          // console.log("table.ref",tableRef)
          UiState.notify('Payment Done Sucessfully.', 'success');
          // planDetails();

          billingDetails("", []);

        },
        "theme": {
          "color": "#3399cc"
        }
      };
      const paymentObject = (window as any).Razorpay(options);
      paymentObject.open();

    } else {
      // console.log("Error In Backend Side")
    }

  }

  const handleVisibilityClick = (rowData) => {
    setSelectedRow(rowData.transactions);
    toggle('transaction');
  };


  // useEffect(() => {
  // planDetails();
  // }, [currentPage, pageSize]);


  // console.log(currentUser)
  useEffect(() => {
    // planDetails();
    billingDetails('', '');
  }, []);

  return (
    <div>
      <Container fluid >

        <div className="header-body mt-5">
          <div className='createuser-btn'>
            <Button onClick={searchToggle} className='mb-3 ' title='Submit Search Filter' >
              <i className="fa fa-search" aria-hidden="true"></i> &nbsp;
              Search Filter
            </Button>
            <Button onClick={resetFilter} className='mb-3 ' title='SReset Filter' >
              <i className="fa fa-spinner" aria-hidden="true"></i> &nbsp;
              Reset Filter
            </Button>
          </div>
          <div className='table-style'>
            <MaterialTable
              tableRef={tableRef}


              title="Plan"
              icons={tableIcons}
              columns={[
                // { title: 'Bot', field: 'bots.title', align: 'center' },
                { title: 'User', field: 'users.userName', align: 'center' },
                { title: 'Billing Title', field: 'billings.title', align: 'center' },
                {
                  title: 'Billing Duration', field: 'validityPeriod', align: 'center', render: (rowData: any) => {
                    if (rowData.billings.category === "free") {
                      return rowData.billings.validityPeriod + " " + rowData.billings.durationType
                    } else {
                      return "";
                    }
                  }
                },
                {
                  title: 'Expiry Date', field: 'expiryDate', align: 'center', render: (rowData) => {
                    if (rowData.billings.category === "free") {
                      return moment(rowData.expiryDate).format("DD-MM-YYYY")
                    } else {
                      return "";
                    }
                  }
                },
                {
                  title: 'Expired Status', field: 'isExpired', align: 'center', render: (rowData) => {
                    if (rowData.billings.category === "free") {
                      return rowData.isExpired ? "Expired" : "Non Expired"
                    } else {
                      return "";
                    }
                  }
                },
                // {
                //   title: 'Payment Status', field: 'paymentStatus', align: 'center', render: (rowData) => {
                //     return rowData.paymentStatus ? <i className='fa fa-check-square' aria-hidden='true' style={{ color: 'green' }}></i> : <i className="fa fa-window-close" aria-hidden="true" style={{ color: 'red' }}></i>
                //   }
                // },
              ]}
              // data={plan}
              data={query =>
                new Promise((resolve, reject) => {

                  //  /       console.log("query",query)
                  let payload_data_updating: any = {
                    userType: UserState.userData.userType,
                    offset: query.page ? query.page : 0,
                    limit: query.pageSize,
                    // filter: query.filters,
                    orderBy: 'createdAt',
                    orderDir: 'asc',
                    // search: query?.search
                  };

                  if (coloumnTitleFilter.length > 0) {
                    payload_data_updating.coloumnTitleFilter = coloumnTitleFilter;
                  }

                  if (valueInputSearch.length > 0) {
                    payload_data_updating.valueInputSearch = valueInputSearch;
                  }
                  if (UserState.userData.userType === "user") {
                    payload_data_updating.userId = UserState.userData.userId;
                  }

                  return PlanService.fetchPlan(payload_data_updating).then(refreshData => {


                    // Ensure you have a state update function like setPlan to update the data
                    setPlan(refreshData.data);
                    setPageSize(query.pageSize);
                    resolve({
                      data: refreshData.data,
                      page: query.page ? query.page : 0, // Ensure correct page number
                      totalCount: refreshData.count,
                    });
                    setecoloumnTitleFilter('');
                    setvalueInputSearch('');
                  }).catch(error => {
                    console.error("Error fetching plan data:", error);
                    reject(error);
                  });
                })
              }


              actions={
                UserState.userData.userType !== 'admin' ?
                  [
                    rowData => ({

                      icon: () => <PaymentIcon className={rowData.isExpired ? "undisabled_class" : "disabled_class"} />,
                      tooltip: 'Make Payment',
                      onClick: (event, rowData: any) => {
                        toggle("basicmodal")
                        if (rowData.billings.title == "Free Tier") {
                          setIsFree(true);

                        }
                        billings.map((object, index) => {
                          if (object.title === rowData.billings.title) {
                            setcurrentPlan(object);
                          }
                        })

                      },
                      disabled: !rowData.isExpired
                    }),
                    rowData => ({
                      icon: () => <EditIcon className='edit-icon' />,
                      tooltip: 'Change Your Plan',
                      onClick: (event, rowData1: any) => {
                        toggle("changemodal")

                        if (rowData1.billings.title == "Free Tier") {
                          setIsFree(true);

                        }

                        const arrayBilling = billings.map((object, index) => {
                          if (object.title === rowData1.billings.title) {
                            // setcurrentPlan(object);
                            object.current = true;
                          }
                          return object;

                        })
                        setBillings(arrayBilling)


                      },

                    })

                  ] : [
                    rowData => ({

                      icon: () => <VisibleIcon />,
                      tooltip: 'View Details',
                      onClick: (event, rowData: any) => {
                        handleVisibilityClick(rowData);
                      }
                    }),
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
                },
                // textAlign: 'center'
                paging: true,
                search: false,
                pageSize: pageSize,
                // filtering: true
                // pageSizeOptions: [5, 10, 20,40,50],
                // paginationType: 'stepped',
                // // @ts-ignore
                // onChangePage: (event, newPage) => handlePageChange(event, newPage),
                // onChangeRowsPerPage: handleRowsPerPageChange
              }}
            />
          </div>

        </div>
        <Toaster />
      </Container>
      {/* search modal  */}
      <Modal isOpen={searchmodal} toggle={searchToggle} >
        <ModalHeader toggle={searchToggle}>Search Filter</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="exampleSelect">
              Please select filter type
            </Label>
            <Input
              id="exampleSelect"
              name="coloumFilter"
              type="select"
              onChange={searchFilterInput}
              value={coloumnTitleFilter}
            >
              <option value="">Please Select</option>
              <option value="Bot">
                Bot
              </option>
              <option value="Billing Title">
                Billing Title
              </option>
              <option value="Billing Duration">
                Billing Duration
              </option>
              <option value="Expiry Date">
                Expiry Date
              </option>
              <option value="Expiry Status">
                Expiry Status
              </option>
              <option value="Payment Status">
                Payment Status
              </option>
              {
                UserState.userData.userType === 'admin' &&
                <option value="user">
                  User
                </option>
              }
            </Input>
          </FormGroup>
          {coloumnTitleFilter === "Expiry Date" && (
            <FormGroup>
              <Label for="exampleSelect">
                Select Date
              </Label>
              <Input
                id="exampleSelect"
                name="searchValueFilter"
                type="date"
                onChange={searchFilterInput}
                value={valueInputSearch}
              >

              </Input>
            </FormGroup>
          )}
          {coloumnTitleFilter !== "Expiry Date" && coloumnTitleFilter !== "Expiry Status" && coloumnTitleFilter !== "Payment Status" && coloumnTitleFilter !== "user" && (<FormGroup>
            <Label for="exampleSelect">
              Please enter
            </Label>
            <Input
              value={valueInputSearch}
              id="exampleSelect"
              name="searchValueFilter"
              type="text"
              onChange={searchFilterInput}
            >

            </Input>
          </FormGroup>)}
          {coloumnTitleFilter === "Expiry Status" && (<FormGroup>
            <Label for="exampleSelect">
              Please Select Status
            </Label>

            <Input
              value={valueInputSearch}
              id="exampleSelect"
              name="searchValueFilter"
              type="select"
              onChange={searchFilterInput}
              required
            >
              <option>Please Select</option>

              <option value="true">
                Expired
              </option>
              <option value="false">
                Non Expired
              </option>

            </Input>
          </FormGroup>)}
          {coloumnTitleFilter === "Payment Status" && (<FormGroup>
            <Label for="exampleSelect">
              Please Select Status
            </Label>

            <Input
              value={valueInputSearch}
              id="exampleSelect"
              name="searchValueFilter"
              type="select"
              onChange={searchFilterInput}
              required
            >
              <option>Please Select</option>

              <option value="true">
                Completed
              </option>
              <option value="false">
                Pending
              </option>

            </Input>
          </FormGroup>)}
          {coloumnTitleFilter === "user" && (<FormGroup>
            <Label for="exampleSelect">
              Please Select User
            </Label>

            <Input
              value={valueInputSearch}
              id="exampleSelect"
              name="searchValueFilter"
              type="select"
              onChange={searchFilterInput}
              required
            >
              <option>Please Select</option>
              {
                userDetails &&
                userDetails.map((user) =>
                  <option value={user._id}>
                    {user.userName}
                  </option>
                )
              }

            </Input>
          </FormGroup>)}
        </ModalBody>
        <ModalFooter>
          <Button onClick={resetFilter} className=' btn-darkblue' color='danger' title='Reset Filter' >
            <i className="fa fa-spinner" aria-hidden="true"></i> &nbsp;
            Reset Filter
          </Button>
          <Button color="primary" onClick={submitForm} title='Submit Search Filter'>
            <i className="fa fa-filter" aria-hidden="true"></i>   Search
          </Button>

        </ModalFooter>
      </Modal>

      {/* end of search modal */}
      {type !== 'transaction' ?
        <Modal isOpen={modal} toggle={() => { toggle(type) }}>
          <ModalHeader toggle={() => { toggle(type) }}>{type === "changemodal" ? "Changed Plan" : "Make Payment"}</ModalHeader>
          <ModalBody>
            <Row>
              {
                type === "basicmodal" && isFree ? (
                  <Col sm="12">
                    <h3 style={{ color: "red" }}>Your Free Tier Plan Is Expired So Please Choose Other Plan </h3>
                  </Col>

                ) : null
              }
              {
                type === "basicmodal" && !isFree && Object.keys(currentPlan).length > 0 ? (<Col sm="12" >
                  <Card body>
                    <CardTitle tag="h5">
                      {currentPlan.title}
                    </CardTitle>
                    <CardText>
                      <b>Duration :-{currentPlan.validityPeriod} {currentPlan.durationType}</b> <br></br>

                      <b>Price (Indain Currency) :-  {currentPlan.price}</b> <br></br>
                      <b>Benfits:-  {currentPlan.description} </b>
                    </CardText>
                    <Button onClick={(event) => makePayment(event, currentPlan)}>
                      Containing
                    </Button>
                  </Card>


                </Col>) : null
              }
              {
                type === "changemodal" &&
                billings.map((object, index) => {
                  return (
                    <Col sm="12" style={{ display: index === 0 ? "none" : "block" }}>
                      <Card body>
                        <CardTitle tag="h5">
                          {object.title}   <i style={{ color: "red" }}>{object.current && <Badge color="info">
                            Active
                          </Badge>
                          }</i>
                        </CardTitle>
                        <CardText>
                          <b>Duration :-{currentPlan.validityPeriod} {object.durationType}</b> <br></br>

                          <b>Price (Indain Currency) :-  {object.price}</b> <br></br>
                          <b>Benfits:- {object.description} </b>
                        </CardText>
                        <Button onClick={(event) => makePayment(event, object)}>
                          Select Plan
                        </Button>
                      </Card>


                    </Col>
                  )
                })
              }
            </Row>
          </ModalBody>
        </Modal> :
        <TransactionModel
          isOpen={modal}
          toggle={toggleModal}
          transactions={selectedRow}
          tableIcons={tableIcons}
        />
      }
    </div>

  );
};
export default observer(Index);
