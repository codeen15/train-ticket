import { Injectable } from '@angular/core';
import { StationLocation } from '../../interfaces/location.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  API_HOST: string = environment.API_HOST;

  locations: StationLocation[] = [];

  constructor(private http: HttpClient) { }

  async getLocations(): Promise<StationLocation[]> {
    return firstValueFrom(
      this.http.get<StationLocation[]>(
        this.API_HOST + '/api/booking/admin/locations',
      )
    )
  }

  async addLocation(name: string, shortName: string): Promise<StationLocation> {
    return firstValueFrom(
      this.http.post<StationLocation>(
        this.API_HOST + '/api/booking/admin/locations',
        {
          name: name,
          short_name: shortName
        }
      )
    )
  }

  async editLocation(id: number, name: string, shortName: string): Promise<StationLocation> {
    return firstValueFrom(
      this.http.put<StationLocation>(
        this.API_HOST + `/api/booking/admin/locations/${id}`,
        {
          name: name,
          short_name: shortName
        }
      )
    )
  }

  async deleteLocation(id: number): Promise<void> {
    return firstValueFrom(
      this.http.delete<void>(
        this.API_HOST + `/api/booking/admin/locations/${id}`,
      )
    )
  }
}
