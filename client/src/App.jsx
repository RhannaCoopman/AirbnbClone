import { Route, Routes } from "react-router-dom";
import "./App.css";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import Layout from "./Layout";
import RegisterPage from "./pages/RegisterPage";
import axios from "axios";
import { UserContextProvider } from "./contexts/UserContext";
import AccountPage from "./pages/AccountPage";
import PlacesPage from "./components/PlacesPage";
import PlacesformPage from "./pages/PlacesformPage";
import PlacePage from "./pages/PlacePage";
import BookingsPage from "./pages/BookingsPage";
import BookingDetailPage from "./pages/BookingDetailPage";

axios.defaults.baseURL = 'http://127.0.0.1:4000';
axios.defaults.withCredentials = true;

function App() {
  
  return (
    <UserContextProvider>

      <Routes>
        <Route path="/" element={<Layout />}>

          <Route index element={< IndexPage />} />
          <Route path="/login" element={< LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/account" element={<AccountPage />} />
          <Route path="/account/places" element={<PlacesPage />} />
          <Route path="/account/places/new" element={<PlacesformPage />} />

          <Route path="/account/places/:id" element={<PlacesformPage />} />

          <Route path="place/:id" element={<PlacePage />} />

          <Route path="/account/bookings" element={<BookingsPage />} />
          <Route path="/account/bookings/:id" element={<BookingDetailPage />} />

        </Route>

      </Routes>

    </UserContextProvider>
  );
}

export default App;
