export interface IUser {
  ID: number;
  FirstName: string;
  LastName: string;
  Email: string;
  DOB: string;
  Gender: string;
  Question: string;
  Answer: string;
  ProfilePicture: string;
  Newsletter: string;
  IsBanned: boolean;
  IsLoggedIn: boolean;
  WalletAmount: number;
}

export interface ILoggedUser {
  ID: number;
  FirstName: string;
  LastName: string;
  Email: string;
  DOB: string;
  Gender: string;
  ProfilePicture: string;
  Address: string;
  PhoneNumber: string;
  Newsletter: string;
  Role: string;
  WalletAmount: number;
}
