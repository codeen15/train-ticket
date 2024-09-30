import { Component } from '@angular/core';
import { BookingSummary } from '../../../interfaces/booking-summary.interface';
import { BookingService } from '../../services/booking.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent {

  bookings: BookingSummary[] = [];

  constructor(private bookingService: BookingService) {
    this.getAllBookings();
  }

  getAllBookings(): void {
    this.bookingService.getAllBookingSummaries().then((bookings: BookingSummary[]) => {
      this.bookings = bookings;
    });
  }
}
