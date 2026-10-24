import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Trip } from '../models/trip';
import { Authentication } from '../services/authentication';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.css',
})
export class TripCard implements OnInit {
  //public loggedIn$;

  @Input('trip') trip: any;

  constructor(
    private router: Router, 
    private authenticationService: Authentication
) {
  //this.loggedIn$ = this.authenticationService.loggedIn$;
}

  ngOnInit(): void {
    console.log("Inside Trip Card On INIT")
  }

  public editTrip(trip: Trip) {
    localStorage.removeItem('tripCode');
    localStorage.setItem('tripCode', trip.code);
    this.router.navigate(['edit-trip']);
  }

  public isLoggedIn() {
    return this.authenticationService.isLoggedIn();
  }
}
