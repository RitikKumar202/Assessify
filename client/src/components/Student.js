import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col, Table, Form, FormGroup, Input, Modal, ModalHeader, ModalBody, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { connect } from 'react-redux'
import { joinGroup, fetchGroups } from '../redux/ActionCreators/GroupActions';
import { Groups } from '../utils/ImageUtils';
import { toast } from 'react-toastify';

const mapStateToProps = state => ({
    groups: state.groups,
});

const mapDispatchToProps = (dispatch) => ({
    joinGroup: (groupId, req) => dispatch(joinGroup(groupId, req)),
    fetchGroups: (access) => dispatch(fetchGroups(access))

})
// Student Component to display th elist of group the signed in student is part of

class Student extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
            activeTab: '1',
            groupId: '',
            name: '',
            uniqueID: '',
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleJoinGroup = this.handleJoinGroup.bind(this);
        this.toggleTab = this.toggleTab.bind(this);
    }
    componentDidMount() {
        this.props.fetchGroups('users')
    }
    toggleTab(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }
    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleJoinGroup(event) {
        this.toggleModal();
        // alert('The following Req will be Sent to join the Group: ' + this.state.groupId);
        toast.success('Successfully sent the join request');
        var req = {
            name: this.state.name,
            uniqueID: this.state.uniqueID,
        }
        var groupId = this.state.groupId;
        this.props.joinGroup(groupId, req);
        event.preventDefault();
    }
    render() {
        const groups = this.props.groups.groups;
        let grouplist;

        if (groups && groups.length > 0) {
            grouplist = groups.map((group, index) => {
                return (
                    <tr className='group-data-row' key={group._id}>
                        <td>{index + 1}</td>
                        <td><img src={Groups} alt="Groups" />{group.name}</td>
                        <td>{group.creator.firstname}</td>
                        <td>{group.tests.length}</td>
                        <td><Link to={`/studentgroups/${group._id}`} ><Button outline color="info" size="sm">Details</Button></Link></td>
                    </tr>
                );
            });
        } else {
            grouplist = (
                <tr>
                    <td colSpan="5">You are not a member of Any Group</td>
                </tr>
            );
        }

        return (
            <div className="container mt-5">
                {/* A Navigation Tab to switch between old tests and new ones */}
                <Nav tabs>
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '1' })} onClick={() => { this.toggleTab('1'); }}>
                            Groups
                        </NavLink>
                    </NavItem>
                </Nav>

                {/* Contents of both tabs */}
                <div className="table-responsive" activeTab={this.state.activeTab}>
                    <Table className="table">
                        <thead>
                            <tr>
                                <th>S.No.</th>
                                <th>Group Name</th>
                                <th>Created By</th>
                                <th>Tests</th>
                                <th>Group Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grouplist}
                        </tbody>
                    </Table>
                </div>
                <Button className='join-group-btn' onClick={this.toggleModal} type="submit" color="primary">Join Group</Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}><strong>Join A Group</strong></ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.handleJoinGroup}>
                            <FormGroup row>
                                <Col md={10}>
                                    <Input type="text" id="groupId" name="groupId"
                                        placeholder="Group ID"
                                        value={this.state.groupId}
                                        onChange={this.handleInputChange} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md={10}>
                                    <Input type="text" id="name" name="name"
                                        placeholder="Name"
                                        value={this.state.name}
                                        onChange={this.handleInputChange} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md={10}>
                                    <Input type="text" id="uniqueID" name="uniqueID"
                                        placeholder="Unique ID"
                                        value={this.state.uniqueID}
                                        onChange={this.handleInputChange} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md={{ size: 10 }}>
                                    <Button type="submit" color="outline-success" size="md" style={{ float: 'right' }}>
                                        Send Request
                                    </Button>
                                </Col>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Student);
