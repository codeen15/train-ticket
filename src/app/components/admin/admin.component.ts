import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LocationComponent } from './location/location.component';
import { TripComponent } from './trip/trip.component';
import { BookingComponent } from './booking/booking.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, LocationComponent, TripComponent, BookingComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  selectedTab: number = 0;

}
