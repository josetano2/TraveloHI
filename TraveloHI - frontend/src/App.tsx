import { BrowserRouter, Route, Routes } from "react-router-dom";
import { IMenu, MENU_LIST } from "./settings/menu-settings";
import { ThemeProvider } from "./context/theme-context";
import { UserProvider } from "./context/user-context";
import { FetchProvider } from "./context/fetch-context";
import { SnackbarProvider } from "./context/snackbar-context";

export default function App() {
  return (
    <ThemeProvider>
      <FetchProvider>
        <SnackbarProvider>
          <BrowserRouter>
            <UserProvider>
              <Routes>
                {MENU_LIST.map((menu: IMenu, idx) => (
                  <Route key={idx} path={menu.path} element={menu.element} />
                ))}
              </Routes>
            </UserProvider>
          </BrowserRouter>
        </SnackbarProvider>
      </FetchProvider>
    </ThemeProvider>
  );
}
