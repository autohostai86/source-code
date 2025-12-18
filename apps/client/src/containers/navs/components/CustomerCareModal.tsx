/** @format */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-filename-extension */ /* eslint-disable no-underscore-dangle */
import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Card, CardTitle } from 'reactstrap';
// import { Colxx } from '../../../components/common/CustomBootstrap';
import IntlMessages from '../../../helpers/IntlMessages';
import img1 from '../../../assets/img/logo20.jpg';
import img2 from '../../../assets/img/facebook.png';
import img3 from '../../../assets/img/twitter.png';
import img4 from '../../../assets/img/whatsapp.png';

interface Props {
    modalOpen: boolean;
    toggleModal: any;
}
const CustomerCareModal = ({ modalOpen, toggleModal }: Props) => (
    <Modal isOpen={modalOpen} toggle={toggleModal} backdrop="static">
        <ModalHeader toggle={toggleModal}>
            <h4>
                <IntlMessages id="dashboard.cust_care" />
            </h4>
        </ModalHeader>
        <ModalBody>
            {/* <Colxx xxs="12" sm="12" className="customerCare">
                <Card className="p-3">
                    <Row>
                        <Colxx xxs="12" className="customerCare__Header">
                            <Row className="customerCare__Header__Row">
                                <Colxx xxs="5" className="customerCare__Header__Title">
                                    <CardTitle>
                                        <p>vInnovate Technologies</p>

                                        <div className="d-flex customerCare__Header__Social">
                                            <a href="demo" target="_blank">
                                                <img src={img2} alt="" />
                                            </a>
                                            <a href="demo" target="_blank">
                                                <img src={img3} alt="" />
                                            </a>
                                            <a href="demo" target="_blank">
                                                <img src={img4} alt="" />
                                            </a>
                                        </div>
                                    </CardTitle>
                                </Colxx>
                                <Colxx xxs="7" className="customerCare__Body">
                                    <p className="text-justify">
                                        For any evenience if you need help you can call 8787878787, write on email to contact@vinnovatetechnologies.com or
                                        you&apos;ll find it on bottom right corner
                                    </p>
                                </Colxx>
                            </Row>
                        </Colxx>
                    </Row>
                </Card>
            </Colxx> */}
        </ModalBody>
        <ModalFooter>
            <Button color="secondary" outline onClick={toggleModal}>
                <IntlMessages id="pages.close-modal" />
            </Button>
        </ModalFooter>
    </Modal>
);

export default CustomerCareModal;
