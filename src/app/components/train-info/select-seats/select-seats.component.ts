import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { Step } from '../../../enums/step';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchInfo } from '../../../interfaces/search-info.interface';

@Component({
  selector: 'app-select-seats',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './select-seats.component.html',
  styleUrl: './select-seats.component.css'
})
export class SelectSeatsComponent implements OnDestroy {

  currentStep: number = 0;

  isLoading = true;

  numberOfSeatPerCoach: number[] = Array(20).fill(1).map((x, i) => i + 1);

  private _selectedSeat: Set<string> = new Set<string>();

  bookedSeats: string[] = [];

  searchInfo?: SearchInfo;

  numberOfPax: number = 0;

  private checkBookedSeats: any;

  constructor(private bookingService: BookingService) {
    this.bookingService.searchInfo$.subscribe((searchInfo: SearchInfo | undefined) => {
      if (searchInfo) {
        this.searchInfo = searchInfo;
        this.numberOfPax = searchInfo.noOfPax as number;
        this._selectedSeat.clear();

        this.currentStep = this.bookingService.step$.value;

        clearInterval(this.checkBookedSeats);
        this.getBookedSeats();
        this.checkBookedSeats = setInterval(() => {
          this.getBookedSeats();
        }, 3000)
      }
    });
  }

  getBookedSeats(): void {
    const tripID: number = this.currentStep == 4 ? this.bookingService.selectedReturnTrip!.id : this.bookingService.selectedDepartureTrip!.id;

    this.bookingService.getTrainTripBookedSeats(tripID).then((bookedSeats: string[]) => {
      this.bookedSeats = bookedSeats;
      this.isLoading = false;
    });
  }

  selectSeat(seat: string) {
    if (this.isSeatSelected(seat)) {
      this._selectedSeat.delete(seat);
    } else if (this.isAllPaxSelected() || this.isSeatAlreadyBooked(seat)) {
      return;
    } else {
      this._selectedSeat.add(seat);
    }
  }

  get selectedSeat(): string[] {
    return Array.from(this._selectedSeat);
  }

  isSeatSelected(seat: string): boolean {
    return this._selectedSeat.has(seat);
  }

  isAllPaxSelected(): boolean {
    return this.selectedSeat.length == this.numberOfPax;
  }

  isSeatAlreadyBooked(seat: string): boolean {
    return !!(this.bookedSeats.find((bookedSeat: string) => bookedSeat == seat));
  }

  getSeatClass(seat: string): string {
    if (this.isSeatSelected(seat)) {
      return 'bg-blue-100 text-blue-600 cursor-pointer';
    } else if (this.isAllPaxSelected() || this.isSeatAlreadyBooked(seat)) {
      return 'bg-gray-300 cursor-not-allowed'
    } else {
      return 'cursor-pointer';
    }
  }

  back(): void {
    this._selectedSeat.clear();
    if (this.currentStep == 4) {
      this.bookingService.step$.next(Step.SelectReturnTrain)
    } else {
      this.bookingService.step$.next(Step.SelectDepartureTrain);

    }
  }

  next(): void {
    if (this.searchInfo?.returnDate && this.currentStep != 4) {
      this.bookingService.selectedDepartureSeats = this.selectedSeat;
      this.bookingService.step$.next(Step.SelectReturnTrain);
    } else {
      if (this.currentStep == 4) {
        this.bookingService.selectedReturnSeats = this.selectedSeat;
      } else {
        this.bookingService.selectedDepartureSeats = this.selectedSeat;
      }
      this.bookingService.step$.next(Step.ConfirmBooking);
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.checkBookedSeats);
  }
}
