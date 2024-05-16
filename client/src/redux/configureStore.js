import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { Tests, Test } from './reducers/testReducer';
import { Auth } from './reducers/authReducer';
import { Groups } from './reducers/groupsReducer';

const rootReducer = combineReducers({
    tests: Tests,
    auth: Auth,
    test: Test,
    groups: Groups
});

const middleware = [thunk, logger]; // Add more middleware as needed

const configureStore = () => {
    return createStore(rootReducer, applyMiddleware(...middleware));
};

export default configureStore;
