import React, { Component } from 'react';
import { TabContent, TabPane, Row, Col, Table, Label, Form, FormGroup, Input, Modal, ModalHeader, ModalBody, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { createGroup, acceptMember, removeReq, removeMem, joinGroup, createTest, fetchGroups } from '../redux/ActionCreators/GroupActions.js';
import { Groups } from '../utils/ImageUtils.js';
import { toast } from 'react-toastify';

const mapStateToProps = state => ({
    auth: state.auth,
    groups: state.groups,
});

const mapDispatchToProps = (dispatch) => ({
    createGroup: (group) => dispatch(createGroup(group)),
    acceptMember: (groupId, request) => dispatch(acceptMember(groupId, request)),
    removeReq: (groupId, requestId) => dispatch(removeReq(groupId, requestId)),
    removeMem: (groupId, memberId) => dispatch(removeMem(groupId, memberId)),
    joinGroup: (groupId, request) => dispatch(joinGroup(groupId, request)),
    createTest: (groupId, test) => dispatch(createTest(groupId, test)),
    fetchGroups: (type) => dispatch(fetchGroups(type))
});

function GroupRows({ group }) {
    return (
        <tr key={group._id} className='group-data-row'>
            <td><img src={Groups} alt="Groups" />{group.name}</td>
            <td>{group.members.length}</td>
            <td>{group.tests.length}</td>
            <td><Link to={`/createtest/${group._id}`}><Button outline color="info" size="sm">Create</Button></Link></td>
            <td><Link to={`/admingroups/${group._id}`} ><Button outline color="primary" size="sm">Details</Button></Link></td>
        </tr>
    );
}

class Admin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
            group_name: '',
            activeTab: '1',
            private: false,
        };

        this.toggleModal = this.toggleModal.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleCreateGroup = this.handleCreateGroup.bind(this);
        this.toggleTab = this.toggleTab.bind(this);
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

    handleCreateGroup(event) {
        this.toggleModal();
        toast.success(this.state.group_name + ' group created successfully');
        var group = {
            name: this.state.group_name,
            isPrivate: this.state.private
        };
        this.props.createGroup(group);
        event.preventDefault();
    }

    componentDidMount() {
        this.props.fetchGroups('admins');
    }

    render() {
        const groups = this.props.groups.groups;
        console.log(groups);
        let grouplist;

        if (groups && groups.length > 0) {
            grouplist = groups.map((g) => {
                return (
                    <GroupRows key={g._id} group={g} />
                );
            });
        } else {
            grouplist = (
                <tr>
                    <td colSpan="5">There are no Groups</td>
                </tr>
            );
        }

        return (
            <div className="container mt-5">
                <div className="table-responsive" activeTab={this.state.activeTab}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Group Name</th>
                                <th>Total Members</th>
                                <th>Total Tests</th>
                                <th>Create New Test</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grouplist}
                        </tbody>
                    </table>
                </div>
                <Button className='create-group-btn' onClick={this.toggleModal} type="submit" color="primary">Create Group</Button>

                {/* Create Group Form */}

                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}><strong>New Group</strong></ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.handleCreateGroup}>
                            <FormGroup row>
                                <Col md={10}>
                                    <Input type="text" id="group_name" name="group_name"
                                        placeholder="Group Name"
                                        value={this.state.group_name}
                                        onChange={this.handleInputChange} />
                                </Col>
                            </FormGroup>

                            <FormGroup check>
                                <Label check>
                                    <Input type="checkbox"
                                        name="private"
                                        checked={this.state.private}
                                        onChange={this.handleInputChange} /> {' '}
                                    <strong> Create a Private Group</strong>
                                    <p>Private group enables users with group ID Code to send Join Request, Public group (default) enable users to directly join with group ID code.</p>
                                </Label>
                            </FormGroup>

                            <FormGroup row>
                                <Col md={{ size: 10 }}>
                                    <Button type="submit" color="success" size="md" style={{ float: 'right' }}>
                                        Create
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

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
