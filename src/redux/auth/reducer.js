import actions from './actions';

const initState = { 
  idToken: null,
  idProfile: null,
  wait: false 
 };

export default function authReducer(state = initState, action) {
  switch (action.type) {
    case actions.LOGIN_SUCCESS:
      return { ...state, idToken: action.token };
    case actions.AUTHORIZATION_CHECK_SUCCESS:
      return {
        ...state,
         idToken: action.token,
         idProfile: action.profile
      };
    case actions.PROFILE_SUCCESS:      
      return {...state, profile: action.profile}
    case actions.LOGOUT:
      return initState;
    case actions.WAIT:
			return {
        ...state,
				wait: action.status
      }
    default:
      return state;
  }
}
