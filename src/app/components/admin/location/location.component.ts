import { Component } from '@angular/core';
import { LocationService } from '../../services/location.service';
import { CommonModule } from '@angular/common';
import { StationLocation } from '../../../interfaces/location.interface';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './location.component.html',
  styleUrl: './location.component.css'
})
export class LocationComponent {

  showAddModal: boolean = false;
  locations: StationLocation[] = [];

  showEditModal: boolean = false;
  currentEditLocationId?: number;

  showDeleteModal: boolean = false;
  currentDeleteLocationId?: number;

  addForm = new FormGroup({
    name: new FormControl(''),
    short_name: new FormControl('')
  });

  editForm = new FormGroup({
    name: new FormControl(''),
    short_name: new FormControl('')
  });

  constructor(private locationService: LocationService) {
    this.getLocations();
  }

  getLocations(): void {
    this.locationService.getLocations().then((locations: StationLocation[]) => {
      this.locations = locations;
    });
  }

  addLocation(): void {
    this.locationService.addLocation(
      this.addForm.controls.name.value ?? '',
      this.addForm.controls.short_name.value ?? '',
    ).then((location: StationLocation) => {
      this.locations.push(location);
    });

    this.showAddModal = false;
  }

  editLocation(): void {
    if (this.editForm.valid && this.currentEditLocationId) {

      const name = this.editForm.controls.name.value ?? '';
      const short_name = this.editForm.controls.short_name.value ?? ''

      this.locationService.editLocation(
        this.currentEditLocationId,
        name,
        short_name,
      ).then((location: StationLocation) => {
        const updatedIndex = this.locations.findIndex((loc) => loc.id == location.id);

        this.locations[updatedIndex].name = name;
        this.locations[updatedIndex].short_name = short_name;
      });

      this.showEditModal = false;
    }
  }

  deleteLocation(): void {
    if (this.currentDeleteLocationId) {
      this.locationService.deleteLocation(
        this.currentDeleteLocationId
      ).then(() => {
        this.locations = this.locations.filter((loc) => loc.id != this.currentDeleteLocationId);
      });

      this.showDeleteModal = false;
    }
  }

  editMode(location: StationLocation): void {
    this.currentEditLocationId = location.id;
    this.editForm.controls.name.setValue(location.name);
    this.editForm.controls.short_name.setValue(location.short_name);
    this.showEditModal = true;
  }

  deleteMode(location: StationLocation): void {
    this.currentDeleteLocationId = location.id;
    this.showDeleteModal = true;
  }
}
