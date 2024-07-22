import { Injectable, OnDestroy } from "@angular/core";
import { Store } from "@ngrx/store";
import * as AuthActions from './auth.actions';
import * as fromAuth from './auth.selectors';
import { AuthService } from "../repositories/auth.service";
import { tap, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthFacade implements OnDestroy {
  readonly token = this.store.selectSignal(fromAuth.selectAuthToken);
  readonly error = this.store.selectSignal(fromAuth.selectAuthError);
  readonly user = this.store.selectSignal(fromAuth.selectUser);

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private authService: AuthService
  ) {}

  login(email: string, password: string): void {
    this.authService.login(email, password).pipe(
      tap(
        response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.store.dispatch(AuthActions.loginSuccess({ token: response.token, user: response.user }));
        },
        error => {
          this.store.dispatch(AuthActions.loginFailure({ error: error.error.message }));
        }
      ),
      takeUntil(this.destroy$) 
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
