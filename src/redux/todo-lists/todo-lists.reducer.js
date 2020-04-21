import { TodoListTypes } from './todo-lists.types';
import { getAllLists, getUserLists } from './todo-list.utils';

const INITIAL_STATE = {
	todoLists: []
};

const todoListReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case TodoListTypes.SET_ALL_LISTS:
			return {
				...state,
				todoLists: getAllLists()
			};

		case TodoListTypes.SET_USER_LISTS:
			console.log('STATE:', state);
			return {
				...state,
				todoLists: getUserLists(state.currentUser)
			};

		default:
			return state;
	}
};

export default todoListReducer;
