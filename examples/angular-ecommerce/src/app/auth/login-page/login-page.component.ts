import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../state/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login-page.component.html'
})
export class LoginPageComponent {
  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  error: string | null = null;

  constructor(private authService: AuthService,
              private router: Router,
              private toastr: ToastrService) {}

  submit() {
    this.error = null;
    if ( this.loginForm.valid ) {
      this.authService.login(this.loginForm.value).subscribe({
        next: ({ name }) => {
          this.toastr.success(`Welcome ${name}`);
          this.router.navigateByUrl('/');
        },
        error: (error) => {
          this.error = error.error.errorMsg;
        }
      });
    }
  }
}
