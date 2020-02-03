const actions = {
  CHECK_AUTHORIZATION: 'CHECK_AUTHORIZATION',
  AUTHORIZATION_CHECK_SUCCESS: 'AUTHORIZATION_CHECK_SUCCESS',
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  FETCH_PROFILE: 'FETCH_PROFILE',
  PROFILE_SUCCESS: 'PROFILE_SUCCESS',
  LOGOUT: 'LOGOUT',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  WAIT: 'WAIT',
  checkAuthorization: () => ({ type: actions.CHECK_AUTHORIZATION }),
  login: (payload) => ({
    type: actions.LOGIN_REQUEST,
    email: payload.email,
    password: payload.password
  }),
  getProfile: () => ({
    type: actions.FETCH_PROFILE
  }),  
  logout: () => ({
    type: actions.LOGOUT
  }),
  waiting: (status) => ({
		type: actions.WAIT,
		status
	})
};
export default actions;
