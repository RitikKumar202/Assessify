import React, { Component } from 'react';
// import { connect } from 'react-redux';
import { Card, CardBody, Label, Form, FormGroup, Input, Modal, ModalHeader, ModalBody, Button, Col, CardDeck, CardText, CardHeader, FormFeedback } from 'reactstrap';
// import { adminRegistration, userRegistration } from '../redux/ActionCreators/RegisterActions';
// import { loginUser } from '../redux/ActionCreators/LoginActions';
// import { baseUrl } from '../shared/baseUrl';

// const mapDispatchToProps = (dispatch) => ({
//     adminRegistration: (user) => dispatch(adminRegistration(user)),
//     userRegistration: (user) => dispatch(userRegistration(user)),
//     loginUser: (creds) => dispatch(loginUser(creds))
// });

class Register extends Component {
    state = {
        isModal1Open: false,
        isModal2Open: false,
        username: '',
        firstname: '',
        lastname: '',
        organisation: '',
        email: '',
        password: '',
        agree: false,
        userType: '',
        touched: {
            username: false,
            firstname: false,
            lastname: false,
            organisation: false,
            password: false,
            email: false
        }
    };

    toggleModal1 = () => {
        this.setState({
            isModal1Open: !this.state.isModal1Open,
            userType: 'users'
        });
    };

    toggleModal2 = () => {
        this.setState({
            isModal2Open: !this.state.isModal2Open,
            userType: 'admins'
        });
    };

    // handleInputChange = (event) => {
    //     const { target } = event;
    //     const value = target.type === 'checkbox' ? target.checked : target.value;
    //     const { name } = target;

    //     this.setState({
    //         [name]: value
    //     });
    // };

    // handleBlur = (field) => (evt) => {
    //     this.setState({
    //         touched: { ...this.state.touched, [field]: true }
    //     });
    // };

    // handleSubmitAdmins = (event) => {
    //     event.preventDefault();

    //     const { username, firstname, lastname, organisation, email, password } = this.state;

    //     const user = {
    //         username,
    //         firstname,
    //         lastname,
    //         organisation,
    //         password,
    //         email
    //     };

    //     fetch(baseUrl + 'register/admins', {
    //         method: 'POST',
    //         body: JSON.stringify(user),
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         credentials: 'same-origin'
    //     })
    //         .then(response => {
    //             if (response.ok) {
    //                 return response;
    //             } else {
    //                 var error = new Error('Error ' + response.status + ': ' + response.statusText);
    //                 error.response = response;
    //                 throw error;
    //             }
    //         }, error => {
    //             var errmess = new Error(error.message);
    //             throw errmess;
    //         })
    //         .then(response => response.json())
    //         .then(response => {
    //             alert('Your Registration is Successful, Sign in to the New Account Using Username and Password!');
    //             const creds = {
    //                 username: user.username,
    //                 password: user.password,
    //                 userType: 'admins'
    //             };
    //             this.props.loginUser(creds);
    //             this.toggleModal2();
    //             this.props.history.push('/');
    //         })
    //         .catch(error => {
    //             console.log('Admin Registration ', error.message);
    //             alert('This username is already taken');
    //         });
    // };

    // handleSubmitUsers = (event) => {
    //     event.preventDefault();

    //     const { username, firstname, lastname, email, password } = this.state;

    //     const user = {
    //         username,
    //         firstname,
    //         lastname,
    //         password,
    //         email
    //     };

    //     fetch(baseUrl + 'register/users', {
    //         method: 'POST',
    //         body: JSON.stringify(user),
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         credentials: 'same-origin'
    //     })
    //         .then(response => {
    //             if (response.ok) {
    //                 return response;
    //             } else {
    //                 var error = new Error('Error ' + response.status + ': ' + response.statusText);
    //                 error.response = response;
    //                 throw error;
    //             }
    //         }, error => {
    //             var errmess = new Error(error.message);
    //             throw errmess;
    //         })
    //         .then(response => response.json())
    //         .then(response => {
    //             alert('Your Registration is Successful, Sign in to the New Account Using Username and Password!');
    //             const creds = {
    //                 username: user.username,
    //                 password: user.password,
    //                 userType: 'users'
    //             };
    //             this.props.loginUser(creds);
    //             this.toggleModal1();
    //             this.props.history.push('/');
    //         })
    //         .catch(error => {
    //             console.log('User Registration ', error.message);
    //             alert('This username is already taken');
    //         });
    // };

    // validate = (username, firstname, lastname, organisation, password, email) => {
    //     const errors = {
    //         username: '',
    //         firstname: '',
    //         lastname: '',
    //         organisation: '',
    //         password: '',
    //         email: ''
    //     };

    //     if (this.state.touched.username && username.length < 5)
    //         errors.username = 'User Name should be >= 5 characters';
    //     else if (this.state.touched.username && username.length > 15)
    //         errors.username = 'User Name should be <= 15 characters';

    //     if (this.state.touched.firstname && firstname.length < 3)
    //         errors.firstname = 'First Name should be >= 3 characters';

    //     if (this.state.touched.lastname && lastname.length < 3)
    //         errors.lastname = 'Last Name should be >= 3 characters';
    //     else if (this.state.touched.lastname && lastname.length > 10)
    //         errors.lastname = 'Last Name should be <= 10 characters';

    //     if (this.state.touched.organisation && organisation.length < 3)
    //         errors.organisation = 'Organisation Name should be >= 3 characters';

    //     if (this.state.touched.password && password.length < 8)
    //         errors.password = 'Password should be >= 8 characters';

    //     if (this.state.touched.email && email.split('').filter(x => x === '@').length !== 1)
    //         errors.email = 'Email should contain a @';

    //     return errors;
    // };

    render() {
        const { username, firstname, lastname, organisation, password, email, touched } = this.state;
        // const errors = this.validate(username, firstname, lastname, organisation, password, email);

        return (
            <div className="container">
                <div className='my-10 flex flex-col items-center md:flex-row md:justify-center gap-4'>
                    <div className='card-border-1 rounded-md w-[340px]'>
                        <div className='bg-blue-600 text-white text-center text-xl rounded-t-md py-2'>
                            Students
                        </div>
                        <div className='flex flex-col gap-2 items-center justify-center py-8 px-3'>
                            <p className='text-center text-base text-slate-600'>All Students should register to give the test from the below link.</p>
                            <Button onClick={this.toggleModal1} type="submit" color="primary" className='w-[200px]'>Register</Button>
                        </div>
                    </div>
                    <div className='card-border-2 rounded-md w-[340px]'>
                        <div className='bg-red-600 text-white text-center text-xl rounded-t-md py-2'>
                            Administrators
                        </div>
                        <div className='flex flex-col gap-2 items-center justify-center py-8 px-3'>
                            <p className='text-center text-base text-slate-600'>All Admins should register to Take the test from the below link.</p>
                            <Button onClick={this.toggleModal2} type="submit" color="danger" className='w-[200px]'>Register</Button>
                        </div>
                    </div>
                </div>

                {/* student registration */}

                <Modal isOpen={this.state.isModal1Open} toggle={this.toggleModal1}>
                    <ModalHeader toggle={this.toggleModal1}><strong>Sign up free Student Account</strong></ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.handleSubmitUsers}>
                            <FormGroup row>
                                <Col md={10}>
                                    <Input type="text" id="username" name="username"
                                        placeholder="User Name"
                                        value={username}
                                    // valid={errors.username === ''}
                                    // invalid={errors.username !== ''}
                                    // onBlur={this.handleBlur('username')}
                                    // onChange={this.handleInputChange}
                                    />
                                    {/* <FormFeedback>{errors.username}</FormFeedback> */}
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md={5}>
                                    <Input type="text" id="firstname" name="firstname"
                                        placeholder="First Name"
                                        value={firstname}
                                    // valid={errors.firstname === ''}
                                    // invalid={errors.firstname !== ''}
                                    // onBlur={this.handleBlur('firstname')}
                                    // onChange={this.handleInputChange}
                                    />
                                    {/* <FormFeedback>{errors.firstname}</FormFeedback> */}
                                </Col>
                                <Col md={5}>
                                    <Input type="text" id="lastname" name="lastname"
                                        placeholder="Last Name"
                                        value={lastname}
                                    // valid={errors.lastname === ''}
                                    // invalid={errors.lastname !== ''}
                                    // onBlur={this.handleBlur('lastname')}
                                    // onChange={this.handleInputChange} 
                                    />
                                    {/* <FormFeedback>{errors.lastname}</FormFeedback> */}
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md={10}>
                                    <Input type="email" id="email" name="email"
                                        placeholder="Email"
                                        value={email}
                                    // valid={errors.email === ''}
                                    // invalid={errors.email !== ''}
                                    // onBlur={this.handleBlur('email')}
                                    // onChange={this.handleInputChange} 
                                    />
                                    {/* <FormFeedback>{errors.email}</FormFeedback> */}
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md={10}>
                                    <Input type="password" id="password" name="password"
                                        placeholder="Password"
                                        value={password}
                                    // valid={errors.password === ''}
                                    // invalid={errors.password !== ''}
                                    // onBlur={this.handleBlur('password')}
                                    // onChange={this.handleInputChange}
                                    />
                                    {/* <FormFeedback>{errors.password}</FormFeedback> */}
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md={{ size: 10 }}>
                                    <Button type="submit" color="primary">Register</Button>
                                </Col>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>

                {/* Admin Registration  */}

                <Modal isOpen={this.state.isModal2Open} toggle={this.toggleModal2}>
                    <ModalHeader toggle={this.toggleModal2}><strong>Sign up for Administrator Account</strong></ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.handleSubmitAdmins}>
                            <FormGroup row>
                                <Col md={10}>
                                    <Input type="text" id="username" name="username"
                                        placeholder="User Name"
                                        value={username}
                                    // valid={errors.username === ''}
                                    // invalid={errors.username !== ''}
                                    // onBlur={this.handleBlur('username')}
                                    // onChange={this.handleInputChange} 
                                    />
                                    {/* <FormFeedback>{errors.username}</FormFeedback> */}
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md={5}>
                                    <Input type="text" id="firstname" name="firstname"
                                        placeholder="First Name"
                                        value={firstname}
                                    // valid={errors.firstname === ''}
                                    // invalid={errors.firstname !== ''}
                                    // onBlur={this.handleBlur('firstname')}
                                    // onChange={this.handleInputChange} 
                                    />
                                    {/* <FormFeedback>{errors.firstname}</FormFeedback> */}
                                </Col>
                                <Col md={5}>
                                    <Input type="text" id="lastname" name="lastname"
                                        placeholder="Last Name"
                                        value={lastname}
                                    // valid={errors.lastname === ''}
                                    // invalid={errors.lastname !== ''}
                                    // onBlur={this.handleBlur('lastname')}
                                    // onChange={this.handleInputChange}
                                    />
                                    {/* <FormFeedback>{errors.lastname}</FormFeedback> */}
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md={10}>
                                    <Input type="organisation" id="organisation" name="organisation"
                                        placeholder="Organisation"
                                        value={organisation}
                                    // valid={errors.organisation === ''}
                                    // invalid={errors.organisation !== ''}
                                    // onBlur={this.handleBlur('organisation')}
                                    // onChange={this.handleInputChange} 
                                    />
                                    {/* <FormFeedback>{errors.organisation}</FormFeedback> */}
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md={10}>
                                    <Input type="email" id="email" name="email"
                                        placeholder="Email"
                                        value={email}
                                    // valid={errors.email === ''}
                                    // invalid={errors.email !== ''}
                                    // onBlur={this.handleBlur('email')}
                                    // onChange={this.handleInputChange}
                                    />
                                    {/* <FormFeedback>{errors.email}</FormFeedback> */}
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md={10}>
                                    <Input type="password" id="password" name="password"
                                        placeholder="Password"
                                        value={password}
                                    // valid={errors.password === ''}
                                    // invalid={errors.password !== ''}
                                    // onBlur={this.handleBlur('password')}
                                    // onChange={this.handleInputChange}
                                    />
                                    {/* <FormFeedback>{errors.password}</FormFeedback> */}
                                </Col>
                            </FormGroup>
                            <FormGroup check>
                                <Label check>
                                    <Input type="checkbox"
                                        name="agree"
                                        checked={this.state.agree}
                                    // onChange={this.handleInputChange}
                                    /> {' '}
                                    <strong>I accept all the terms & conditions of QUIZ TIME.</strong>
                                </Label>
                            </FormGroup>
                            <FormGroup row>
                                <Col md={{ size: 10 }}>
                                    <Button type="submit" color="danger">Register</Button>
                                </Col>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default Register;
