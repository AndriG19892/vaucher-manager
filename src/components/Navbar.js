import React, { useState } from 'react';
import Logo_img from './Logo';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <NavbarContainer>
                      <Logo_img />


            {/* Pulsante hamburger visibile solo su mobile */}
            <Hamburger onClick={() => setIsOpen(!isOpen)}>
                <span />
                <span />
                <span />
            </Hamburger>

            {/* Menu laterale a scomparsa */}
            <SideMenu isOpen={isOpen}>
                <Logo_img />
                <MenuLink to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</MenuLink>
                <MenuLink to="/shop" onClick={() => setIsOpen(false)}>Spese</MenuLink>
                <MenuLink to="/vouchers" onClick={() => setIsOpen(false)}>Voucher</MenuLink>

                <Dropdown>
                    <DropButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        Profilo ⌄
                    </DropButton>
                    {isDropdownOpen && (
                        <DropdownContent>
                            <MenuLink to="/profilo" onClick={() => setIsOpen(false)}>Il mio profilo</MenuLink>
                            <MenuLink to="/settings" onClick={() => setIsOpen(false)}>Impostazioni</MenuLink>
                            <MenuLink to="/logout" onClick={() => setIsOpen(false)}>Logout</MenuLink>
                        </DropdownContent>
                    )}
                </Dropdown>
            </SideMenu>
        </NavbarContainer>
    );
};

// Stili
const NavbarContainer = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #012f43;
    padding: 10px 20px;
    color: #fff;
    position: relative;
`;


const Hamburger = styled.div`
    display: none;
    flex-direction: column;
    cursor: pointer;
    gap: 5px;

    span {
        height: 3px;
        width: 25px;
        background: #fff;
        border-radius: 5px;
    }

    @media (max-width: 768px) {
        display: flex;
    }
`;

const SideMenu = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: start;
        background: #012f43;
        position: fixed;
        top: 0;
        left: ${({ isOpen }) => (isOpen ? "0" : "-250px")};
        font-size: 30px;
        height: 100vh;
        width: 250px;
        padding: 50px 20px;
        transition: left 0.3s ease;
        box-shadow: ${({ isOpen }) => (isOpen ? "2px 0 5px rgba(0,0,0,0.3)" : "none")};
        z-index: 999;
    }
`;

const MenuLink = styled(Link)`
    text-decoration: none;
    color: #fff;
    cursor: pointer;
    &:hover {
        text-decoration: underline;
    }
`;

const Dropdown = styled.div`
    position: relative;
    width: 100%;
`;

const DropButton = styled.button`
    background: none;
    border: none;
    color: #fff;
    cursor: pointer;
    width: 100%;
    text-align: left;
`;

const DropdownContent = styled.div`
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0px 2px 6px rgba(0,0,0,0.2);
  margin-top: 5px;
    position: absolute;
    left: -30px;
  a {
    display: block;
    padding: 10px;
    color: #333;
    text-decoration: none;

    &:hover {
      background: #eee;
    }
  }
    @media (max-width: 768px) {
        left: 0;
    }
`;

export default Navbar;
