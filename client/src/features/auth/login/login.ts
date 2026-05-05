import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthStateService } from '../../../core/services/auth-state-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authState = inject(AuthStateService);
  readonly showPassword = signal(false);
  readonly isSubmitting = signal(false);
  readonly loginSuccess = signal(false);
  readonly loginError = signal<string | null>(null);

  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    if (this.isSubmitting()) return;

    this.loginError.set(null);
    this.isSubmitting.set(true);

    this.authState.login({
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!
    }).subscribe({
      next: () => {
        this.loginSuccess.set(true);

        setTimeout(() => {
          this.router.navigate(['']);
        }, 1500);

      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.loginError.set(err || 'Invalid email or password. Please try again. or your account is not active.');
      }
    });
    
  }
}
