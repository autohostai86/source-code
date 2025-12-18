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

import { Container, Form,  Row, Col   } from 'reactstrap';
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
import './term.scss';



const TermUsContent = () => {
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
      <section style={{ backgroundColor: '#f6f7ff' }} id="contact" className="contact section p-200s">
        <div className="container" style={{ marginTop: '50px' }}>
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8">
              <h1 style={{ textAlign: 'center' }} data-aos="fade-up" data-aos-delay="100">Terms and Conditions for AutoHostAI</h1>

              <h3 data-aos="fade-up" data-aos-delay="100">1. Introduction</h3>
              <p data-aos="fade-up" data-aos-delay="100">Welcome to AutoHostAI, a chatbot service provided by Soul at Home Hospitality Private Limited ("we," "us," or "our"). These Terms and Conditions ("Terms") govern your access to and use of our application ("Application"). By using AutoHostAI, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use the Application.</p>

              <h3 data-aos="fade-up" data-aos-delay="100">2. Use of the Application</h3>
              <p data-aos="fade-up" data-aos-delay="100"><strong>a. Eligibility:</strong></p>
              <ul data-aos="fade-up" data-aos-delay="100">
                <li>You must be at least 18 years old to use the Application.</li>
                <li>By using the Application, you represent and warrant that you have the legal capacity to enter into these Terms.</li>
              </ul>
              <p data-aos="fade-up" data-aos-delay="100"><strong>b. Account Registration:</strong></p>
              <ul data-aos="fade-up" data-aos-delay="100">
                <li>You may need to create an account to access certain features of the Application. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.</li>
                <li>You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</li>
              </ul>
              <p data-aos="fade-up" data-aos-delay="100"><strong>c. Permitted Use:</strong></p>
              <ul data-aos="fade-up" data-aos-delay="100">
                <li>You may use the Application for lawful purposes only. You agree not to use the Application in any way that violates any applicable local, state, national, or international law or regulation.</li>
              </ul>

              <h3 data-aos="fade-up" data-aos-delay="100">3. User Responsibilities</h3>
              <p data-aos="fade-up" data-aos-delay="100"><strong>a. Prohibited Conduct:</strong></p>
              <ul data-aos="fade-up" data-aos-delay="100">
                <li>You agree not to:
                  <ul data-aos="fade-up" data-aos-delay="100">
                    <li>Use the Application for any unauthorized or illegal purpose.</li>
                    <li>Interfere with or disrupt the integrity or performance of the Application.</li>
                    <li>Attempt to gain unauthorized access to the Application or its related systems or networks.</li>
                    <li>Use the Application to transmit any harmful or malicious code, viruses, or malware.</li>
                  </ul>
                </li>
              </ul>
              <p data-aos="fade-up" data-aos-delay="100"><strong>b. Content:</strong></p>
              <ul data-aos="fade-up" data-aos-delay="100">
                <li>You are solely responsible for the content you submit or transmit through the Application. You agree not to submit or transmit any content that:
                  <ul data-aos="fade-up" data-aos-delay="100">
                    <li>Is false, misleading, or defamatory.</li>
                    <li>Infringes on any third party's intellectual property rights or privacy rights.</li>
                    <li>Is obscene, offensive, or otherwise inappropriate.</li>
                  </ul>
                </li>
              </ul>

              <h3 data-aos="fade-up" data-aos-delay="100">4. Intellectual Property</h3>
              <p data-aos="fade-up" data-aos-delay="100"><strong>a. Ownership:</strong></p>
              <ul data-aos="fade-up" data-aos-delay="100">
                <li>The Application and its entire contents, features, and functionality, including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof, are owned by Soul at Home Hospitality Private Limited, its licensors, or other providers of such material and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</li>
              </ul>
              <p data-aos="fade-up" data-aos-delay="100"><strong>b. License:</strong></p>
              <ul data-aos="fade-up" data-aos-delay="100">
                <li>We grant you a limited, non-exclusive, non-transferable, and revocable license to use the Application for your personal, non-commercial use, subject to these Terms.</li>
              </ul>

              <h3 data-aos="fade-up" data-aos-delay="100">5. Privacy Policy</h3>
              <p data-aos="fade-up" data-aos-delay="100">Your use of the Application is also governed by our Privacy Policy, which is incorporated by reference into these Terms. Please review our Privacy Policy to understand our practices regarding your personal information.</p>

              <h3 data-aos="fade-up" data-aos-delay="100">6. Disclaimers and Limitation of Liability</h3>
              <p data-aos="fade-up" data-aos-delay="100"><strong>a. Disclaimers:</strong></p>
              <ul data-aos="fade-up" data-aos-delay="100">
                <li>The Application is provided on an "as is" and "as available" basis. We make no representations or warranties of any kind, express or implied, regarding the operation or availability of the Application, or the information, content, and materials included therein.</li>
              </ul>
              <p data-aos="fade-up" data-aos-delay="100"><strong>b. Limitation of Liability:</strong></p>
              <ul data-aos="fade-up" data-aos-delay="100">
                <li>To the fullest extent permitted by applicable law, in no event shall Soul at Home Hospitality Private Limited, its affiliates, or their respective directors, officers, employees, agents, or licensors be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of or inability to use the Application, including but not limited to damages for loss of profits, data, or other intangibles, even if we have been advised of the possibility of such damages.</li>
              </ul>

              <h3 data-aos="fade-up" data-aos-delay="100">7. Indemnification</h3>
              <p data-aos="fade-up" data-aos-delay="100">You agree to indemnify, defend, and hold harmless Soul at Home Hospitality Private Limited, its affiliates, and their respective directors, officers, employees, agents, and licensors from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising from your use of the Application or your violation of these Terms.</p>

              <h3 data-aos="fade-up" data-aos-delay="100">8. Termination</h3>
              <p data-aos="fade-up" data-aos-delay="100">We may terminate or suspend your access to the Application, without prior notice or liability, for any reason whatsoever, including but not limited to your breach of these Terms. Upon termination, your right to use the Application will immediately cease.</p>

              <h3 data-aos="fade-up" data-aos-delay="100">9. Governing Law</h3>
              <p data-aos="fade-up" data-aos-delay="100">These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.</p>

              <h3 data-aos="fade-up" data-aos-delay="100">10. Changes to These Terms</h3>
              <p data-aos="fade-up" data-aos-delay="100">We reserve the right to modify or replace these Terms at any time. We will notify you of any changes by posting the new Terms on this page. Your continued use of the Application after any such changes constitutes your acceptance of the new Terms.</p>

              <h3 data-aos="fade-up" data-aos-delay="100">11. Contact Us</h3>
              <p data-aos="fade-up" data-aos-delay="100">If you have any questions about these Terms, please contact us at:</p>
              <p data-aos="fade-up" data-aos-delay="100">
                Soul at Home Hospitality Private Limited<br />
                G1208 Smondo 3 Neotown Road Neotown Electronic City Phase 1 Bengaluru 560100<br />
                Email: wecare@autohostai.com<br />
                Phone: +91 9945827004
              </p>
            </div>
          </div>
        </div>
      </section>

    </main>

  );
};

export default observer(TermUsContent);
