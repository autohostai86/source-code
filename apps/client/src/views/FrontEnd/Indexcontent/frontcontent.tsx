/* eslint-disable prettier/prettier */
/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable react/button-has-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react/button-has-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Toaster } from 'react-hot-toast';

import { Container, Form, Input, Label, Row, Col, Button, Card, CardBody, InputGroup, Video } from 'reactstrap';
import jwt_decode from "jwt-decode";
import 'bootstrap/dist/css/bootstrap.min.css';
import { baseURL } from 'apps/client/src/utils/API';
import useStore from '../../../mobx/UseStore';
// import '../main.scss';
import AOS from 'aos';
import ReactPlayer from 'react-player';
import BOOTSTRAP from 'bootstrap';

// css include
import 'animate.css';
import '../../../assets/vendor/aos/aos.css';
import '../../../assets/vendor/bootstrap/css/bootstrap.min.css';
import '../../../assets/vendor/bootstrap-icons/bootstrap-icons.css';
import '../../../assets/vendor/glightbox/css/glightbox.min.css';
import '../../../assets/vendor/swiper/swiper-bundle.min.css';
import loginIllustraion from "../assets/img/login-illustrator.png";
// js include
import Typewriter from 'typewriter-effect/dist/core';
import '../../../assets/vendor/bootstrap/js/bootstrap.bundle.min';
import '../../../assets/vendor/aos/aos.js';
import '../../../assets/vendor/glightbox/js/glightbox';
import '../../../assets/vendor/swiper/swiper-bundle.min';
import $ from 'jquery';
import DashboardService from '../../../services/DashboardService';





const FrontContent: React.FC = () => {
  const [vdoplayer, setVdoPlayer] = useState(false);
  // const [isVideoPopupVisible, setVideoPopupVisible] = useState<boolean>(false);

  // const openVideoPopup = (url: string) => {
  //   setVideoUrl(url);
  //   setVideoPopupVisible(true);
  // };

  // const closeVideoPopup = () => {
  //   setVideoUrl('');
  //   setVideoPopupVisible(false);
  // };
  // state for mail functionlity
  const { UiState } = useStore();
  const [emailName, setemailName] = useState<string>('');
  const [Number, setNumber] = useState<string>('');
  const [userName, setuserName] = useState<string>('');
  const [Message, setMessage] = useState<string>('');
  const emailFunction = (event) => {
    if (event.target.name == 'email') {
      setemailName(event.target.value);
    } else if (event.target.name == 'name') {
      setuserName(event.target.value);
    } else if (event.target.name == 'mobile') {
      setNumber(event.target.value);
    } else if (event.target.name == 'message') {
      setMessage(event.target.value);
    }
  }
  const submitForm = async (event) => {
    event.preventDefault();
    // Form validation
    if (!emailName || !Number || !userName || !Message) {
      UiState.notify('Please fill in all fields.', 'error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailName)) {
      UiState.notify('Please enter a valid email address.', 'error');
      return;
    }

    // Mobile number validation
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(Number)) {
      UiState.notify('Please enter a valid 10-digit mobile number.', 'error');
      return;
    }
    const { error, msg } = await DashboardService.contact({
      email: emailName,
      number: Number,
      name: userName,
      message: Message,

    });

    if (!error) {
      UiState.notify(msg, 'success');
      document.getElementById('emailInput').value = '';
      document.getElementById('numberInput').value = '';
      document.getElementById('nameInput').value = '';
      document.getElementById('messageInput').value = '';

    } else {
      UiState.notify(msg, 'error');
    }

  }

  //  end of email function code
  useEffect(() => {
    setVdoPlayer(true);



    const typewriter = new Typewriter('#typewriter', {
      loop: true
    });

    typewriter.typeString(" here.")
      .pauseFor(1000)
      .deleteAll()
      .typeString(" faster.")
      .pauseFor(1000)
      .deleteAll()
      .typeString(' easier.')
      .pauseFor(500)
      .deleteChars(10)
      .deleteAll()
      .start();
    const Word = document.getElementById('Word');
    // if (Word) {
    //   const text = "THE FUTURE OF GUEST COMMUNICATION.";
    //   const length = text.length;
    //   let i = 0;
    //   const intervalId = setInterval(() => {
    //     Word.textContent = text.substr(0, i++ % length);
    //   }, 180);
    // Adjust the speed of typing animation here

    // Cleanup function to clear the interval when the component unmounts
    // return () => clearInterval(intervalId);
    // }
    const toggleScrolled = () => {
      const body = document.querySelector('body');
      const header = document.querySelector('#header');
      if (header && (header.classList.contains('scroll-up-sticky') || header.classList.contains('sticky-top') || header.classList.contains('fixed-top'))) {
        window.scrollY > 100 ? body?.classList.add('scrolled') : body?.classList.remove('scrolled');
      }
    };

    const mobileNavToggle = () => {
      const body = document.querySelector('body');
      const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
      body?.classList.toggle('mobile-nav-active');
      mobileNavToggleBtn?.classList.toggle('bi-list');
      mobileNavToggleBtn?.classList.toggle('bi-x');
    };

    const onMobileNavClick = () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToggle();
      };



    }
    const aosInit = () => {
      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
      });
    };

    const initSwiper = () => {
      document.querySelectorAll('.swiper').forEach(swiper => {
        const configElement = swiper.querySelector('.swiper-config');
        if (configElement) {
          const config: SwiperConfig = JSON.parse(configElement.innerHTML.trim());
          new Swiper(swiper, config);
        }
      });
    };

    const navmenuScrollspy = () => {
      const navmenulinks = document.querySelectorAll('.navmenu a');
      navmenulinks.forEach(navmenulink => {
        if (!navmenulink.hash) return;
        const section = document.querySelector(navmenulink.hash);
        if (!section) return;
        const position = window.scrollY + 200;
        if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
          document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
          navmenulink.classList.add('active');
        } else {
          navmenulink.classList.remove('active');
        }
      });
    };

    document.addEventListener('scroll', toggleScrolled);
    window.addEventListener('load', toggleScrolled);
    window.addEventListener('load', aosInit);
    window.addEventListener('load', initSwiper);
    window.addEventListener('load', navmenuScrollspy);
    document.addEventListener('scroll', navmenuScrollspy);

    document.querySelector('.mobile-nav-toggle')?.addEventListener('click', mobileNavToggle);
    document.querySelectorAll('#navmenu a').forEach(navmenu => {
      navmenu.addEventListener('click', onMobileNavClick);
    });
    document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
      navmenu.addEventListener('click', e => {
        if (document.querySelector('.mobile-nav-active')) {
          e.preventDefault();
          const parent = navmenu.parentElement;
          parent?.classList.toggle('active');
          parent?.nextElementSibling?.classList.toggle('dropdown-active');
          e.stopImmediatePropagation();
        }
      });
    });

    const preloader = document.querySelector('#preloader');
    if (preloader) {
      window.addEventListener('load', () => {
        preloader.remove();
      });
    }



    window.addEventListener('load', () => {
      if (window.location.hash) {
        const section = document.querySelector(window.location.hash);
        if (section) {
          setTimeout(() => {
            const scrollMarginTop = getComputedStyle(section).scrollMarginTop;
            window.scrollTo({
              top: section.offsetTop - parseInt(scrollMarginTop),
              behavior: 'smooth',
            });
          }, 100);
        }
      }
    });

    return () => {
      document.removeEventListener('scroll', toggleScrolled);
      document.removeEventListener('scroll', navmenuScrollspy);
      document.querySelector('.mobile-nav-toggle')?.removeEventListener('click', mobileNavToggle);
    };
  }, []);



  return (
    <main className="main custom-mt">
      <section id="hero" className="hero section">
        <div className="hero-bg">
          <img src="assets/img/hero-bg-light.webp" alt="" />
        </div>

        <div className="container text-center mobile-animation" style={{ marginTop: '80px' }}>
          <div >
            <div id="header-text">
              <h1 className="header-text custom-h1-css" style={{ color: '#000', fontWeight: 500, fontSize: '60px', paddingBottom: '10px' }}>
                The future of guest communication is now&nbsp;
              </h1>
            </div>
            <h1 style={{ color: '#000', fontWeight: 500 }}>
              <div id="typewriter" style={{ height: '50px' }}></div>
            </h1>
          </div>
          <div className="d-flex flex-column justify-content-center align-items-center">
            <h3 data-aos="fade-up" className="mb-0 pb-0 size custom-h3-css-top-heading" style={{ color: '#514f61' }}>
              Tired of sending the same repeated messages to guests?
            </h3>
            <h4 data-aos="fade-up" className="size mt-0 custom-h3-css-top-heading" style={{ color: '#514f61' }}>
              Automate Your Guest Communication With <u><b style={{ color: '#514f61' }}>Autohostai</b></u>
            </h4>
            {vdoplayer && <ReactPlayer
              url={`${baseURL}/uploads/final.mp4`}
              width="285px"
              height="506px"
              style={{ borderRadius: '50px' }}
              playing
              muted
              loop
              controls
            />}
            <div className="d-flex mt-3" data-aos="fade-up" data-aos-delay="200">
              {/* <a href="Front-web#contact_form" className="btn-get-started m-2">
                Book Demo
              </a> */}
              <a href="#" className="btn-get-started m-2">
                Start For free
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Dashboard Section
      <section style={{ backgroundColor: '#f6f7ff' }} id="Dashboard" className="faq section p-100 ">
        <div className="d-flex flex-column justify-content-center align-items-center" data-aos="fade-up" data-aos-delay="100">
          <h1 data-aos="fade-up" style={{ paddingBottom: '50px' }}>
            <strong>Dashboard</strong>
          </h1>
        </div>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10" data-aos="fade-up" data-aos-delay="100">
              <img
                src="assets/img/final dashboard'.jpg"
                className="shadow-lg p-3 mb-5 bg-body-tertiary rounded"
                alt="Dashboard Frame"
                style={{ width: '-webkit-fill-available', boxShadow: '0 6rem 5rem #10275B' }}
                data-aos="fade-up"
                data-aos-delay="100"
              />
            </div>
          </div>
        </div>
      </section> */}
      {/* feature section */}
      <section style={{ backgroundColor: '#f6f7ff', padding: '50px 0' }} id="Features" className="faq section">
        <div className="d-flex flex-column justify-content-center align-items-center" data-aos="fade-up" data-aos-delay="100">
          <h1 data-aos="fade-up" className="mb-2" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '2.5rem' }}>
            <strong>Features</strong>
          </h1>
        </div>

        <div className="container my-4">
          <h2 data-aos="fade-up" className="text-center mb-3" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500, fontSize: '1.5rem',color: '#10275B' }}>
            No more sending the same messages again and again to different guests.
          </h2>

          <div className="row mt-4" style={{marginBottom: "30px" }}>
                        <div className="col-12">
                            <h1 className="card-title text-center"
                                style={{fontFamily: "'Montserrat', sans-serif", fontSize: "35px", color: "#10275B"}}>
                                All Your Messages in One Platform
                            </h1>
                            <p className="card-text text-center"
                                style={{fontFamily: "'Montserrat', sans-serif", fontSize: "22px", color: "#10275B"}}>
                                Messages from all OTA platforms like Airbnb, Booking.com, Make My Trip, Agoda, and many
                                more <br />
                                can be answered directly from our platform.
                            </p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <img src="assets/img/chatbot1.jpg" className="img-fluid" alt="All Your Messages in One Platform"
                                style={{width: "100%", padding:"20px",height: "auto", borderRadius: "10px"}} />
                        </div>
                    </div>
                    <div className=" aos-init aos-animate shadow" data-aos="fade-up" data-aos-delay="200"
                    style={{overflow:"hidden",marginBottom:"5px"}}>

                    <div className="row mt-5" style={{marginBottom: "30px"}}>
                        <div className="col-12">
                            <h1 className="card-title text-center"
                                 style={{fontFamily: "'Montserrat', sans-serif", fontSize: "35px", color: "#10275B"}}>
                                Automated Guest Messaging
                            </h1>
                            <p className="card-text text-center"
                              style={{fontFamily: "'Montserrat', sans-serif", fontSize: "22px", color: "#10275B"}}>
                                Streamline your communication process with automated messages tailored to each guest's
                                needs.
                            </p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <img src="assets/img/feature1.png" className="img-fluid" alt="Automated Guest Messaging"
                                  style={{width: "100%", padding:"20px",height: "auto", borderRadius: "10px"}} />
                        </div>
                    </div>
                </div>
                <div class="mb-5 aos-init aos-animate shadow" data-aos="fade-up" data-aos-delay="200"
                    style={{overflow:"hidden",marginBottom:"5px"}}>

                    <div class="row mt-5"style={{marginBottom: "30px"}}>
                        <div class="col-12">
                            <h1 class="card-title text-center"
                              style={{fontFamily: "'Montserrat', sans-serif", fontSize: "35px", color: "#10275B"}}>
                                Track Property Issues in Real Time
                            </h1>
                            <p class="card-text text-center"
                                 style={{fontFamily: "'Montserrat', sans-serif", fontSize: "22px", color: "#10275B"}}>
                                Our chatbot identifies issues with your property in real time to ensure guest complaints
                                turn into 5-star reviews.
                            </p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <img src="assets/img/features-3.png" class="img-fluid" alt="Track Issues with Your Property"
                                style={{width: "100%", padding:"20px",height: "auto", borderRadius: "10px"}} />
                        </div>
                    </div>
                </div>
          {/* <div className="card mb-5 card-hover" data-aos="fade-left" data-aos-delay="200" style={{ border: 'none', padding: '5px', overflow: 'hidden' }}>
            <div className="row no-gutters flex-md-row flex-column align-items-center">
              <div className="col-md-4">
                <div className="card-body p-4">
                  <h5 className="card-title" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '1.25rem' }}>
                    All Your Messages in one platform
                  </h5>
                  <p className="card-text set-color-as-temp" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 400 }}>
                    Message from all Ota platforms like Airbnb, Booking.com, Make my trip, Agoda and many more can be answered directly from our platform.
                  </p>
                </div>
              </div>
              <div className="col-md-8">
                <img src="assets/img/final dashboard'.jpg" className="img-fluid" alt="Track Issues with Your Property" style={{ height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          </div> */}

          {/* <div className="card mb-5 card-hover" data-aos="fade-left" data-aos-delay="200" style={{ border: 'none', overflow: 'hidden' }}>
            <div className="row no-gutters flex-md-row flex-column-reverse align-items-center">
              <div className="col-md-8">
                <img src="assets/img/feature1.png" className="img-fluid" alt="Automated Guest Messaging" style={{ height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="col-md-4">
                <div className="card-body p-4">
                  <h5 className="card-title" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '35px' }}>
                    Automated Guest Messaging
                  </h5>
                  <p className="card-text set-color-as-temp" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Streamline your communication process with automated messages tailored to each guest's needs.
                  </p>
                </div>
              </div>
            </div>
          </div> */}

          {/* <div className="card mb-5 card-hover" data-aos="fade-left" data-aos-delay="200" style={{ border: 'none', padding: '5px', overflow: 'hidden' }}>
            <div className="row no-gutters flex-md-row flex-column align-items-center">
              <div className="col-md-4">
                <div className="card-body p-4">
                  <h5 className="card-title" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '35px' }}>
                    Track Property Issues in Real Time
                  </h5>
                  <p className="card-text set-color-as-temp" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 400 }}>
                    Our chatbot identifies issues with your property in real time to ensure guest complaints turn into 5 star reviews.
                  </p>
                </div>
              </div>
              <div className="col-md-8">
                <img src="assets/img/features-3.jpg" className="img-fluid" alt="Track Issues with Your Property" style={{ height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          </div> */}
        </div>
      </section>
      {/* end of feature section  */}

      {/* FAQ Section */}
      <section style={{ backgroundColor: '#f6f7ff !important' }} id="faq" className="faq section p-100">
        <div className="d-flex flex-column justify-content-center align-items-center inner-box wow animate__backInRight"
          data-wow-duration="3s" data-wow-delay="0s" data-aos="fade-up">
          <h1 data-aos="fade-up" className="" style={{ paddingBottom: '35px', textAlign: 'center' }} > <strong> Frequently Asked
            Questions</strong> </h1>
        </div>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="faq-container">
                <div className="accordion" id="accordionExample">
                  <div className="accordion-item" data-aos="fade-up" style={{ marginTop: '10px' }}>
                    <h2 className="accordion-header" id="flush-headingOne">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                        Why would I need an AI Chatbot?
                      </button>
                    </h2>
                    <div id="flush-collapseOne" className="accordion-collapse collapse"
                      aria-labelledby="flush-headingOne" data-bs-parent="#accordionExample">
                      <div className="accordion-body" style={{ fontSize: '20px' }}>
                        80% of all guest questions are repeated. It takes a lot of time and effort to reply to their questions.
                        We remove this pain point as our chatbot has been specially designed to cater to the hospitality sector.
                        We have trained our chatbot for over 2 years so that it answers questions on your behalf immediately once
                        the guest asks the question even if it is at 3 am in the morning.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item" data-aos="fade-up" style={{ marginTop: '20px' }}>
                    <h2 className="accordion-header" id="flush-headingTwo">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                        How accurate is the chatbot?
                      </button>
                    </h2>
                    <div id="flush-collapseTwo" className="accordion-collapse collapse"
                      aria-labelledby="flush-headingTwo" data-bs-parent="#accordionExample">
                      <div className="accordion-body" style={{ fontSize: '20px' }}>
                        Each property is different and we train our chatbot to specifically answer questions based on your own property.
                        We will train our chatbot with over 2 years of data from your specific property to ensure accuracy in terms of answers.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item" data-aos="fade-up" style={{ marginTop: '20px' }}>
                    <h2 className="accordion-header" id="flush-headingThree">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                        Won't it sound robotic?
                      </button>
                    </h2>
                    <div id="flush-collapseThree" className="accordion-collapse collapse"
                      aria-labelledby="flush-headingThree" data-bs-parent="#accordionExample">
                      <div className="accordion-body" style={{ fontSize: '20px ' }}>
                        One of the key features of our chatbot is that it is trained in such a way that your guest will not be able to differentiate
                        whether it's you or our chatbot that is answering the question, as our bot is completely customizable to your requirements.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item" data-aos="fade-up" style={{ marginTop: '20px' }}>
                    <h2 className="accordion-header" id="flush-headingFour">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseFour" aria-expanded="false" aria-controls="flush-collapseFour">
                        Can I implement the chatbot at hotels or more than 10 properties?
                      </button>
                    </h2>
                    <div id="flush-collapseFour" className="accordion-collapse collapse"
                      aria-labelledby="flush-headingFour" data-bs-parent="#accordionExample">
                      <div className="accordion-body" style={{ fontSize: '20px' }}>
                        Our chatbot is completely scalable, so if you have 1 property or 100, our chatbot will be able to cater to your needs.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ backgroundColor: '#f6f7ff' }} className="pricing-content section-padding p-5">
        <div className="container" data-aos="fade-up">
          <div className="section-title text-centerinner-box" style={{ color: '#10275B' }}>
            <h1><strong>Pricing Plan</strong></h1>
            <p style={{ fontSize: '25px' }}>Our Best Plan For Listing.</p>
          </div>
          <div className="row text-center">
            <div className="col-lg-4 col-sm-4 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.3s" data-wow-offset="0">
              <div className="single-pricing single-pricing-white inner-box wow animate__backInRight" data-wow-duration="3s" data-wow-delay="0s" data-aos="fade-up">
                <div className="price-head">
                  <h2 className='pricining-heading-css'>Basic</h2>
                  <span></span><span></span><span></span><span></span><span></span><span></span>
                </div>
                <span className="price-label" style={{ backgroundColor: '#fff !important', color: '#10275B', border: '1.5px solid #10275B' }}>Best</span>
                <h1 className="price" style={{ color: '#fff !important' }}>699/Listing</h1>
                {/* <h3 style={{ color: 'white !important' }}>10 Listings Above</h3> */}
                <h5>30 days free trial</h5><br />
                <a href="#" style={{ border: '2px solid #fff', color: '#fff !important', textDecoration: 'none' }} onMouseOver={(e) => { e.currentTarget.style.color = '#10275B'; e.currentTarget.style.borderColor = '#fff'; }} onMouseOut={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#fff'; }}>Start Free Trail</a>
              </div>
            </div>
            <div className="col-lg-4 col-sm-4 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.2s" data-wow-offset="0">
              <div className="single-pricing inner-box wow animate__backInRight" data-wow-duration="3s" data-wow-delay="0s" data-aos="fade-up">
                <div className="price-head">
                  <h2 className='pricining-heading-css'>Popular</h2>
                  <span style={{ backgroundColor: '#10275B' }}></span><span style={{ backgroundColor: '#10275B' }}></span><span style={{ backgroundColor: '#10275B' }}></span><span style={{ backgroundColor: '#10275B' }}></span><span style={{ backgroundColor: '#10275B' }}></span><span style={{ backgroundColor: '#10275B' }}></span>
                </div>
                <h1 className="price">499/Listing</h1>
                {/* <h3>10 Listing</h3> */}
                <h5>30 days free trial</h5><br />
                <a href="#">Start Free Trail</a>
              </div>
            </div>
            <div className="col-lg-4 col-sm-4 col-xs-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.1s" data-wow-offset="0">
              <div className="single-pricing inner-box wow animate__backInRight" data-wow-duration="3s" data-wow-delay="0s" data-aos="fade-up">
                <div className="price-head">
                  <h2 className='pricining-heading-css'>Advanced</h2>
                  <span style={{ backgroundColor: '#10275B',padding:'3px' }}></span>
                  <span style={{ backgroundColor: '#10275B',padding:'3px'  }}></span>
                  <span style={{ backgroundColor: '#10275B',padding:'3px' }}></span>
                  <span style={{ backgroundColor: '#10275B',padding:'3px' }}></span>
                  <span style={{ backgroundColor: '#10275B',padding:'3px' }}></span>
                  <span style={{ backgroundColor: '#10275B' ,padding:'3px'}}></span>
                </div>
                <h1 className="price">299/Listing</h1>
                {/* <h3>1 Listing</h3> */}
                <h5>30 days free trial</h5>
                <ul>{/* You can add your list items here if needed */}</ul>
                <a href="#">Start Free Trail</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section style={{ backgroundColor: '#f6f7ff' }} id="contact" className="contact section p-100s">

        {/* Section Title */}
        <div className="container section-title p-0" data-aos="fade-up">
          {/* <h1>Let Us Talk</h1> */}
          <h1 data-aos="fade-up" className="" style={{ paddingBottom: '50px' }}> <strong> Let Us Talk</strong> </h1>
        </div>{/* End Section Title */}

        <div className="container" data-aos="fade-up" data-aos-delay="100">

          <div className="row gy-10">

            <div className="col-lg-4 col-md-6" >
              <div className="info-item d-flex flex-column justify-content-center align-items-center" data-aos="fade-up"
                data-aos-delay="200">
                <i className="bi bi-geo-alt"></i>
                <h3>Address</h3>
                <p style={{ fontSize: '18px', textAlign: 'center', color: '#10275B', fontWeight: '400' }}>G1208 Smondo 3.0 <br />  Neotown Road Neotown Electronic City Phase 1<br />  Bangalore Karnataka 560100</p>
              </div>
            </div>{/* End Info Item */}

            <div className="col-lg-4 col-md-6">
              <div className="info-item d-flex flex-column justify-content-center align-items-center" data-aos="fade-up"
                data-aos-delay="300" style={{ paddingBottom: '75px', fontSize: '15px' }}>
                <i className="bi bi-telephone"></i>
                <h3>Call Us</h3>
                <p style={{ color: '#10275B', fontSize: '20px', fontWeight: '400' }}>+91 9945827004</p>
              </div>
            </div>{/* End Info Item */}

            <div className="col-lg-4 col-md-6">
              <div className="info-item d-flex flex-column justify-content-center align-items-center" data-aos="fade-up"
                data-aos-delay="400" style={{ paddingBottom: '75px', fontSize: '15px' }}>
                <i className="bi bi-envelope"></i>
                <h3>Email Us</h3>
                <p style={{ color: '#10275B', fontSize: '20px', fontWeight: '400' }}>wecare@autohostai.com</p>
              </div>
            </div>{/* End Info Item */}

          </div>

          <div className="row gy-4 mt-1" id="contact1">
            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="300" id="contact_form">
              <img src="assets/img/hero-services-img.webp" className="" alt=""
                style={{ width: '100%', maxWidth: '100%', height: 'auto', maxHeight: '100%', '--bs-box-shadow-md': '0 6rem 5rem #10275B' }}
                data-aos-delay="300" data-aos="zoom-out" />
            </div>{/* End Google Maps */}


            <div className="col-lg-6">
              <div className="container section-title" data-aos="fade-up" style={{ paddingBottom: '0px' }} >
                <h2>Lets Connect Constellations</h2>
              </div>

              <form className="php-email-form" data-aos="fade-up" data-aos-delay="400">

                <div className="row gy-4">

                  <div className="col-md-6">
                    <input type="text" name="name" id='nameInput' className="form-control" placeholder="Your Name" value={userName} required=""
                      style={{ width: '-webkit-fill-available' }} onChange={emailFunction} />
                  </div>

                  <div className="col-md-6 ">
                    <input type="email" className="form-control" id='emailInput' name="email" placeholder="Your Email" value={emailName} required=""
                      style={{ width: '-webkit-fill-available' }} onChange={emailFunction} />
                  </div>

                  <div className="col-md-12">
                    <input type="number" className="form-control" name="mobile" id='numberInput' placeholder="mobile" value={Number} required=""
                      style={{ width: '-webkit-fill-available' }} onChange={emailFunction} />
                  </div>

                  <div className="col-md-12">
                    <textarea className="form-control" name="message" id='messageInput' rows={6} placeholder="Message" value={Message} required=""
                      style={{ width: '-webkit-fill-available' }} onChange={emailFunction}></textarea>
                  </div>

                  <div className="col-md-12 text-center">
                    <div className="loading">Loading</div>
                    <div className="error-message"></div>
                    <div className="sent-message">Your message has been sent. Thank you!</div>

                    <button type="submit" className="btn-get-started m-2"
                      style={{ width: '-webkit-fill-available' }} onClick={submitForm}>Send Message</button>
                  </div>
                  <Toaster />

                </div>
              </form>
            </div>{/* End Contact Form */}

          </div>

        </div>

      </section>
    </main>

  )
};

export default observer(FrontContent);