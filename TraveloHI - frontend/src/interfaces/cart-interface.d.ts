import { IUser } from "./user-interface";

interface ICart {
  ID: number;
  UserID: number;
  User: IUser;
  Status: string;
  TransactionDate: string;
  HotelCarts: HotelCart[];
  FlightCarts: FlightCart[];
}

interface IHotelCart {
  ID: number;
  CartID: number;
  Cart: ICart;
  HotelID: number;
  Hotel: IHotel;
  RoomDetailID: number;
  RoomDetail: IRoomDetail;
  CheckInDate: string;
  CheckOutDate: string;
}

interface IFlightCart {
  ID: number;
  CartID: number;
  Cart: ICart;
  TicketID: number;
  Ticket: ITicket;
}

interface IActiveTickets{
  HotelCarts: IHotelCart[]
  FlightCarts: IFlightCart[]
}
