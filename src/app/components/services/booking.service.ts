import { Injectable } from '@angular/core';
import { SearchInfo } from '../../interfaces/search-info.interface';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Step } from '../../enums/step';
import { StationLocation } from '../../interfaces/location.interface';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { formatDate } from '@angular/common';
import { TrainTrip } from '../../interfaces/train-trip.interface';
import { BookingSummary } from '../../interfaces/booking-summary.interface';


@Injectable({
  providedIn: 'root',
})
export class BookingService {

  API_HOST: string = environment.API_HOST;

  searchInfo$ = new BehaviorSubject<SearchInfo | undefined>(undefined);
  step$ = new BehaviorSubject<Step>(Step.SelectDepartureTrain);

  // Booking
  selectedDepartureTrip?: TrainTrip;
  selectedDepartureSeats: string[] = [];
  selectedReturnTrip?: TrainTrip;
  selectedReturnSeats: string[] = [];
  bookingID?: number;

  constructor(private http: HttpClient) { }

  async getLocations(): Promise<StationLocation[]> {
    try {
      return await firstValueFrom(
        this.http.get<StationLocation[]>(
          this.API_HOST + '/api/booking/locations/'
        )
      );
    } catch (e) {
      return [];
    }
  }

  async getTrainTrips(originId: number, destinationId: number, date: Date): Promise<TrainTrip[]> {
    try {
      return await firstValueFrom(
        this.http.get<TrainTrip[]>(
          this.API_HOST + '/api/booking/train/',
          {
            params: {
              origin_id: originId,
              destination_id: destinationId,
              date: formatDate(date, 'yyyy-MM-dd', 'en-US')
            }
          }
        )
      );
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async getTrainTripBookedSeats(tripID: number): Promise<string[]> {
    try {
      return await firstValueFrom(
        this.http.get<string[]>(
          this.API_HOST + `/api/booking/train/${tripID}/seats/`,
        )
      );
    } catch (e) {
      return [];
    }
  }

  async confirmBooking(
    departure_trip_id: number,
    departure_seats: string[],
    return_trip_id?: number,
    return_seats: string[] = [],
  ): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.post<any>(
          this.API_HOST + `/api/booking/confirm`,
          {
            departure_trip_id,
            departure_seats,
            return_trip_id,
            return_seats
          }
        )
      );

      this.bookingID = response.booking_id;

    } catch (e) {
      return;
    }
  }

  async makePayment(
    name: string,
    email: string,
    bookingID: number
  ): Promise<void> {
    try {
      firstValueFrom(
        this.http.post(
          this.API_HOST + `/api/booking/payment`,
          {
            name: name,
            email: email,
            booking_id: bookingID
          }
        )
      );
    } catch (e) {
      return;
    }
  }

  async getBookingSummary(bookingID: number): Promise<BookingSummary | undefined> {
    try {
      return firstValueFrom(
        this.http.get<BookingSummary>(
          this.API_HOST + `/api/booking/summary/${bookingID}`,
        )
      );
    } catch (e) {
      return;
    }
  }

  async getAllBookingSummaries(): Promise<BookingSummary[]> {
    try {
      return firstValueFrom(
        this.http.get<BookingSummary[]>(
          this.API_HOST + `/api/booking/admin/bookings`,
        )
      );
    } catch (e) {
      return [];
    }
  }

  reset(): void {
    this.searchInfo$.next(undefined);
    this.selectedDepartureTrip = undefined;
    this.selectedDepartureSeats = [];
    this.selectedReturnTrip = undefined;
    this.selectedReturnSeats = [];
    this.bookingID = undefined;
    this.step$.next(Step.SelectDepartureTrain)
  }
}
