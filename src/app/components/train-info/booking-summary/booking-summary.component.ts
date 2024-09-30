import { Component } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { SearchInfo } from '../../../interfaces/search-info.interface';
import { CommonModule } from '@angular/common';
import { BookingSummary } from '../../../interfaces/booking-summary.interface';

@Component({
  selector: 'app-booking-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-summary.component.html',
  styleUrl: './booking-summary.component.css'
})
export class BookingSummaryComponent {
  searchInfo?: SearchInfo;
  summary?: BookingSummary;

  constructor(public bookingService: BookingService) {
    this.bookingService.searchInfo$.subscribe((searchInfo: SearchInfo | undefined) => {
      if (searchInfo) {
        this.searchInfo = searchInfo;

        this.bookingService.getBookingSummary(
          this.bookingService.bookingID!
        ).then((summary: BookingSummary | undefined) => {
          this.summary = summary;
        });
      }
    });
  }

  calculateTotal(): number {
    const departureTotalPrice: number = (this.summary?.departure_trip.price ?? 0) * (this.summary?.departure_seats.length ?? 0);
    const returnTotalPrice: number = (this.summary?.return_trip?.price ?? 0) * (this.summary?.return_seats.length ?? 0);

    return departureTotalPrice + returnTotalPrice;
  }
}
