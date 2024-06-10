interface IHotel {
  ID: number;
  Name: string;
  Description: string;
  Rating: float32;
  Address: string;
  CityID: uint;
  City: ICity;
  Images: string[];
  Facilities: IFacility[];
  MinPrice?: number;
  RoomDetails?: IRoomDetails[];
}

interface IRoomDetail {
  HotelID: number;
  Hotel: IHotel;
  ID: number;
  Name: string;
  Price: number;
  Capacity: number;
  IsBreakfast: boolean;
  IsFreeWifi: boolean;
  IsRefundable: boolean;
  IsReschedule: boolean;
  IsSmoking: boolean;
  Guest: number;
  Bed: string;
  Images: string[];
}

interface IFacility {
  ID: number;
  Name: string;
}
