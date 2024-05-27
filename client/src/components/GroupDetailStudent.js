import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { baseUrl } from '../shared/baseUrl';
import moment from 'moment';
///This component shows the list of tests present in a specific group for student to give
//From this component he can start exam or see response sheet if test is over and evaluated




class GroupDetailStudent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeTab: '1',
            isFetching: 'false',
            group: null,
        };

        this.toggleTab = this.toggleTab.bind(this);
        this.fetchGroupwithID = this.fetchGroupwithID.bind(this);
    }
    toggleTab(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }
    fetchGroupwithID = (groupId) => {
        const bearer = 'Bearer ' + localStorage.getItem('token');
        this.setState({ ...this.state, isFetching: true });
        fetch(baseUrl + 'student/' + groupId + '/getTestByGroup', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': bearer
            },
            credentials: "same-origin"
        })
            .then(response => response.json())
            .then(result => {
                this.setState({ group: result, isFetching: false })
            })
            .catch(e => {
                console.log(e);
                this.setState({ ...this.state, isFetching: false });
            });
    };

    componentDidMount() {
        this.fetchGroupwithID(this.props.match.params.groupId);
    }



    render() {
        if (this.state.isFetching) {
            return (
                <h2 className='loading'>Loading Tests.....</h2>
            );
        }
        else {
            console.log(this.state.group.tests)
            const tests = this.state.group.tests;
            console.log(tests);
            var testslist;
            if (tests.length) {
                testslist = tests.map((test, index) => {
                    var testtype;
                    if (test.testType === '1') {
                        testtype = "MCQ Only"
                    }
                    if (test.testType === '2') {
                        testtype = "MCQ + Fill in the blanks"
                    }
                    if (test.testType === '3') {
                        testtype = "Assignment Type"
                    }
                    var negative = test.negative ? "YES" : "NO";
                    var negPercentage = test.negative ? test.negPercentage : "0";
                    if (test.isCompleted) {

                        return (
                            <tr className='group-data-row'>
                                <td>{test.title}</td>
                                <td>{moment.utc(test.startDate).local().format('llll')}</td>
                                <td>{test.subject}</td>
                                <td>{test.duration}</td>
                                <td>{testtype}</td>
                                <td>{negative}</td>
                                <td>{negPercentage}</td>
                                <td>{test.totalMarks}</td>
                                <td>
                                    <Link to={`/student/result/${test.testType}/${test._id}`} ><Button outline color="success" size="sm">Results</Button></Link>
                                </td>
                            </tr>

                        );
                    }
                    else {
                        var examlink;
                        if (test.testType === '1') {
                            examlink = `/exam1/${this.state.group._id}/${test._id}`;
                        }
                        else if (test.testType === '2') {
                            examlink = `/exam2/${this.state.group._id}/${test._id}`;
                        }
                        else if (test.testType === '3') {
                            examlink = `/exam3/${this.state.group._id}/${test._id}`;
                        }
                        return (
                            <tr className='group-data-row'>
                                <td>{test.title}</td>
                                <td>{moment.utc(test.startDate).local().format('llll')}</td>
                                <td>{test.subject}</td>
                                <td>{test.duration}</td>
                                <td>{testtype}</td>
                                <td>{negative}</td>
                                <td>{negPercentage}</td>
                                <td>{test.totalMarks}</td>
                                <td>
                                    <Link to={examlink} ><Button outline color="primary" size="sm">Start Test</Button></Link>
                                </td>
                            </tr>

                        );

                    }


                })
            }
            else {
                testslist = (
                    <tr>
                        <td colSpan="9">No tests Available Yet</td>
                    </tr>
                );
            }
            var grouptype = this.state.group.isPrivate ? 'Private' : 'Public';
            return (
                <div className="container mt-5">
                    <Nav tabs>
                        <NavItem>
                            <NavLink className={classnames({ active: this.state.activeTab === '1' })} onClick={() => { this.toggleTab('1'); }}>
                                Tests
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className={classnames({ active: this.state.activeTab === '2' })} onClick={() => { this.toggleTab('2'); }}>
                                Group Details
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={this.state.activeTab}>

                        <TabPane tabId="1">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Test Name</th>
                                            <th>Start Date</th>
                                            <th>Subject</th>
                                            <th>Duration(in Mins)</th>
                                            <th>Test Type</th>
                                            <th>Negative Marking</th>
                                            <th>Negative Percentage</th>
                                            <th>Total Marks</th>
                                            <th>Start/Result</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {testslist}
                                    </tbody>
                                </table>
                            </div>

                        </TabPane>

                        <TabPane tabId="2">
                            <div className='group-details'>
                                <h5>Group Name: <span>{this.state.group.name}</span></h5>
                                <h5>Group Type: <span>{grouptype}</span></h5>
                                <h5>
                                    Group ID: <span>{this.state.group._id}</span>
                                </h5>
                            </div>

                        </TabPane>
                    </TabContent>
                </div>


            );
        }


    }

}

export default GroupDetailStudent;
