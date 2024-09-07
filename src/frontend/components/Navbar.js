import {
    Link
} from "react-router-dom";
import { Navbar, Nav, Button, Container } from 'react-bootstrap'
import market from './market.png'

import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import logo from "../asset/BharatSe_logo2.png";
import smalllogo from "../asset/logo1.png";

import './Navbar.css'

const Navigation = ({ web3Handler, account }) => {
    const [toggleMenu, setToggleMenu] = useState(false);
    const toggleColor=()=>{
        var linkanchors=Array.from(document.getElementsByClassName('linkanchors'))
        if(linkanchors.length>0){
        linkanchors.map((i)=>{
            i.classList.remove('linkcolor')
        })
        var url=window.location.pathname
        if(url=='/')
            linkanchors[0].classList.add('linkcolor')
        else if(url=='/create')
            linkanchors[1].classList.add('linkcolor')
        else if(url=='/my-listed-items')
            linkanchors[2].classList.add('linkcolor')
        else if(url=='/my-purchases')
            linkanchors[3].classList.add('linkcolor')
      }
    }
    toggleColor()
    
    return (
        <>
            <div className="h-20 overflow-x-hidden bg-white"></div>
             <nav className="app__navbar w-screen fixed top-0 ">
             <div className="app__navbar-logo">
               <img className="h-full w-full object-cover" src={logo}></img>
             </div>
             <div className="app__navbar-logo_small">
               <img className="h-full w-full object-cover" src={smalllogo}></img>
             </div>
             <div className="app__navbar-links text-white">
             <ul>
              <li onClick={toggleColor}>
                <Nav.Link className={`linkanchors `} as={Link}  to="/">Home</Nav.Link>
              </li>
              <li onClick={toggleColor} >
                <Nav.Link as={Link} className={`linkanchors`} to="/create">Create</Nav.Link>
              </li>
              <li onClick={toggleColor}>
                        <Nav.Link as={Link} className={`linkanchors `} to="/my-listed-items">My Listed Items</Nav.Link>
              </li>
              <li onClick={toggleColor}>
                        <Nav.Link as={Link} className={`linkanchors `} to="/my-purchases">My Purchases</Nav.Link>
              </li>
            </ul> 
             </div>
             <div className="app__navbar-search bg-transparent">
               <div className="search">
                 <input
                   type="text"
                   className="bg-transparent text-white"
                   placeholder="Search"
                 />
                 <AiOutlineSearch className="search__icon" />
               </div>
             </div>
             <div className="app__navbar-button">
             {account ? (
                                <button className="button_2">
                                    {account.slice(0, 5) + '...' + account.slice(38, 42)}
            
                            </button>
                            ) : (
                                <button onClick={web3Handler} className="button_1">Connect Wallet</button>
                            )}
             </div>
             <div className="app__navbar-smallscreen items-center">
               <GiHamburgerMenu
                 color="#eaeaea"
                 fontSize={27}
                 onClick={() => {
                   toggleMenu ? setToggleMenu(false) : setToggleMenu(true);
                 }}
               />
               {toggleMenu && (
                 <div className="app__navbar-smallscreen_overlay slide-bottom flex flex-col items-end fixed top-16 right-2">
                   {/* <MdClose fontSize={27} className='overlay__close' onClick={() => setToggleMenu(false)} /> */}
                   <ul className="app__navbar-smallscreen-links items-end">
                     <li className="my-2 text-right">
                       <a href="#">Marketplace</a>
                     </li>
                     <li className="my-2 text-right">
                       <a href="#">Resource</a>
                     </li>
                     <li className="my-2 text-right">
                       <a href="#">About</a>
                     </li>
                   </ul>
                 </div>
               )}
             </div>
                   </nav>
        </>
    )

}

export default Navigation;

{/* <Navbar expand="lg" bg="secondary" variant="dark">
            <Container>
                <Navbar.Brand href="http://www.dappuniversity.com/bootcamp">
                    <img src={market} width="40" height="40" className="" alt="" />
                    &nbsp; DApp NFT Marketplace
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/create">Create</Nav.Link>
                        <Nav.Link as={Link} to="/my-listed-items">My Listed Items</Nav.Link>
                        <Nav.Link as={Link} to="/my-purchases">My Purchases</Nav.Link>
                    </Nav>
                    <Nav>
                        {account ? (
                            <Nav.Link
                                href={`https://etherscan.io/address/${account}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="button nav-button btn-sm mx-4">
                                <Button variant="outline-light">
                                    {account.slice(0, 5) + '...' + account.slice(38, 42)}
                                </Button>

                            </Nav.Link>
                        ) : (
                            <Button onClick={web3Handler} variant="outline-light">Connect Wallet</Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar> */}