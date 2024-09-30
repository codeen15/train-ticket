import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SearchInfo } from '../../interfaces/search-info.interface';
import { BookingService } from '../services/booking.service';
import { SelectTrainComponent } from './select-train/select-train.component';
import { Step } from '../../enums/step';
import { Subscription } from 'rxjs';
import { SelectSeatsComponent } from './select-seats/select-seats.component';
import { ConfirmBookingComponent } from './confirm-booking/confirm-booking.component';
import { PaymentComponent } from "./payment/payment.component";
import { StationLocation } from '../../interfaces/location.interface';
import { BookingSummaryComponent } from './booking-summary/booking-summary.component';

@Component({
  selector: 'app-train-info',
  standalone: true,
  imports: [CommonModule, SelectTrainComponent, SelectSeatsComponent, ConfirmBookingComponent, PaymentComponent, BookingSummaryComponent],
  templateUrl: './train-info.component.html',
  styleUrl: './train-info.component.css'
})
export class TrainInfoComponent implements OnInit, OnDestroy {

  @Input({ required: true })
  searchInfo!: SearchInfo;

  step: Step = Step.SelectDepartureTrain;
  step$?: Subscription;

  constructor(private bookingService: BookingService) { }

  ngOnInit(): void {
    this.step$ = this.bookingService.step$.subscribe((step: Step) => {
      this.step = step;
    });
  }

  ngOnDestroy(): void {
    this.step$?.unsubscribe();
  }

}
