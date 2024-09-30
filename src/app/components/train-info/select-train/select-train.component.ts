import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { Step } from '../../../enums/step';
import { TrainTrip } from '../../../interfaces/train-trip.interface';
import { SearchInfo } from '../../../interfaces/search-info.interface';

@Component({
  selector: 'app-select-train',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-train.component.html',
  styleUrl: './select-train.component.css'
})
export class SelectTrainComponent {

  trips: TrainTrip[] = [];

  currentStep: number = 0;

  constructor(private bookingService: BookingService) {
    this.bookingService.searchInfo$.subscribe((searchInfo: SearchInfo | undefined) => {
      if (searchInfo) {
        let originID;
        let destinationID;
        let date;
        this.currentStep = this.bookingService.step$.value;


        if (this.currentStep == 3) {
          originID = searchInfo.destination.id;
          destinationID = searchInfo.origin.id;
          date = searchInfo.returnDate
        } else {
          originID = searchInfo.origin.id;
          destinationID = searchInfo.destination.id;
          date = searchInfo.departureDate
        }

        this.bookingService.getTrainTrips(
          originID,
          destinationID,
          date!
        ).then((trips: TrainTrip[]) => {
          this.trips = trips;
        });
      }
    });
  }

  selectTrain(tripID: TrainTrip) {
    let nextStep: Step;

    if (!(this.currentStep == 3)) {
      nextStep = Step.SelectDepartureSeats;
      this.bookingService.selectedDepartureTrip = tripID;
    } else {
      nextStep = Step.SelectReturnSeats;
      this.bookingService.selectedReturnTrip = tripID;
    }

    this.bookingService.step$.next(nextStep);
  }

  back(): void {
    if (this.currentStep == 3) {
      this.bookingService.step$.next(Step.SelectDepartureSeats);
    }
  }
}
