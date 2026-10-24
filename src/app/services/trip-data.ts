import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from '../models/trip';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { BROWSER_STORAGE } from '../storage';

@Injectable({
    providedIn: 'root'
})
export class TripData {
    constructor(
        private http: HttpClient, 
        @Inject(BROWSER_STORAGE) private storage: Storage
    ) { }

    url = 'http://localhost:3000/api/trips';
    baseUrl = 'http://localhost:3000/api';


    // Call to get all trips from the API
    getTrips(): Observable<Trip[]> {
        // console.log('Inside Trip Data Service -- Get Trips');
        return this.http.get<Trip[]>(this.url);
    }

    // Call to Add Trip to the database based off the Form Data
    addTrip(formData: Trip): Observable<Trip> {
        // console.log('Inside Trip Data Service -- Add Trip');
        return this.http.post<Trip>(this.url, formData)
    }

    // Call to get the trip based off the trip code provided by the user
    getTrip(tripCode: string): Observable<Trip[]> {
        // console.log('Inside Trip Data Service -- Get Trip');
        return this.http.get<Trip[]>(this.url + '/' + tripCode)
    }

    // Call to update the trip based off the Form Data and the tripCode
    updateTrip(formData: Trip): Observable<Trip> {
        // console.log('Inside Trip Data Service -- Update Trip');
        return this.http.put<Trip>(this.url + '/' + formData.code, formData);
    }

    // Call to our /login endpoint, returns JWT
    login(user: User, passwd: string): Observable<AuthResponse> {
        // console.log('Inside TripDataService::login');
        return this.handleAuthAPICall('login', user, passwd);
    }
    // Call to our /register endpoint, creates user and returns JWT
    register(user: User, passwd: string): Observable<AuthResponse> {
        // console.log('Inside TripDataService::register');
        return this.handleAuthAPICall('register', user, passwd);
    }
    // helper call method to process both login and register methods
    handleAuthAPICall(endpoint: string, user: User, passwd: string):
        Observable<AuthResponse> {
        // console.log('Inside TripDataService::handleAuthAPICall');
        let formData = {
            name: user.name,
            email: user.email,
            password: passwd
        };
        return this.http.post<AuthResponse>(this.baseUrl + '/' + endpoint,
            formData);
    }

    // store the JWT after success
}
