import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Authentication } from '../services/authentication';
import { User } from '../models/user';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
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

  // On Register Submit based on the Email, Password, and Name the user enters
  public onRegisterSubmit(): void {
    this.formError = '';
    if (!this.credentials.email || !this.credentials.password || !this.credentials.name) {
      this.formError = 'All fields are required. Please Try Again';
      this.router.navigate(['/']); // Return to Register page
    } else {
      this.doRegister();
    }
  }

  private doRegister(): void {
    let newUser = {
      name: this.credentials.name,
      email: this.credentials.email
    } as User;

    // console.log('RegisterComponent::doRegister');
    // console.log('Credentials', this.credentials)

    this.authenticationService.register(newUser, this.credentials.password);

  }
}
