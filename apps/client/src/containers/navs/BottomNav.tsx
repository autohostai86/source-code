/** @format */
// @ts-nocheck
import * as React from 'react';
import styled from 'styled-components';
import useStore from '../../mobx/UseStore';
import { baseURL } from '../../utils/API';
// import "./BottomNav.scss";

const Nav = styled.nav`
    z-index: 500;
    /* position: absolute; */
    width: 40%;
    margin: auto;
    margin-top: 3rem;
    left: 4rem;
    right: 0;
    bottom: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    text-align: center;
    justify-content: space-between;
    align-items: center;
`;

const Img = styled.img`
    width: 14rem;
    overflow: hidden;
    margin: auto;
    border-radius: 1rem;
    margin-bottom: 0.5rem;
`;

const BottomNav: React.FC = () => {
    // const { UIState } = useStore();
    return (
        <Nav className="text-dark">
            {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
            {/* <Img src={`${UIState.footerLogo}`} alt="Logo Image" /> */}
            {/* <p>CVman Software version 1.0 - Culture Digitali s.r.l. - &#169;2021 All Rights Reserved</p> */}
            <p>Copyrights &#169; 2021 Designed &#38; Developed by vInnovate Technologies</p>
        </Nav>
    );
};

export default BottomNav;
