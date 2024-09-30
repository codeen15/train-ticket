import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TrainInfoComponent } from '../components/train-info/train-info.component';
import { BookingService } from '../components/services/booking.service';
import { SearchInfo } from '../interfaces/search-info.interface';
import { Subscription } from 'rxjs';
import { StationLocation } from '../interfaces/location.interface';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, ReactiveFormsModule, TrainInfoComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {

  locations: StationLocation[] = [];

  departureMinDate!: string;
  departureMaxDate!: string;

  returnMinDate!: string;
  returnMaxDate!: string;

  searchInfo?: SearchInfo;
  searchInfo$?: Subscription;

  constructor(private bookingService: BookingService) {
    this.setupDepartureDate();

  }

  ngOnInit(): void {
    this.searchInfo$ = this.bookingService.searchInfo$.subscribe((searchInfo) => {
      this.searchInfo = searchInfo;
    });


    this.bookingService.getLocations().then((locations: StationLocation[]) => {
      this.locations = locations;
    });
  }


  noOfPaxList: number[] = [1, 2, 3, 4, 5];

  searchForm = new FormGroup({
    origin: new FormControl<number>(0, [
      Validators.required,
      Validators.min(1)
    ]),
    destination: new FormControl<number>(0, [
      Validators.required,
      Validators.min(1)
    ]),
    departure_date: new FormControl(this.formatDate(new Date()), [
      Validators.required,
    ]),
    return_date: new FormControl(''),
    pax: new FormControl<number>(this.noOfPaxList[0], [
      Validators.required,
    ]),
  });

  setupDepartureDate(): void {
    this.departureMinDate = this.formatDate(new Date());
    this.departureMaxDate = this.formatDate(new Date(new Date().setMonth(new Date().getMonth() + 1)));

    this.returnMinDate = this.formatDate(new Date(new Date().setDate(new Date().getDate() + 1)));
    this.returnMaxDate = this.formatDate(new Date(new Date().setMonth(new Date().getMonth() + 2)));
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = d.getDate().toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`; // Format: YYYY-MM-DD
  }

  search() {
    if (this.searchForm.valid) {
      const origin: number = this.searchForm.controls.origin.value!;
      const destination = this.searchForm.controls.destination.value!
      const departureDate = new Date(this.searchForm.controls.departure_date.value!);
      const returnDate = !!(this.searchForm.controls.return_date.value) ? new Date(this.searchForm.controls.return_date.value!) : undefined;
      const noOfPax: number = this.searchForm.controls.pax.value!;

      const newSearchInfo: SearchInfo = {
        origin: this.locations.find((loc) => loc.id == origin)!,
        destination: this.locations.find((loc) => loc.id == destination)!,
        departureDate: departureDate,
        returnDate: returnDate,
        noOfPax: noOfPax
      };

      this.bookingService.reset();
      this.bookingService.searchInfo$.next(newSearchInfo);
    }
  }

  ngOnDestroy(): void {
    this.searchInfo$?.unsubscribe();
  }

}
