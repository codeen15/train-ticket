import { TrainTrip } from "./train-trip.interface";

export interface BookingSummary {
    departure_trip: TrainTrip;
    departure_seats: string[];
    return_trip?: TrainTrip;
    return_seats: string[];
    payment_done: boolean,
    name: string,
    email: string
}