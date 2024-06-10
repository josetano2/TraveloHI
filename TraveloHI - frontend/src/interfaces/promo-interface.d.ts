import { IUser } from "./user-interface";

export interface IPromo {
  ID: number;
  Code: string;
  StartDate: string;
  EndDate: string;
  Image: string;
  Percentage: number;
}

export interface UserPromo {
  UserID: number;
  User: IUser;
  PromoID: number;
  Promo: IPromo;
}
