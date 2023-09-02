import { Link } from "react-router-dom";
import AccountNav from "./AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import PlaceImg from "./PlaceImg";

const PlacesPage = () => {
  const [places, setPlaces] = useState();

  useEffect(() => {
    axios.get("/user-places").then(({ data }) => {
      setPlaces(data);
    });
  }, []);

  console.log(places);

  return (
    <div>
      <AccountNav />

      <div className="text-center">
        <br></br>
        <Link
          to={"/account/places/new"}
          className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M12 5.25a.75.75 0 01.75.75v5.25H18a.75.75 0 010 1.5h-5.25V18a.75.75 0 01-1.5 0v-5.25H6a.75.75 0 010-1.5h5.25V6a.75.75 0 01.75-.75z"
              clipRule="evenodd"
            />
          </svg>
          <span>Add new place</span>
        </Link>

        <div className="mt-4">
          {places && places.map(place => (
            <Link to={'/account/places/'+place._id} className="flex items-center cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl" key={place._id}>
              <div className="flex w-32 h-32 bg-gray-300 rounded-2xl grow shrink-0">
                {/* { place.photos.length > 0 && (
                  <img className="object-cover rounded-2xl" src={'http://localhost:4000/uploads/'+place.photos[0]} alt="image of house"/>
                )} */}
                <PlaceImg place={place} />
              </div>
              <div className="grow-0 shrink">
                <h2 className="text-xl">{place.title}</h2>
                <p className="text-sm mt-2">{place.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlacesPage;
