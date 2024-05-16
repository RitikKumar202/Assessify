import * as ActionTypes from '../ActionTypes';
import { baseUrl } from '../../shared/baseUrl';

export const groupsLoading = () => ({
    type: ActionTypes.GROUPS_LOADING
});

export const groupsFailed = (errmess) => ({
    type: ActionTypes.GROUPS_FAILED,
    payload: errmess
});

export const addGroups = (groups) => ({
    type: ActionTypes.ADD_GROUPS,
    payload: groups
});

export const createGroup = (group) => (dispatch) => {
    const bearer = 'Bearer ' + localStorage.getItem('token');

    return fetch(baseUrl + 'groups', {
        method: "POST",
        body: JSON.stringify(group),
        headers: {
            "Content-Type": "application/json",
            'Authorization': bearer
        },
        credentials: "same-origin"
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                throw error;
            }
        })
        .then(groups => {
            console.log('Group Created', groups);
            dispatch(addGroups(groups));
        })
        .catch(error => dispatch(groupsFailed(error.message)));
};

export const deleteGroup = (groupId) => (dispatch) => {
    const bearer = 'Bearer ' + localStorage.getItem('token');

    return fetch(baseUrl + 'groups/' + groupId, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            'Authorization': bearer
        },
        credentials: "same-origin"
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                throw error;
            }
        })
        .then(groups => {
            console.log('Group Deleted', groups);
            dispatch(addGroups(groups));
        })
        .catch(error => dispatch(groupsFailed(error.message)));
};

export const fetchGroups = (usertype) => (dispatch) => {
    dispatch(groupsLoading(true));

    const bearer = 'Bearer ' + localStorage.getItem('token');
    const fetchgroup = usertype === 'admins' ? 'groups/admingroups' : 'groups/usergroups';

    return fetch(baseUrl + fetchgroup, {
        headers: {
            'Authorization': bearer
        },
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                throw error;
            }
        })
        .then(groups => dispatch(addGroups(groups)))
        .catch(error => dispatch(groupsFailed(error.message)));
};

export const acceptMember = (groupId, request) => async (dispatch) => {
    const bearer = 'Bearer ' + localStorage.getItem('token');

    try {
        const response = await fetch(`${baseUrl}groups/${groupId}/member`, {
            method: "PUT",
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json",
                'Authorization': bearer
            },
            credentials: "same-origin"
        });

        if (!response.ok) {
            const error = new Error(`Error ${response.status}: ${response.statusText}`);
            error.response = response;
            throw error;
        }

        const groups = await response.json();
        console.log('Group Updated', groups);
        dispatch(addGroups(groups));
    } catch (error) {
        dispatch(groupsFailed(error.message));
    }
};

export const removeReq = (groupId, reqId) => async (dispatch) => {
    const bearer = 'Bearer ' + localStorage.getItem('token');
    const request = {
        groupId: groupId,
        requestId: reqId
    };

    try {
        const response = await fetch(`${baseUrl}groups/${groupId}/removereq`, {
            method: "DELETE",
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json",
                'Authorization': bearer
            },
            credentials: "same-origin"
        });

        if (!response.ok) {
            const error = new Error(`Error ${response.status}: ${response.statusText}`);
            error.response = response;
            throw error;
        }

        const groups = await response.json();
        console.log('Group Updated', groups);
        dispatch(addGroups(groups));
    } catch (error) {
        dispatch(groupsFailed(error.message));
    }
};

export const removeMem = (groupId, member) => async (dispatch) => {
    const bearer = 'Bearer ' + localStorage.getItem('token');
    const request = {
        groupId: groupId,
        memberId: member._id,
        name: member.name,
        uniqueID: member.uniqueID,
        userID: member.userID
    };

    try {
        const response = await fetch(`${baseUrl}groups/${groupId}/member`, {
            method: "DELETE",
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json",
                'Authorization': bearer
            },
            credentials: "same-origin"
        });

        if (!response.ok) {
            const error = new Error(`Error ${response.status}: ${response.statusText}`);
            error.response = response;
            throw error;
        }

        const group = await response.json();
        console.log('Group Updated', group);
        return group;
    } catch (error) {
        dispatch(groupsFailed(error.message));
    }
};

export const joinGroup = (groupId, request) => async (dispatch) => {
    const bearer = 'Bearer ' + localStorage.getItem('token');

    try {
        const response = await fetch(`${baseUrl}groups/${groupId}/member`, {
            method: "POST",
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json",
                'Authorization': bearer
            },
            credentials: "same-origin"
        });

        if (!response.ok) {
            const error = new Error(`Error ${response.status}: ${response.statusText}`);
            error.response = response;
            throw error;
        }

        const groups = await response.json();
        console.log('Group Updated', groups);

        if (groups.warningMssg) {
            alert("Cannot make duplicate request. You are already a member...");
            // Redirect('/student')
        } else {
            dispatch(addGroups(groups));
        }
    } catch (error) {
        dispatch(groupsFailed(error.message));
    }
};

export const createTest = (groupId, test) => async (dispatch) => {
    const bearer = 'Bearer ' + localStorage.getItem('token');

    try {
        const response = await fetch(`${baseUrl}groups/${groupId}/test`, {
            method: "POST",
            body: JSON.stringify(test),
            headers: {
                "Content-Type": "application/json",
                'Authorization': bearer
            },
            credentials: "same-origin"
        });

        if (!response.ok) {
            const error = new Error(`Error ${response.status}: ${response.statusText}`);
            error.response = response;
            throw error;
        }

        const groups = await response.json();
        console.log('Test Updated in Group', groups);
        dispatch(addGroups(groups));
    } catch (error) {
        dispatch(groupsFailed(error.message));
    }
};

