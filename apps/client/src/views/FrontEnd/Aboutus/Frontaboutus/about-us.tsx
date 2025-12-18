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

import { Container, Form,   Row, Col     } from 'reactstrap';
// import jwt_decode from "jwt-decode";
import 'bootstrap/dist/css/bootstrap.min.css';
import { baseURL } from 'apps/client/src/utils/API';
// import '../main.scss';
import AOS from 'aos';
import ReactPlayer from 'react-player';
import BOOTSTRAP from 'bootstrap';

// css include
import 'animate.css';
import '../../../../assets/vendor/aos/aos.css';
import '../../../../assets/vendor/bootstrap/css/bootstrap.min.css';
import '../../../../assets/vendor/bootstrap-icons/bootstrap-icons.css';
import '../../../../assets/vendor/glightbox/css/glightbox.min.css';
import '../../../../assets/vendor/swiper/swiper-bundle.min.css';

// js include
import Typewriter from 'typewriter-effect/dist/core';
import '../../../../assets/vendor/bootstrap/js/bootstrap.bundle.min';
import '../../../../assets/vendor/aos/aos.js';
import '../../../../assets/vendor/glightbox/js/glightbox';
import '../../../../assets/vendor/swiper/swiper-bundle.min';
import $ from 'jquery';
import './about.scss';

const AboutUsContent = () => {
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
    <section style={{backgroundColor: '#f6f7ff' }} id="" className="faq section p-0">
    <div className="container-md vh-0"style={{ marginRight:'0', padding:'0px' }}>
<div className="row" data-aos="fade-up" data-aos-delay="100">
    <div className="col-md-6 order-2 order-md-1 d-flex flex-column justify-content-center" style={{paddingRight:'50px' }}>
        <h1 id="h1">Made by Hosts. <span className="highlight">for Hosts.</span></h1>
        {/* <!-- <p style="color:#10275B">Adapting to a changing hospitality industry, meet HostAI.</p> --> */}
        <div className="d-flex mt-4">
            <img src="assets/img/founder.jpg" alt="Cole Rubin" className="profile-img me-3"></img>
            <div>
                <p className="mb-0 p-0" style={{color:'#10275B'}}><strong>Harsh Patel</strong></p>
                <p className="mb-0 p-0" style={{color:'#10275B'}}>Co-founder, AutoHostAI</p>
            </div>
        </div>
    </div>
    <div className="col-md-6 order-1 order-md-2 p-0 m-0">
        {/* <!-- <img src="assets/img/image hotel.png" alt="House" style="height:650px;width:1300px;" className="img-fluid i_m"> --> */}
        <img src="assets/img/image hotel.png" alt="House"  className="img-fluid i_m"></img>
    </div>
</div>
</div>


<div className="container"style={{paddingTop:'50px'}}>
<h1 id="h2" style={{textAlign:'center',fontSize:'30px'}}>We help Hosts Save Time</h1>

<div className="section" data-aos="fade-up" data-aos-delay="100">
        <h2>My Background</h2>
        <p>I am a superhost on Airbnb for over 7 years and I have managed over 50 plus properties. Over time I have learned that there are a lot of tasks we as hosts manage that are repeated, time consuming, exhausting and require a lot of resources from our end. My goal is to save us hosts time so that we can focus on other important things in life like family. I have now embarked on a journey to develop a set of tools with the help of artificial intelligence to ensure hosts can harness the power of AI to eliminate repeated tasks that take up their time.</p>
    </div>

<div className="section" data-aos="fade-up" data-aos-delay="100">
        <h2>The Problem</h2>
        <p>Problem: 80% of all guest questions ask repetitive questions like "What is the check-in time?", "How far is the airport?", "Is there a grocery store nearby?". Property owners waste a lot of time answering these repetitive questions.</p>
    </div>

<div className="section" data-aos="fade-up" data-aos-delay="100">
        <h2>Solution</h2>
        <p>We have spent over 2 years developing a chatbot specifically for the hospitality business where our chatbot can answer everything from simple questions to complex questions regarding their stay. Our chatbot is so advanced that the guest will not be able to distinguish between the bot and a human. This helps businesses save time, money, and resources, and also increases booking conversions.</p>
    </div>

<div className="section" data-aos="fade-up" data-aos-delay="100">
        <h2>Beyond Guest Messaging</h2>
        <p>Guest messaging is just the start. My goal is to free hosts from the cumbersome daily tasks via AI. Give back time by automating most tasks right from finance, marketing, operations, housekeeping, to review management.</p>
    </div>

<div className="section" data-aos="fade-up" data-aos-delay="100">
        <h2>JOIN US</h2>
        <p>At Auto Host AI, we are passionate about empowering property owners to streamline their operations and enhance guest satisfaction simultaneously. Our innovative platform automates the entire guest communication process, leveraging AI to deliver tailored messages, handle inquiries, and provide seamless support around the clock.</p>
        <p>Whether you're managing a handful of properties or an extensive portfolio, our platform is designed to scale effortlessly, enabling you to devote more time to growing your business and less time on mundane administrative tasks.</p>
        <p>Join countless satisfied users who have experienced the transformative power of Auto Host AI in elevating their short-term rental businesses to new heights. Discover the freedom to focus on what truly matters—providing unforgettable guest experiences and unlocking the full potential of your properties.</p>
        <p>Experience the future of guest communication with Auto Host AI. Get started today and embark on a journey towards greater efficiency, profitability, and success in the dynamic world of short-term property management.</p>
    </div>
</div>
    </section>

</main>
  );
};

export default observer(AboutUsContent);
