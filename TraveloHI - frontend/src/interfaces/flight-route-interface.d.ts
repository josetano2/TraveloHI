interface IFlightRoute {
  ID: number;
  OriginID: number;
  Origin: IAirport;
  DestinationID: number;
  Destination: IAirport;
  Duration: number;
  Price: number;
}
