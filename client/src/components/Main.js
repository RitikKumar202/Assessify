import React, { Component } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';

//Importing all the Components created so far

import Header from './Header';
import Home from './Home';
import Register from './Register';
import { adminRegistration, userRegistration } from '../redux/ActionCreators/RegisterActions';
import { createGroup, fetchGroups, acceptMember, removeReq, removeMem, joinGroup, createTest } from '../redux/ActionCreators/GroupActions.js';
import Login from './Login';

//Adding Redux store with Main State

const mapStateToProps = (state) => ({
    auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
    adminRegistration: (user) => dispatch(adminRegistration(user)),
    userRegistration: (user) => dispatch(userRegistration(user)),
    createGroup: (group) => dispatch(createGroup(group)),
    fetchGroups: (usertype) => dispatch(fetchGroups(usertype)),
    acceptMember: (groupId, request) => dispatch(acceptMember(groupId, request)),
    removeReq: (groupId, requestId) => dispatch(removeReq(groupId, requestId)),
    removeMem: (groupId, memberId) => dispatch(removeMem(groupId, memberId)),
    joinGroup: (groupId, request) => dispatch(joinGroup(groupId, request)),
    createTest: (groupId, test) => dispatch(createTest(groupId, test))

});




export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        localStorage.getItem('token') ? <Component {...props} /> : <Navigate to="/login" />
    )} />
)

// Defines the whole front page and combines everything together

class Main extends Component {
    render() {
        const IsAuth = this.props.auth.isAuthenticated;

        // Homepage Component which returns normal homepage when Not logged in otherwise it displays My Tests section of Logged in user

        const HomePage = () => {
            if (this.props.auth.isAuthenticated) {
                if (this.props.auth.isAdmin) {
                    return (
                        <Navigate to={'/admin'} />
                    );
                }
                else {
                    return (
                        <Navigate to={'/student'} />
                    );
                }
            }
            else {
                return (
                    <Navigate to={'/'} />
                );
            }
        }

        return (
            <div className="">
                <>
                    <Header authenticated={this.props.auth} />

                    {/* Defines Route path to all components */}

                    <Routes>
                        <Route
                            path="/"
                            element={IsAuth ? <Navigate to="/home" /> : <Home />}
                        />
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </>
            </div>
        );
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(Main);