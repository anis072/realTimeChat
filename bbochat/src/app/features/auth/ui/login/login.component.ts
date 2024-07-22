import { Component, effect } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../data-access/repositories/auth.service';
import { AuthFacade } from '../../data-access/+state/auth.facade';
import { input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule,NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;

  errorMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authFacade: AuthFacade,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required],
    });
    effect(() => {
      const error = this.authFacade.error();
      if (error) {
        this.errorMessage.set(error);
      } else {
        this.errorMessage.set(null);
      }

      const token = this.authFacade.token();
      if (token) {
        this.router.navigate(['/']);
      }
    },{ allowSignalWrites: true });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authFacade.login(email, password);
    }
  }
}
