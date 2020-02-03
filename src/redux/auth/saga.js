import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import {toast} from 'react-toastify';
import { getToken, getProfile, clearToken } from '../../helpers/utility';
import actions from './actions';
import api from '../api';

export function* loginRequest() {
  yield takeEvery('LOGIN_REQUEST', function*(payload) {
    try {
      const loginPayload = {
        email: payload.email,
        password: payload.password
      };
      const res = yield call(api.POST, 'signin', loginPayload);
      if (res.data.success) {
				yield put({
					type: actions.WAIT,
					status: false
				}); 
        yield put({
          type: actions.LOGIN_SUCCESS,
          token: res.data.results.token,
          profile: JSON.stringify(res.data.results)
        });
      } else {
				yield put({
					type: actions.WAIT,
					status: false
				}); 
        toast.error('Email or Password is incorrect. Please input correct Email and Password... ');
      }
    } catch (err) {
			yield put({
				type: actions.WAIT,
				status: false
			}); 
      yield put({ 
        type: actions.LOGIN_ERROR 
      });
    } 
  });
}

export function* loginSuccess() {
  yield takeEvery(actions.LOGIN_SUCCESS, function*(payload) {

    yield localStorage.setItem('id_token', payload.token);
    yield localStorage.setItem('id_profile', payload.profile);
    yield put(push('/dashboard'));
  });
}

export function* loginError() {
  yield takeEvery(actions.LOGIN_ERROR, function*() {
    yield toast.error('Operation failed. Please Try again later... ');
  });
}

export function* logout() {
  yield takeEvery(actions.LOGOUT, function*() {
    clearToken();
    yield put(push('/login'));
  });
}

export function* checkAuthorization() {
  yield takeEvery(actions.CHECK_AUTHORIZATION, function*() {
    const token = getToken();
    const profile = getProfile();
    if (token) {
      yield put({
        type: actions.AUTHORIZATION_CHECK_SUCCESS,
        token,
        profile
      });
    }
  });
}

export function* fetchProfile() {
  yield takeEvery(actions.FETCH_PROFILE, function*() {
    try {
      const {data} = yield call(api.POST, 'auth/me', {})
      yield put({
        type: actions.PROFILE_SUCCESS,
        profile: data
      });
    } catch (err) {
      console.error('fetchProfile', err)
    }
  })
}

export default function* rootSaga() {
  yield all([
    fork(checkAuthorization),
    fork(loginRequest),
    fork(loginSuccess),
    fork(loginError),
    fork(logout),
    fork(fetchProfile)
  ]);
}
