import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TripCard } from '../trip-card/trip-card';
import { Trip } from '../models/trip';
import { TripData } from '../services/trip-data';
import { Authentication } from '../services/authentication';

@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [CommonModule, TripCard],
  templateUrl: './trip-listing.html',
  styleUrl: './trip-listing.css',
  providers: [TripData]
})
export class TripListing implements OnInit {
  trips!: Trip[];
  message: string = '';
  //public loggedIn$;

  constructor(
    private tripData: TripData,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authenticationService: Authentication
    ) {
    //console.log('Trip Listing Constructor');
    //this.loggedIn$ = this.authenticationService.loggedIn$;
  };

  public addTrip(): void {
    this.router.navigate(['add-trip']);
  }

  // Get Trips method to list all trips on the adminatration page
  private getStuff(): void {
    this.tripData.getTrips()
      .subscribe({
        next: (value: any) => {
          this.trips = value;
          this.cdr.markForCheck();
          //console.log("Value", value);
          if (value.length > 0) {
            this.message = 'There are ' + value.length + ' trips available.';
          } else {
            this.message = 'There were no trips retrived from the database';
          }
          //console.log(this.message);
        },
        error: (error: any) => {
          console.error('Error: ' + error);
        }
      })
  }

  ngOnInit(): void {
    //console.log('ngOnInit');
    this.getStuff();
  }

  public isLoggedIn() {
    return this.authenticationService.isLoggedIn();
  }
}
