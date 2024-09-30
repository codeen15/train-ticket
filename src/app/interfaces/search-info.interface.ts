import { StationLocation } from "./location.interface";

export interface SearchInfo {
    origin: StationLocation,
    destination: StationLocation,
    departureDate: Date,
    returnDate?: Date,
    noOfPax: number
}