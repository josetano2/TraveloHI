import { IoIosFitness, IoIosWifi } from "react-icons/io";
import { colors } from "../components/colors";
import { Tb24Hours, TbAirConditioning, TbElevator } from "react-icons/tb";
import { MdConnectingAirports, MdMeetingRoom, MdRestaurant } from "react-icons/md";
import { FaWheelchair } from "react-icons/fa";
import { LuParkingSquare } from "react-icons/lu";
import { PiSwimmingPoolFill } from "react-icons/pi";

interface IFacilitySettings{
    name: string;
    icon: JSX.Element
}

export const FACILITY_ICON: IFacilitySettings[] = [
    {
        name: "WiFi",
        icon: <IoIosWifi color={colors.blue} />
    },
    {
        name: "Swimming Pool",
        icon: <PiSwimmingPoolFill color={colors.blue} />
    },
    {
        name: "Parking",
        icon: <LuParkingSquare color={colors.blue} />
    },
    {
        name: "Restaurant",
        icon: <MdRestaurant color={colors.blue} />
    },
    {
        name: "24-Hour Front Desk",
        icon: <Tb24Hours color={colors.blue} />
    },
    {
        name: "Elevator",
        icon: <TbElevator color={colors.blue} />
    },
    {
        name: "Wheelchair Access",
        icon: <FaWheelchair color={colors.blue} />
    },
    {
        name: "Fitness Center",
        icon: <IoIosFitness color={colors.blue} />
    },
    {
        name: "Meeting Facilities",
        icon: <MdMeetingRoom color={colors.blue} />
    },
    {
        name: "Airport Transfer",
        icon: <MdConnectingAirports color={colors.blue} />
    },
    {
        name: "AC",
        icon: <TbAirConditioning color={colors.blue} />
    },
]

