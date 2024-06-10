interface ISeat{
    ID: number;
    FlightID: number;
    Flight: IFlight;
    Code: string;
    Class: string;
    IsAvailable: boolean;
}