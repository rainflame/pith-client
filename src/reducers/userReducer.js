import { CREATE_USER, CREATE_USER_FULFILLED } from "../actions/types";

const userReducer = (
	state = {
		id: null,
		connecting: false,
		connected: false,
	},
	action
) => {
	switch (action.type) {
		case CREATE_USER: {
			return { ...state, connecting: true };
		}
		case CREATE_USER_FULFILLED: {
			return {
				...state,
				connecting: false,
				connected: true,
				id: action.payload,
			};
		}
		default: {
			return { ...state };
		}
	}
};

export default userReducer;
