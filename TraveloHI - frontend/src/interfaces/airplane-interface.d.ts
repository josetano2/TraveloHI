interface IAirplane {
  ID: number;
  AirlineID: number;
  Airline: IAirline;
  Name: string;
  Type: string;
  IsAvailable: boolean;
}
