import { LiaHotelSolid } from "react-icons/lia";
import { ISiderbar } from "../interfaces/sidebar-interface";
import { TbHotelService } from "react-icons/tb";
import { BsPeople } from "react-icons/bs";
import { FaRegNewspaper } from "react-icons/fa6";
import { CgMathPercent } from "react-icons/cg";
import { MdFlight, MdOutlineAltRoute } from "react-icons/md";

export const ADMIN_MENU: ISiderbar[] = [
  {
    text: "Insert Promo",
    path: "insert-promo",
    icon: <CgMathPercent size={25} />,
  },
  {
    text: "Update Promo",
    path: "update-promo",
    icon: <CgMathPercent size={25} />,
  },
  { divider: true },
  {
    text: "Manage User",
    path: "user",
    icon: <BsPeople size={25} />,
  },
  {
    text: "Send Newsletter",
    path: "newsletter",
    icon: <FaRegNewspaper size={25} />,
  },
  { divider: true },
  {
    text: "Add Hotel",
    path: "hotel",
    icon: <LiaHotelSolid size={25} />,
  },
  {
    text: "Hotel Detail",
    path: "hotel-detail",
    icon: <TbHotelService  size={25} />,
  },
  { divider: true },
  {
    text: "Add Route",
    path: "add-route",
    icon: <MdOutlineAltRoute size={25} />,
  },
  {
    text: "Add Flight",
    path: "add-flight",
    icon: <MdFlight size={25} />,
  },
];
