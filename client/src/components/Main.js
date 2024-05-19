import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

//Importing all the Components created so far

import Header from './Header';
// import Footer from './FooterComponent';
import Home from './Home';
import Student from './Student';
import Exam from './Exam';
import Exam2 from './Exam2.js';
import Exam3 from './Exam3.js';
import Register from './Register';
import Admin from './Admin';
// import Help from './HelpComponent';
import CreateTest from './CreateTest';
import EditTest from './EditTest';
import GroupDetailAdmin from './GroupDetailAdmin';
import GroupDetailStudent from './GroupDetailStudent';
import { adminRegistration, userRegistration } from '../redux/ActionCreators/RegisterActions';
import { createGroup, fetchGroups, acceptMember, removeReq, removeMem, joinGroup, createTest } from '../redux/ActionCreators/GroupActions.js';
import Login from './Login';
import AdminStudentResult from './AdminTestResultStudent';
import AdminStudentResult2 from './AdminTestResultStudent2';
import AdminStudentResult3 from './AdminTestResultStudent3';
import StudentResult from './StudentResult';
import StudentResult2 from './StudentResult2';
import StudentResult3 from './StudentResult3';
import AdminSummary from './AdminSummary';
import Profile from './Profile';
import PasswordRecovery from './PasswordRecovery';
import ContactUs from './ContactUs';

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
        localStorage.getItem('token') ? <Component {...props} /> : <Redirect to="/login" />
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
                        <Redirect to={'/admin'} />
                    );
                }
                else {
                    return (
                        <Redirect to={'/student'} />
                    );
                }
            }
            else {
                return (
                    <Redirect to={'/'} />
                );
            }
        }
        // const CreatetestforGroup=({match})=>{
        //     return(
        //         <CreateTest groupId={match.params.groupId}/>
        //     );
        // }

        return (
            <div className="Body">
                <>
                    <Header authenticated={this.props.auth} />

                    {/* Defines Route path to all components */}

                    <Switch>
                        <Route path="/" exact component={() => {
                            if (IsAuth) {
                                return (
                                    <Redirect to='/home' />
                                )
                            }
                            else {
                                return (
                                    <Home />
                                )
                            }
                        }} />
                        <Route path="/home" exact component={HomePage} />
                        <Route path="/login" exact component={Login} />
                        <Route path="/register" exact component={Register} />
                        {/* <Route path="/help" component={Help}/> */}
                        <Route path="/contact-us" component={ContactUs} />
                        <Route path="/forgot-password" component={PasswordRecovery} />
                        <PrivateRoute path="/student" component={Student} />
                        <PrivateRoute path="/admin" component={Admin} />
                        <PrivateRoute path="/profile" component={Profile} />
                        <PrivateRoute path="/exam1/:groupId/:testId" component={Exam} />
                        <PrivateRoute path="/exam2/:groupId/:testId" component={Exam2} />
                        <PrivateRoute path="/exam3/:groupId/:testId" component={Exam3} />
                        <PrivateRoute path="/createtest/:groupId" component={CreateTest} />
                        <PrivateRoute path="/edittest/:groupId/:testId" component={EditTest} />
                        <PrivateRoute path="/admingroups/:groupId" component={GroupDetailAdmin} />
                        <PrivateRoute path="/studentgroups/:groupId" component={GroupDetailStudent} />
                        <PrivateRoute path="/student/result/1/:testId" component={StudentResult} />
                        <PrivateRoute path="/student/result/2/:testId" component={StudentResult2} />
                        <PrivateRoute path="/student/result/3/:testId" component={StudentResult3} />
                        <PrivateRoute path="/adminresult/1/:testId/:studentId" component={AdminStudentResult} />
                        <PrivateRoute path="/adminresult/2/:testId/:studentId" component={AdminStudentResult2} />
                        <PrivateRoute path="/adminresult/3/:testId/:studentId" component={AdminStudentResult3} />
                        <PrivateRoute path="/adminSummary/:testType/:testId" component={AdminSummary} />
                        <Redirect to="/home" />
                    </Switch>

                    {/* <Footer/> */}
                </>
            </div>
        );
    }
}



export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));