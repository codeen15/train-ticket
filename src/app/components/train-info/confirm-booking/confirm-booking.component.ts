import { Component } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { Step } from '../../../enums/step';
import { SearchInfo } from '../../../interfaces/search-info.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-booking.component.html',
  styleUrl: './confirm-booking.component.css'
})
export class ConfirmBookingComponent {

  searchInfo?: SearchInfo;

  constructor(public bookingService: BookingService) {
    this.bookingService.searchInfo$.subscribe((searchInfo: SearchInfo | undefined) => {
      if (searchInfo) {
        this.searchInfo = searchInfo;
      }
    });
  }

  calculateTotal(): number {
    const departureTotalPrice: number = (this.bookingService.selectedDepartureTrip?.price ?? 0) * this.bookingService.selectedDepartureSeats.length;
    const returnTotalPrice: number = (this.bookingService.selectedReturnTrip?.price ?? 0) * this.bookingService.selectedReturnSeats.length;

    return departureTotalPrice + returnTotalPrice;
  }

  back(): void {
    if (this.searchInfo?.returnDate) {
      this.bookingService.step$.next(Step.SelectReturnSeats);
    } else {
      this.bookingService.step$.next(Step.SelectDepartureSeats);
    }
  }

  async next(): Promise<void> {
    await this.bookingService.confirmBooking(
      this.bookingService.selectedDepartureTrip!.id,
      this.bookingService.selectedDepartureSeats,
      this.bookingService.selectedReturnTrip?.id,
      this.bookingService.selectedReturnSeats,
    );
    this.bookingService.step$.next(Step.ConfirmPayment);
  }
}
