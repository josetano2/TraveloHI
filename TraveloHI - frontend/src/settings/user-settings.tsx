import { IoCartOutline } from "react-icons/io5";
import { ISiderbar } from "../interfaces/sidebar-interface";
import { VscBook } from "react-icons/vsc";
import { MdFlight } from "react-icons/md";
import { LiaHotelSolid } from "react-icons/lia";
import { GoGear } from "react-icons/go";
import { IoIosPower } from "react-icons/io";
import { PiCreditCardLight } from "react-icons/pi";
import { LuHistory } from "react-icons/lu";

export const USER_MENU: ISiderbar[] = [
    {
      text: "My Cart",
      path: "my-cart",
      icon: <IoCartOutline size={25} />,
    },
    {
      text: "My Ticket",
      path: "my-ticket",
      icon: <VscBook size={25} />,
    },
    {
      text: "My History",
      path: "my-history",
      icon: <LuHistory size={25} />,
    },
    // {
    //   text: "Flight List",
    //   path: "flight-list",
    //   icon: <MdFlight size={25} />,
    // },
    // {
    //   text: "Booked Hotel",
    //   path: "booked-hotel",
    //   icon: <LiaHotelSolid size={25} />,
    // },
    { divider: true },
    {
      text: "My Account",
      path: "my-account",
      icon: <GoGear size={25} />,
    },
    {
      text: "My Cards",
      path: "my-cards",
      icon: <PiCreditCardLight size={25} />,
    },
    {
      text: "Log Out",
      path: "logout",
      icon: <IoIosPower size={25} />,
    },
  ];