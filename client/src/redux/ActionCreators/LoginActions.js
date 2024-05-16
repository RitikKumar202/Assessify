import * as ActionTypes from '../ActionTypes';
import { baseUrl } from '../../shared/baseUrl';

export const requestLogin = (creds) => ({
    type: ActionTypes.LOGIN_REQUEST,
    creds
});

export const receiveLogin = (response, access) => {
    console.log(response, access);
    return {
        type: ActionTypes.LOGIN_SUCCESS,
        payload: response,
        access
    };
};

export const loginError = (err) => ({
    type: ActionTypes.LOGIN_FAILURE,
    err
});

export const loginUser = (creds) => (dispatch) => {
    const access = creds.userType === 'admins' ? true : false;
    dispatch(requestLogin(creds));
    const type = access ? '/admin' : '/user';
    return fetch(baseUrl + 'login' + type, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(creds)
    })
        .then(response => {
            if (response.ok) {
                return response;
            } else {
                const error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        }, error => { throw error; })
        .then(response => response.json())
        .then(response => {
            if (response.success) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                localStorage.setItem('userId', response.user._id);
                localStorage.setItem('isAdmin', access);
                dispatch(receiveLogin(response, access));
            } else {
                throw response.error;
            }
        })
        .catch(error => dispatch(loginError(error)));
};

export const requestLogout = () => ({
    type: ActionTypes.LOGOUT_REQUEST
});

export const receiveLogout = () => ({
    type: ActionTypes.LOGOUT_SUCCESS
});

export const logoutUser = () => (dispatch) => {
    dispatch(requestLogout());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    dispatch(receiveLogout());
};
