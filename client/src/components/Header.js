import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Button } from 'reactstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link } from 'react-router-dom';
import { logoutUser } from '../redux/ActionCreators/LoginActions';
import { connect } from 'react-redux';
import { AboutUs, ContactUs, Groups, Help, Home, Profile, Results } from '../utils/ImageUtils';

const mapStateToProps = (state) => ({
    authenticated: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
    logoutUser: () => dispatch(logoutUser()),
});

const Header = ({ authenticated, logoutUser }) => {
    const [showOffcanvas, setShowOffcanvas] = useState(false);

    const handleLoginClick = () => {
        // Close the offcanvas when login button is clicked
        setShowOffcanvas(false);
    };

    return (
        <>
            {[false].map((expand) => (
                <Navbar key={expand} expand={expand} bg='primary'>
                    <Container fluid>
                        <Navbar.Brand href="/" className='text-white'>ASSESSIFY</Navbar.Brand>
                        <Navbar.Toggle className='bg-white hover:border-none' aria-controls={`offcanvasNavbar-expand-${expand}`} onClick={() => setShowOffcanvas(!showOffcanvas)} />
                        <Navbar.Offcanvas
                            show={showOffcanvas}
                            onHide={() => setShowOffcanvas(false)}
                            id={`offcanvasNavbar-expand-${expand}`}
                            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                            placement="end"
                        >
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                                    ASSESSIFY
                                </Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <Nav className="justify-content-end flex-grow-1 pe-3">
                                    {authenticated.isAuthenticated ?
                                        <>
                                            <Nav.Link href='/' className='nav-item'>
                                                <img src={Groups} alt="Groups" />
                                                <span>Groups</span>
                                            </Nav.Link>
                                            <Nav.Link href="/results" className='nav-item'>
                                                <img src={Results} alt="Results" />
                                                <span>Results</span>
                                            </Nav.Link>
                                            <Nav.Link href="/profile" className='nav-item'>
                                                <img src={Profile} alt="user" />
                                                <span>Profile</span>
                                            </Nav.Link>
                                        </> :
                                        <>
                                            <Nav.Link href='/' className='nav-item'>
                                                <img src={Home} alt="Home" />
                                                <span>Home</span>
                                            </Nav.Link>
                                            <Nav.Link href="/about-us" className='nav-item'>
                                                <img src={AboutUs} alt="AboutUs" />
                                                <span>About Us</span>
                                            </Nav.Link>
                                            <Nav.Link href="/help" className='nav-item'>
                                                <img src={Help} alt="Help" />
                                                <span>Help</span>
                                            </Nav.Link>
                                            <Nav.Link href="/contact-us" className='nav-item'>
                                                <img src={ContactUs} alt="contact" />
                                                <span>Contact Us</span>
                                            </Nav.Link>
                                        </>
                                    }
                                    <div className='header-btn'>
                                        {authenticated.isAuthenticated ?
                                            <Button className='btnn logOut-btn' onClick={logoutUser}>
                                                Log Out
                                            </Button> :
                                            <Link to="/login">
                                                <Button className='btn' onClick={handleLoginClick}>
                                                    Login
                                                </Button>
                                            </Link>
                                        }
                                    </div>
                                </Nav>
                            </Offcanvas.Body>
                        </Navbar.Offcanvas>
                    </Container>
                </Navbar>
            ))}
        </>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
