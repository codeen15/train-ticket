import { StationLocation } from "./location.interface"

export interface TrainTrip {
    id: number,
    origin: StationLocation;
    destination: StationLocation;
    date_time: Date;
    price: number,
    available_seat: number
}