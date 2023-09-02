import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "../components/PlacesPage";
import AccountNav from "../components/AccountNav";

const AccountPage = () => {
  const { ready, user, setUser } = useContext(UserContext);
  let { subpage } = useParams();

  const [redirect, setRedirect] = useState(null);

  if (subpage === undefined) {
    subpage = "profile";
  }

  if (ready && !user && !redirect) {
    return <Navigate to={"/login"} />;
  }

  if (!ready) {
    return "Loading...";
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }


  const logout = async () => {
    await axios.post("/logout");
    setRedirect("/");
    setUser(null);
  };
  return (
    <div>
      <AccountNav />

      {subpage === "profile" && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user.name} ({user.email})
          <button onClick={logout} className="primary max-w-sm mt-2">
            Logout
          </button>
        </div>
      )}

      {subpage === "places" && (
        <PlacesPage />
      )}
    </div>
  );
};

export default AccountPage;
