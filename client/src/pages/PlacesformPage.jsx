import { useEffect, useState } from "react";

import axios from "axios";
import PhotosUploader from "../components/PhotosUploader.jsx"
import Perks from "../components/Perks.jsx"
import AccountNav from "../components/AccountNav";
import { Navigate, useParams } from "react-router-dom";


const PlacesformPage = () => {
  const {id} = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState("");
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(0.00);
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }

    axios.get('/places/'+id).then(response => {
      const {data} = response;

      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
      setPrice(data.price);

    });
  }, [id])

  const inputHeader = (text) => {
    return <h2 className="text-2xl mt4">{text}</h2>;
  };

  const inputDescription = (text) => {
    return <p className="text-gray-500 text-sm">{text}</p>;
  };

  const preInput = (header, description) => {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  };

  const savePlace = async (e) => {
    e.preventDefault();

    const placeData = {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    }

    console.log(placeData);

    if (id) {
      await axios.put("/places", {
        id,
        placeData
      });
  
      setRedirect(true);

    } else {
        await axios.post("/places", placeData);

        setRedirect(true);
    }

  };

  if(redirect) {
    return <Navigate to={'/account/places'} />
  }

  return (
      <div>
        <AccountNav />
        <form onSubmit={savePlace}>
          {preInput("Title", "Title of your place.")}
          <input
            className=""
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="placename"
          />

          {preInput("Address", "Address of your place.")}
          <input
            className=""
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            type="text"
            placeholder="address"
          />

          {preInput("Photos", "More photos is better.")}
          <PhotosUploader
            addedPhotos={addedPhotos}
            onChange={setAddedPhotos}
          />


          {preInput("Description", "Description of your place")}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          {preInput("Perks", "Select all the perks of your place")}
          <Perks selected={perks} onChange={setPerks} />

          {preInput("Extra info", "House rules etc.")}
          <textarea
            name=""
            id=""
            value={extraInfo}
            onChange={(e) => setExtraInfo(e.target.value)}
          ></textarea>

          {preInput(
            "Check in&out",
            "Check in and out times, remember to have some time window for cleaning the room between guests."
          )}
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <h3>Check in time</h3>
              <input
                type="number"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                placeholder="14:00"
                className="mt-2 -mb-1"
              />
            </div>
            <div>
              <h3>Check out time</h3>
              <input
                type="number"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                placeholder="10:00"
                className="mt-2 -mb-1"
              />
            </div>
            <div>
              <h3>Maximum number of guests</h3>
              <input
                type="number"
                value={maxGuests}
                onChange={(e) => setMaxGuests(e.target.value)}
                className="mt-2 -mb-1"
              />
            </div>
            <div>
              <h3>Price per night</h3>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="50,00"
                className="mt-2 -mb-1"
              />
            </div>
          </div>

          <button className="primary my-4">Save</button>
        </form>
      </div>
    )
};


export default PlacesformPage;