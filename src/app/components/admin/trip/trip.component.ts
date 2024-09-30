import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TrainTrip } from '../../../interfaces/train-trip.interface';
import { TripService } from '../../services/trip.service';
import { CommonModule, formatDate } from '@angular/common';
import { StationLocation } from '../../../interfaces/location.interface';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './trip.component.html',
  styleUrl: './trip.component.css'
})
export class TripComponent implements OnInit {

  locations: StationLocation[] = [];

  showAddModal: boolean = false;
  trips: TrainTrip[] = [];

  showDeleteModal: boolean = false;
  currentDeleteTripId?: number;

  addForm = new FormGroup({
    origin: new FormControl<number>(0, [
      Validators.required,
      Validators.min(1)
    ]),
    destination: new FormControl<number>(0, [
      Validators.required,
      Validators.min(1)
    ]),
    date: new FormControl('', [
      Validators.required,
    ]),
    time: new FormControl('', [
      Validators.required,
    ]),
    price: new FormControl<number>(1)
  });

  editForm = new FormGroup({
    origin: new FormControl<number>(0, [
      Validators.required,
      Validators.min(1)
    ]),
    destination: new FormControl<number>(0, [
      Validators.required,
      Validators.min(1)
    ]),
    date: new FormControl('', [
      Validators.required,
    ]),
    time: new FormControl('', [
      Validators.required,
    ]),
    price: new FormControl<number>(1)
  });

  constructor(private tripService: TripService, private bookingService: BookingService) {
    this.getTrips();
  }
  ngOnInit(): void {
    this.bookingService.getLocations().then((locations: StationLocation[]) => {
      this.locations = locations;
    });
  }

  getTrips(): void {
    this.tripService.getTrips().then((trips: TrainTrip[]) => {
      this.trips = trips;
    });
  }

  addTrip(): void {
    if (this.addForm.valid) {
      const dateString: string = this.addForm.controls.date.value!;
      const timeString: string = this.convertTo24HourFormat(this.addForm.controls.time.value!);

      this.tripService.addTrip(
        this.addForm.controls.origin.value!,
        this.addForm.controls.destination.value!,
        new Date(`${dateString}T${timeString}:00`),
        this.addForm.controls.price.value!,
      ).then((trip: TrainTrip) => {
        this.trips.push(trip);
      });

      this.showAddModal = false;
    }
  }

  deleteTrip(): void {
    if (this.currentDeleteTripId) {
      this.tripService.deleteTrip(
        this.currentDeleteTripId
      ).then(() => {
        this.trips = this.trips.filter((tr) => tr.id != this.currentDeleteTripId);
      });

      this.showDeleteModal = false;
    }
  }

  deleteMode(trip: TrainTrip): void {
    this.currentDeleteTripId = trip.id;
    this.showDeleteModal = true;
  }

  convertTo24HourFormat(time: string): string {
    if (!time) return '';

    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);

    return `${hour < 12 ? (hour + 12) % 24 : hour}:${minutes}`;
  }
}
