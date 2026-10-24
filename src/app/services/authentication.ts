import { Inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { TripData } from './trip-data';

@Injectable({ providedIn: 'root' })
export class Authentication {
    // variable to handle Auth Responses
    authResp: AuthResponse = new AuthResponse();

    // Setup storage and service access
    constructor(
        @Inject(BROWSER_STORAGE) private storage: Storage,
        private tripData: TripData
    ) {}

    // Get token from Storage Provider
    public getToken(): string {
        let out: any;
        out = this.storage.getItem('travlr-token');

        // Return a string even without token
        if (!out) {
            return '';
        }
        return out;
    }

    // Save token to Storage Provider
    public saveToken(token: string): void {
        this.storage.setItem('travlr-token', token);
    }

    // Logout of app and remove JWT From storage
    public logout(): void {
        this.storage.removeItem('travlr-token');
    }

    // Determines if user is logged in and the token is still valid
    public isLoggedIn(): boolean {
        const token: string = this.getToken();
        //console.log("TOKEN", token)

        try {
            const parts = token.split('.');

            if (parts.length !== 3 || !parts[1]) {
                return false;
            }

            // Convert Base64URL to standard Base64
            const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');

            // Add Padding to the token
            const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');

            // parse the padded Token into the payload
            const payload = JSON.parse(atob(padded));

            // JWT Expiration
            return payload.exp > Date.now() / 1000;
        } catch (error) {
            //console.log("Invalid JWT Token: ", error);
            return false;
        }
    }

    // retrieve current user
    // should only be called after calling method has checked to make sure the user is logged in
    public getCurrentUser(): User {
        const token: string = this.getToken();
        const { email, name } = JSON.parse(atob(token.split('.')[1]));
        return { email, name } as User;
    }

    // Login User Method to leverage the same function in the trip data service
    public login(user: User, passwd: string): Observable<AuthResponse> {
        return this.tripData.login(user, passwd).pipe(
            tap((value: AuthResponse) => {
                if (value?.token) {
                    this.authResp = value;
                    this.saveToken(value.token);
                }
            })
        );
    }

    // Register User Method to leverage the same function in the trip data service
    public register(user: User, passwd: string): void {
        this.tripData.register(user, passwd)
            .subscribe({
                next: (value: any) => {
                    if (value) {
                        //console.log("Register Value: ", value);
                        this.authResp = value;
                        this.saveToken(this.authResp.token);
                    }
                },
                error: (error: any) => {
                    console.error("Error: " + error);
                }
            })
    }
}
