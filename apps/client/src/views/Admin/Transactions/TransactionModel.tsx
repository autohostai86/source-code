/* eslint-disable prettier/prettier */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { toJS } from "mobx";
import React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Container } from 'reactstrap';
import MaterialTable from 'material-table';
import moment from 'moment';

const TransactionModel = (props) => {
    const { isOpen, toggle, transactions, tableIcons } = props;
    console.log(transactions);
    return (
        <Container fluid>
            <Modal isOpen={isOpen} toggle={toggle} centered size="xl">
                <ModalHeader toggle={toggle}>
                    Transaction Details
                </ModalHeader>
                <ModalBody className='modal-body'>
                    <MaterialTable
                        title="Transaction"
                        icons={tableIcons}
                        columns={[
                            { title: 'Payment ID', field: 'paymentId', align: 'center' },
                            { title: 'status', field: 'status', align: 'center' },
                            { title: 'Order ID', field: 'orderId', align: 'center' },
                            { title: 'Reciept', field: 'receiptId', align: 'center' },
                            { title: 'createdAt', field: 'createdAt', align: 'center' },
                            { title: 'amount', field: 'amount', align: 'center' }
                        ]}
                        data={transactions}
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
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggle}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>
        </Container>
    );
}

export default TransactionModel;