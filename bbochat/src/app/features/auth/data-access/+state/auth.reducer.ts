import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { User } from '../../models/User';
export const AUTH_FEATURE_KEY= 'auth'

export interface AuthState {
  token: string | null;
  user:User | null;
  error: any;
}

export const initialState: AuthState = {
  token: null,
  user:null,
  error: null
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.loginSuccess, (state, { token,user }) => ({
    ...state,
    user,
    token,
    error: null
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    error
  }))
);