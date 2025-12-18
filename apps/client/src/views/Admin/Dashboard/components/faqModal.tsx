/** @format */
/* eslint-disable react/jsx-filename-extension */ /* eslint-disable no-underscore-dangle */
import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
// import Select from "react-select";
// import CustomSelectInput from "../../components/common/CustomSelectInput";
import IntlMessages from '../../../../helpers/IntlMessages';

interface Props {
    modalOpen: boolean;
    toggleModal: any;
    faqQuestion: any;
}
const FaqModal = ({ modalOpen, toggleModal, faqQuestion }: Props) => (
    <Modal isOpen={modalOpen} toggle={toggleModal} style={{ maxWidth: '800px', width: '100%' }}>
        <ModalHeader toggle={toggleModal}>
            <h4>
                <IntlMessages id="dashboard.faq-modal-title" />
            </h4>
        </ModalHeader>
        <ModalBody>
            {/* <div className="d-flex jus">
                <iframe
                    width="760"
                    height="415"
                    src="https://www.youtube.com/embed/Mxesac55Puo"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div> */}
            {faqQuestion === 1 ? (
                <ul>
                    <li>Go to Report Cleanup Screen</li>
                    <li>Upload PDF File</li>
                    <li>Type Report Name</li>
                    <li>Select Client Name</li>
                    <li>click on Submit</li>
                </ul>
            ) : null}
            {faqQuestion === 2 ? (
                <ul>
                    <li>Go to Report Cleanup Screen</li>
                    <li>Upload PDF File</li>
                    <li>Type Report Name</li>
                    <li>Select Client Name</li>
                    <li>click on Submit</li>
                </ul>
            ) : null}
            {faqQuestion === 3 ? (
                <ul>
                    <li>Go to perticular screen</li>
                    <li>Select viewer</li>
                    <li>You will able to see data in table format</li>
                </ul>
            ) : null}
            {faqQuestion === 4 ? (
                <ul>
                    <li>Go to candidates screen</li>
                    <li>Select rows to export</li>
                    <li>click on export pdf</li>
                </ul>
            ) : null}
            {faqQuestion === 5 ? (
                <ul>
                    <li>Go to candidates screen</li>
                    <li>Select rows to send email</li>
                    <li>Click on send email</li>
                    <li>Add emails and other details</li>
                    <li>Click on send </li>
                </ul>
            ) : null}
            {faqQuestion === 6 ? (
                <ul>
                    <li>Go to manage template screen</li>
                    <li>Click on create</li>
                    <li>Add details and mark cv</li>
                    <li>Click on create</li>
                </ul>
            ) : null}
            {faqQuestion === 7 ? (
                <ul>
                    <li>Go to profile screen</li>
                    <li>Edit data which you want to update</li>
                    <li>Click on update </li>
                </ul>
            ) : null}
            {faqQuestion === 8 ? (
                <ul>
                    <li>Go to user setting screen</li>
                    <li>Edit details</li>
                    <li>Click on Save </li>
                </ul>
            ) : null}
        </ModalBody>
        <ModalFooter>
            <Button color="secondary" outline onClick={toggleModal}>
                <IntlMessages id="pages.close-modal" />
            </Button>
        </ModalFooter>
    </Modal>
);

export default FaqModal;
