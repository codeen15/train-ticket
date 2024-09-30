import { Component } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { Step } from '../../../enums/step';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {


  paymentForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1),]),
    email: new FormControl('', [Validators.required, Validators.minLength(1), Validators.email]),
  });

  constructor(private bookingService: BookingService) { }

  cancel(): void {
    this.bookingService.reset();
    this.bookingService.step$.next(Step.SelectDepartureTrain);
  }

  next(): void {
    if (this.paymentForm.valid) {
      const name: string = this.paymentForm.controls.name.value!;
      const email: string = this.paymentForm.controls.email.value!;

      this.bookingService.makePayment(name, email, this.bookingService.bookingID!);
      this.bookingService.step$.next(Step.BookingSummary);
    }
  }
}
