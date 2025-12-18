import React, { useState, useEffect } from 'react';
import { BiBorderTop } from 'react-icons/bi'; // Using react-icons for the arrow icon
import '../main.scss';

const ScrollTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  const toggleVisibility = () => {
    const scrollTop = window.scrollY;

    if (scrollTop > 300) {
      setIsVisible(scrollTop < lastScrollTop);
    } else {
      setIsVisible(false);
    }

    setLastScrollTop(scrollTop);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, [lastScrollTop]);

  return (
    
    <div>
    {isVisible && (
      <button
        id="scroll-top"
        className="scroll-top d-flex align-items-center justify-content-center"
        onClick={scrollToTop}
        style={{
          position: 'fixed',
          bottom: '50px',
          right: '50px',
          backgroundColor: '#10275b',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          padding: '10px',
          cursor: 'pointer',
          zIndex: 1000,
        }}
      >
         <i
  className="bi bi-arrow-up-short"></i>
     
        </button>
        )}
        </div>
      
  );
};

export default ScrollTopButton;
