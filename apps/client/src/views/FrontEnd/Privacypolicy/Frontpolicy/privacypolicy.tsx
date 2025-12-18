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

import { Container, Form,   Row, Col } from 'reactstrap';
// import jwt_decode from "jwt-decode";
import 'bootstrap/dist/css/bootstrap.min.css';
// import '../main.scss';
import AOS from 'aos';
import BOOTSTRAP from 'bootstrap';

// css include
import 'animate.css';
import '../../../../assets/vendor/aos/aos.css';
import '../../../../assets/vendor/bootstrap/css/bootstrap.min.css';
import '../../../../assets/vendor/bootstrap-icons/bootstrap-icons.css';
import '../../../../assets/vendor/glightbox/css/glightbox.min.css';
import '../../../../assets/vendor/swiper/swiper-bundle.min.css';

// js include

import '../../../../assets/vendor/bootstrap/js/bootstrap.bundle.min';
import '../../../../assets/vendor/aos/aos.js';
import '../../../../assets/vendor/glightbox/js/glightbox';
import '../../../../assets/vendor/swiper/swiper-bundle.min';
import $ from 'jquery';
import './privacy.scss';


const PolicyUsContent = () => {
    useEffect(() => {
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
            <section id="contact" className="contact section p-200s" style={{ backgroundColor: '#f6f7ff' }}>
                <div className="container" style={{ marginTop: '50px' }}>
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-10 col-lg-8">
                            <h1 style={{ textAlign: 'center' }} data-aos="fade-up" data-aos-delay="100">Privacy Policy for AutoHostAI</h1>

                            <h3 data-aos="fade-up" data-aos-delay="100">1. Introduction</h3>
                            <p data-aos="fade-up" data-aos-delay="100" style={{ fontWeight: '400' }}>Welcome to AutoHostAI, operated by Soul at Home Hospitality Private Limited ("we," "us," or "our"). We value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you use our application, AutoHostAI ("Application").</p>
                            <p data-aos="fade-up" data-aos-delay="100" style={{ fontWeight: '400' }}>Please read this Privacy Policy carefully. By using the Application, you agree to the terms of this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not use the Application.</p>

                            <h3 data-aos="fade-up" data-aos-delay="100">2. Information We Collect</h3>
                            <p data-aos="fade-up" data-aos-delay="100" style={{ fontWeight: '400' }}>We may collect and process the following types of information:</p>
                            <p data-aos="fade-up" data-aos-delay="100"><strong><b>a. Personal Information:</b></strong></p>
                            <ul data-aos="fade-up" data-aos-delay="100">
                                <li><strong>Contact Information:</strong> Name, email address, phone number.</li>
                                <li><strong>User Account Information:</strong> Username, password, and any other information you provide when creating an account.</li>
                            </ul>
                            <p data-aos="fade-up" data-aos-delay="100"><strong><b>b. Property Management Information:</b></strong></p>
                            <ul data-aos="fade-up" data-aos-delay="100">
                                <li>Details from Property Management Systems (PMS) that are necessary for the Application to function effectively, such as reservation details, guest preferences, and other related information.</li>
                            </ul>
                            <p data-aos="fade-up" data-aos-delay="100"><strong><b>c. Usage Data:</b></strong></p>
                            <ul data-aos="fade-up" data-aos-delay="100">
                                <li>Information about your interactions with the Application, such as access times, pages viewed, and the actions you take within the Application.</li>
                            </ul>
                            <p data-aos="fade-up" data-aos-delay="100"><strong><b>d. Device Information:</b></strong></p>
                            <ul data-aos="fade-up" data-aos-delay="100">
                                <li>Information about the device you use to access the Application, including IP address, browser type, and operating system.</li>
                            </ul>

                            <h3 data-aos="fade-up" data-aos-delay="100">3. How We Use Your Information</h3>
                            <p data-aos="fade-up" data-aos-delay="100" style={{ fontWeight: '400' }}>We use the information we collect for the following purposes:</p>
                            <ul data-aos="fade-up" data-aos-delay="100">
                                <li><strong>To Provide and Maintain Our Service:</strong> To operate and manage the Application and to provide the services you request.</li>
                                <li><strong>To Improve Our Service:</strong> To understand how users interact with the Application and to enhance the user experience.</li>
                                <li><strong>To Communicate with You:</strong> To send you updates, notifications, and other information related to your use of the Application.</li>
                                <li><strong>To Ensure Security:</strong> To protect against and prevent fraud, unauthorized transactions, claims, and other liabilities.</li>
                                <li><strong>To Comply with Legal Obligations:</strong> To comply with applicable laws, regulations, and legal processes.</li>
                            </ul>

                            <h3 data-aos="fade-up" data-aos-delay="100">4. Sharing Your Information</h3>
                            <p data-aos="fade-up" data-aos-delay="100" style={{ fontWeight: '400' }}>We do not sell, trade, or otherwise transfer your personal information to outside parties except as described below:</p>
                            <ul data-aos="fade-up" data-aos-delay="100">
                                <li><strong>Service Providers:</strong> We may share your information with third-party service providers who assist us in operating our Application, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.</li>
                                <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or a government agency).</li>
                                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred to the acquiring entity.</li>
                            </ul>

                            <h3 data-aos="fade-up" data-aos-delay="100">5. Data Security</h3>
                            <p data-aos="fade-up" data-aos-delay="100" style={{ fontWeight: '400' }}>We implement a variety of security measures to maintain the safety of your personal information. However, please be aware that no method of transmission over the internet, or method of electronic storage, is 100% secure. Therefore, we cannot guarantee its absolute security.</p>

                            <h3 data-aos="fade-up" data-aos-delay="100">6. Your Rights</h3>
                            <p data-aos="fade-up" data-aos-delay="100" style={{ fontWeight: '400' }}>Depending on your location, you may have the following rights regarding your personal information:</p>
                            <ul data-aos="fade-up" data-aos-delay="100">
                                <li><strong>Access:</strong> You can request access to the personal information we hold about you.</li>
                                <li><strong>Correction:</strong> You can request that we correct any inaccuracies in your personal information.</li>
                                <li><strong>Deletion:</strong> You can request that we delete your personal information.</li>
                                <li><strong>Restriction:</strong> You can request that we restrict the processing of your personal information.</li>
                                <li><strong>Data Portability:</strong> You can request a copy of your personal information in a structured, commonly used, and machine-readable format.</li>
                            </ul>
                            <p data-aos="fade-up" data-aos-delay="100">To exercise these rights, please contact us at the information provided below.</p>

                            <h3 data-aos="fade-up" data-aos-delay="100">7. Changes to This Privacy Policy</h3>
                            <p data-aos="fade-up" data-aos-delay="100" style={{ fontWeight: '400' }}>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>

                            <h3 data-aos="fade-up" data-aos-delay="100">8. Contact Us</h3>
                            <p data-aos="fade-up" data-aos-delay="100" style={{ fontWeight: '400' }}>If you have any questions about this Privacy Policy, please contact us at:</p>
                            <p data-aos="fade-up" data-aos-delay="100" style={{ fontWeight: '400' }}>
                                Soul at Home Hospitality Private Limited<br />
                                G1208 Smondo 3 Neotown Road Neotown Electronic City Phase 1 Bengaluru 560100<br />
                                Email: wecare@autohostai.com<br />
                                Phone: +91 9945827004
                            </p>
                            <p data-aos="fade-up" data-aos-delay="100" style={{ fontWeight: '400' }}>By using AutoHostAI, you signify your acceptance of this Privacy Policy. If you do not agree to this policy, please do not use our Application.</p>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
};

export default observer(PolicyUsContent);
