import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { TrainTrip } from '../../interfaces/train-trip.interface';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  API_HOST: string = environment.API_HOST;

  trips: TrainTrip[] = [];

  constructor(private http: HttpClient) { }

  async getTrips(): Promise<TrainTrip[]> {
    return firstValueFrom(
      this.http.get<TrainTrip[]>(
        this.API_HOST + '/api/booking/admin/trips',
      )
    )
  }

  async addTrip(
    origin: number,
    destination: number,
    dateTime: Date,
    price: number
  ): Promise<TrainTrip> {
    return firstValueFrom(
      this.http.post<TrainTrip>(
        this.API_HOST + '/api/booking/admin/trips',
        {
          origin_id: origin,
          destination_id: destination,
          date_time: dateTime,
          price: price
        }
      )
    )
  }

  async deleteTrip(id: number): Promise<void> {
    return firstValueFrom(
      this.http.delete<void>(
        this.API_HOST + `/api/booking/admin/trips/${id}`,
      )
    )
  }
}
