import * as ActionTypes from './ActionTypes';

const initialState = {
    isLoading: true,
    errMess: null,
    groups: null
};

export const Groups = (state = initialState, { type, payload }) => {
    switch (type) {
        case ActionTypes.ADD_GROUPS:
            return { ...state, isLoading: false, errMess: null, groups: payload };

        case ActionTypes.GROUPS_LOADING:
            return { ...state, isLoading: true, errMess: null, groups: null };

        case ActionTypes.GROUPS_FAILED:
            return { ...state, isLoading: false, errMess: payload, groups: null };

        default:
            return state;
    }
};
