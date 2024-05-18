import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Button } from 'reactstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link } from 'react-router-dom';
import { logoutUser } from '../redux/ActionCreators/LoginActions';
import { connect } from 'react-redux';

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
                                                <span className="fa fa-tasks fa-lg"></span>Groups
                                            </Nav.Link>
                                            <Nav.Link href="#action2" className='nav-item'>
                                                <span className="fa fa-bar-chart fa-lg"></span>Results
                                            </Nav.Link>
                                            <Nav.Link href="/profile" className='nav-item'>
                                                <span className="fa fa-info fa-lg"></span>Profile
                                            </Nav.Link>
                                        </> :
                                        <>
                                            <Nav.Link href='/' className='nav-item'>
                                                <span className="fa fa-home fa-lg"></span>Home
                                            </Nav.Link>
                                            <Nav.Link href="#action2" className='nav-item'>
                                                <span className="fa fa-info fa-lg"></span>About Us
                                            </Nav.Link>
                                            <Nav.Link href="#action2" className='nav-item'>
                                                <span className="fa fa-desktop fa-lg"></span>Help
                                            </Nav.Link>
                                            <Nav.Link href="#action2" className='nav-item'>
                                                <span className="fa fa-address-card fa-lg"></span>Contact Us
                                            </Nav.Link>
                                        </>
                                    }
                                    <div className='mt-3'>
                                        {authenticated.isAuthenticated ?
                                            <Button className='w-full logOut-btn' onClick={logoutUser}>
                                                Log Out
                                            </Button> :
                                            <Link to="/login">
                                                <Button className='w-full' onClick={handleLoginClick}>
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
