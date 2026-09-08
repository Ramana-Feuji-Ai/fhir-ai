import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'fhi-login-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <section class="authPage">
      <div class="wrap authWrap">
        <div class="authCard">
          <div class="authBrand">
            <span class="logo">fhi</span>
            <div>
              <b>FHIR Learning</b>
              <small>Sign in to continue</small>
            </div>
          </div>

          <div class="authTabs">
            <button type="button" [class.on]="mode() === 'login'" (click)="mode.set('login')">Sign in</button>
            <button type="button" [class.on]="mode() === 'register'" (click)="mode.set('register')">Register</button>
          </div>

          <form (ngSubmit)="submit()" class="authForm">
            @if (mode() === 'register') {
              <label>
                <span>Display name</span>
                <input name="displayName" [(ngModel)]="displayName" required minlength="2" autocomplete="name" />
              </label>
            }
            <label>
              <span>Email</span>
              <input name="email" type="email" [(ngModel)]="email" required autocomplete="username" />
            </label>
            <label>
              <span>Password</span>
              <input name="password" type="password" [(ngModel)]="password" required minlength="8" autocomplete="current-password" />
            </label>

            @if (error()) {
              <p class="authError">{{ error() }}</p>
            }

            <button class="btn" type="submit" [disabled]="busy()">
              {{ busy() ? 'Please wait…' : mode() === 'login' ? 'Sign in' : 'Create account' }}
            </button>
          </form>

          <p class="authHint muted">
            Demo account: <code>mr&#64;fhi.local</code> / <code>ChangeMe123!</code>
          </p>
          <p class="authHint muted"><a routerLink="/">Back to home</a> (requires login)</p>
        </div>
      </div>
    </section>
  `,
  styles: `
    .authPage {
      min-height: calc(100vh - 120px);
      display: grid;
      align-items: center;
      padding: 48px 0;
      background:
        radial-gradient(900px 420px at 10% 0%, rgba(232,241,248,.9) 0%, transparent 55%),
        radial-gradient(700px 360px at 100% 10%, rgba(243,237,230,.95) 0%, transparent 50%),
        linear-gradient(180deg, #0B1C2C 0%, #14304A 42%, #F7F9FB 42%);
    }
    .authWrap { max-width: 480px; }
    .authCard {
      background: rgba(255,255,255,.62);
      border: 1px solid rgba(255,255,255,.55);
      border-radius: 22px;
      padding: 28px;
      box-shadow: 0 24px 60px rgba(11,28,44,.22);
      backdrop-filter: blur(22px);
    }
    .authBrand {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 22px;
    }
    .authBrand b { display: block; font-size: 16px; }
    .authBrand small { color: var(--n5); font-size: 12px; }
    .authTabs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 18px;
    }
    .authTabs button {
      border: 1px solid var(--g3);
      background: var(--n0);
      border-radius: 10px;
      min-height: 40px;
      font-weight: 600;
      color: var(--n6);
    }
    .authTabs button.on {
      background: var(--n8);
      border-color: var(--n8);
      color: #fff;
    }
    .authForm {
      display: grid;
      gap: 14px;
    }
    .authForm label {
      display: grid;
      gap: 6px;
      font-size: 13px;
      font-weight: 600;
      color: var(--n7);
    }
    .authForm input {
      width: 100%;
      padding: 0 12px;
    }
    .authError {
      margin: 0;
      color: #8A3A3A;
      background: #F8EAEA;
      border: 1px solid #E8C8C8;
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 13px;
    }
    .authHint {
      margin: 16px 0 0;
      font-size: 12px;
    }
    .authHint code {
      background: var(--n0);
      padding: 1px 6px;
      border-radius: 4px;
    }
    .authHint a { color: var(--b6); }
  `,
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly mode = signal<'login' | 'register'>('login');
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);

  email = 'mr@fhi.local';
  password = 'ChangeMe123!';
  displayName = '';

  submit(): void {
    this.busy.set(true);
    this.error.set(null);
    const req$ =
      this.mode() === 'login'
        ? this.auth.login(this.email, this.password)
        : this.auth.register(this.email, this.password, this.displayName || this.email.split('@')[0]);

    req$
      .pipe(switchMap(() => this.auth.me()))
      .subscribe({
        next: () => {
          this.busy.set(false);
          void this.router.navigateByUrl('/', { replaceUrl: true });
        },
        error: (err) => {
          this.busy.set(false);
          // Login may have succeeded but token rejected — clear partial session
          if (this.auth.token()) {
            this.auth.logout(false);
          }
          const msg =
            err?.error?.message ||
            err?.error?.detail ||
            err?.error?.error ||
            err?.message ||
            (err?.status === 401 ? 'Invalid email or password' : null) ||
            (err?.status === 409 ? 'Email already registered' : null) ||
            'Sign-in failed. Is the API running?';
          this.error.set(String(msg));
        },
      });
  }
}
