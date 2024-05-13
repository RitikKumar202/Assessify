import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardBody, CardHeader, Form, FormGroup, FormFeedback, Col, Input, Button, Label } from 'reactstrap';
// import { loginUser } from '../redux/ActionCreators/LoginActions';
import { Redirect, Link } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [admin, setAdmin] = useState(false);
    // const dispatch = useDispatch();
    // const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    // const err = useSelector(state => state.auth.err);

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        if (type === 'checkbox') {
            setAdmin(checked);
        } else if (name === 'username') {
            setUsername(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };

    // const handleSubmitLogin = (event) => {
    //     event.preventDefault();
    //     const user = {
    //         username,
    //         password,
    //         userType: admin ? 'admins' : 'users'
    //     };
    //     dispatch(loginUser(user));
    // };

    // const { passMessage, userMessage } = err || {};
    // const errors = {
    //     username: userMessage || '',
    //     password: passMessage || '',
    // };
    // const isUsernameValid = errors.username === '';
    // const isPasswordValid = errors.password === '';

    // if (isAuthenticated) {
    //     return <Redirect to='/home' />;
    // }

    return (
        <div className='container'>
            <div className='row justify-content-center'>
                <div className='col-md-6'>
                    <Card className="mb-5 md-5 mt-5">
                        <CardHeader className="bg-primary text-white text-center text-xl">Sign In</CardHeader>
                        <CardBody>
                            <Form>
                                <FormGroup row>
                                    <Col>
                                        <Input type="text" id="username" name="username"
                                            placeholder="Username"
                                            value={username}
                                            onChange={handleInputChange}
                                            required />
                                        {/* <FormFeedback>{errors.username}</FormFeedback> */}
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col>
                                        <Input type="password" id="password" name="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={handleInputChange}
                                            required />
                                        {/* <FormFeedback>{errors.password}</FormFeedback> */}
                                    </Col>
                                </FormGroup>
                                <FormGroup check>
                                    <Label check>
                                        <Input type="checkbox"
                                            name="admin"
                                            checked={admin}
                                            onChange={handleInputChange} /> {' '}
                                        <span className='font-medium'>Administrator Account</span>
                                    </Label>
                                </FormGroup>
                                <FormGroup row className='mx-1 mt-3'>
                                    <Button type="submit" color="success">
                                        Login
                                    </Button>
                                </FormGroup>
                                <Link to="/forgot-password" >Forgot Password?</Link>
                            </Form>
                            <div className='flex gap-3 items-center mt-3'>
                                <p className='mb-0'>Don't have an account?</p>
                                <Link to="/register">
                                    Register Now
                                </Link>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div >
    );
};

export default Login;
