import * as ActionTypes from '../ActionTypes';
import { baseUrl } from '../../shared/baseUrl';

export const requestAdminReg = user => ({
    type: ActionTypes.ADMIN_REGISTRATION_REQUEST,
    user
});

export const receiveAdminReg = response => ({
    type: ActionTypes.ADMIN_REGISTRATION_SUCCESS,
    payload: response
});

export const adminRegError = message => ({
    type: ActionTypes.ADMIN_REGISTRATION_FAILURE,
    message
});

export const adminRegistration = user => dispatch => {
    console.log('New Admin ', user);

    return fetch(`${baseUrl}register/admins`, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin'
    })
        .then(response => {
            if (response.ok) {
                return response;
            } else {
                const error = new Error(`Error ${response.status}: ${response.statusText}`);
                error.response = response;
                throw error;
            }
        })
        .then(response => response.json())
        .then(response => {
            alert('Your registration is successful. Sign in to the new account using username and password!');
            dispatch(receiveAdminReg(response));
        })
        .catch(error => {
            console.log('Admin Registration ', error.message);
            alert(`Your registration was unsuccessful. Error: ${error.message}`);
        });
};

export const requestUserReg = user => ({
    type: ActionTypes.USER_REGISTRATION_REQUEST,
    user
});

export const receiveUserReg = response => ({
    type: ActionTypes.USER_REGISTRATION_SUCCESS,
    payload: response
});

export const userRegError = message => ({
    type: ActionTypes.USER_REGISTRATION_FAILURE,
    message
});

export const userRegistration = user => dispatch => {
    console.log('New User ', user);

    return fetch(`${baseUrl}register/users`, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin'
    })
        .then(response => {
            if (response.ok) {
                return response;
            } else {
                const error = new Error(`Error ${response.status}: ${response.statusText}`);
                error.response = response;
                throw error;
            }
        })
        .then(response => response.json())
        .then(response => {
            alert('Your registration is successful. Sign in to the new account using username and password!');
            dispatch(receiveUserReg(response));
        })
        .catch(error => {
            console.log('User Registration ', error.message);
            alert(`Your registration was unsuccessful. Error: ${error.message}`);
        });
};
