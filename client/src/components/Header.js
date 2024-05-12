import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Button } from 'reactstrap';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { IoHome, IoInformationCircle, IoHelpCircle } from "react-icons/io5";
import { BiSolidContact } from "react-icons/bi";

function Header() {
    return (
        <>
            {[false].map((expand) => (
                <Navbar key={expand} expand={expand} bg='primary' data-bs-theme="dark" className="bg-body-tertiary">
                    <Container fluid>
                        <Navbar.Brand href="#">ASSESSIFY</Navbar.Brand>
                        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
                        <Navbar.Offcanvas
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
                                    <Nav.Link href='home' className='nav-item'>
                                        <span><IoHome /></span>Home
                                    </Nav.Link>
                                    <Nav.Link href="#action2" className='nav-item'>
                                        <span><IoInformationCircle /></span>About Us
                                    </Nav.Link>
                                    <Nav.Link href="#action2" className='nav-item'>
                                        <span><IoHelpCircle /></span>Help
                                    </Nav.Link>
                                    <Nav.Link href="#action2" className='nav-item'>
                                        <span><BiSolidContact /></span>Contact Us
                                    </Nav.Link>
                                    <Button className='mt-3'>
                                        Login
                                    </Button>
                                    {/* <NavDropdown
                                        title="Dropdown"
                                        id={`offcanvasNavbarDropdown-expand-${expand}`}
                                    >
                                        <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                                    </NavDropdown> */}
                                </Nav>
                            </Offcanvas.Body>
                        </Navbar.Offcanvas>
                    </Container>
                </Navbar>
            ))}
        </>
    );
}

export default Header;