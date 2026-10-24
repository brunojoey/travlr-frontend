import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TripData } from '../services/trip-data';

@Component({
  selector: 'app-add-trip',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-trip.html',
  styleUrl: './add-trip.css',
})
export class AddTrip implements OnInit {
  public addForm!: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripService: TripData
  ) {}

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      _id: [],
      code: ['', Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required]
    })
  }

  // On Add Trip Submission, Add Trip based on the values added by user
  public onSubmit() {
    this.submitted = true;
    if (this.addForm.valid) {
      this.tripService.addTrip(this.addForm.value)
        .subscribe({
          next: (data: any) => {
            //console.log('Data', data);
            this.router.navigate(['']);
          },
          error: (error: any) => {
            console.error('Error: ' + error);
          }});
    }
  }
  // Get the short name of the form to access the form fields
  get f() { return this.addForm.controls; }
}
