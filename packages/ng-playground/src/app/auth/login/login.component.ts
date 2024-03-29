import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { AuthService, Creds } from '../state/auth.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  login: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.login = this.fb.group({
      email: this.fb.control(''),
      password: this.fb.control('')
    });
  }

  submit() {
    this.authService.login(this.login.value as Creds).subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
