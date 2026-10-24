import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Authentication } from '../services/authentication';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  public formError: string = '';
  submitted = false;

  credentials = {
    name: '',
    email: '',
    password: ''
  }

  constructor(
    private router: Router,
    private authenticationService: Authentication
  ) {}

  ngOnInit(): void {

  }

  public onLoginSubmit(): void {
    this.formError = '';
    if (!this.credentials.email || !this.credentials.password || !this.credentials.name) {
      this.formError = 'All fields are required. Please Try Again';
    } else {
      this.doLogin();
    }
  }

  private doLogin(): void {
    let newUser = {
      name: this.credentials.name,
      email: this.credentials.email
    } as User;

    //console.log('LoginComponent::doLogin');
    //console.log('Credentials', this.credentials)

    this.authenticationService
      .login(newUser, this.credentials.password)
      .subscribe({
        next: () => {
          if (this.authenticationService.isLoggedIn()) {
            //console.log("Login Successful");
            this.router.navigate(['/']);
          } else {
            this.formError = "Login Failed: Invalid or Expired Token";
          }
        },
        error: (error) => {
          console.error('Login Error: ', error);
          this.formError = "Login Failed. Please try again";
        }
      });
  }
}
