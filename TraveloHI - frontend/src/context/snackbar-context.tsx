import { createContext, useContext, useState } from "react";
import { IChildren } from "../interfaces/children-interface";
import Snackbar, { SnackbarType } from "../components/snackbar/snackbar";

interface ISnackbarContext {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  isSnackbarOpen: boolean;
  setIsSnackbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSnackbar: (msg: string, type: SnackbarType) => void;
  snackbarType: SnackbarType;
  setSnackbarType: React.Dispatch<React.SetStateAction<SnackbarType>>;
}

const SnackbarContext = createContext<ISnackbarContext>({} as ISnackbarContext);

export const useSnackbar = () => useContext(SnackbarContext);

export function SnackbarProvider({ children }: IChildren) {
  const [message, setMessage] = useState("");
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarType, setSnackbarType] = useState<SnackbarType>(
    SnackbarType.Error
  );

  const handleSnackbar = (msg: string, type: SnackbarType) => {
    setMessage(msg);
    setSnackbarType(type);
    setIsSnackbarOpen(true);
  };

  return (
    <SnackbarContext.Provider
      value={{
        message,
        setMessage,
        isSnackbarOpen,
        setIsSnackbarOpen,
        handleSnackbar,
        snackbarType,
        setSnackbarType,
      }}
    >
      {children}
    </SnackbarContext.Provider>
  );
}
