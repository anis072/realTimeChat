import { createAction, props } from '@ngrx/store';
import {User} from '../../models/User';
export const login = createAction('[Auth] Login', props<{ email: string; password: string }>());
export const loginSuccess = createAction('[Auth] Login Success', props<{ token: string ,user:User }>());
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: any }>())