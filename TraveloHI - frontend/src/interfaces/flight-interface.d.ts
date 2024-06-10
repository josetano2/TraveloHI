interface IFlight {
  ID: number;
  FlightRouteID: number;
  FlightRoute: IFlightRoute;
  AirlineID: number;
  Airline: IAirline;
  AirplaneID: number;
  Airplane: AIirplane;
  ArrivalTime: string;
  DepartureTime: string;
  IncludedBaggage: number;
  Code: string;
}
