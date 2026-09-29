import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import HotelForm from "../components/HotelForm";
import { Helmet } from "react-helmet-async";
import { useDispatch } from "react-redux";
import {
  addHotel,
  editHotel,
} from "../store/hotelSlice";

function HotelAddEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (!isEditMode) {
      return undefined;
    }
    const fetchHotel = async () => {
      try {
        setFetching(true);
        setError("");
        const response = await fetch(
          `http://localhost:5000/api/hotels/${id}`
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch hotel");
        }
        setHotel(data);
      } catch (fetchError) {
        console.error(fetchError);
        setError(fetchError.message);
      } finally {
        setFetching(false);
      }
    };
    fetchHotel();
  }, [id, isEditMode]);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError("");
      if (isEditMode) {
        await dispatch(
          editHotel({
            id,
            formData,
          })
        ).unwrap();
        alert("Hotel updated successfully");
      } else {
        await dispatch(addHotel(formData)).unwrap();
        alert("Hotel added successfully");
      }
      navigate("/");
    } catch (submitError) {
      console.error(submitError);
      setError(submitError);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="container container-md">
        <div className="loading-center">
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {isEditMode ? "Edit Hotel | HotelHub" : "Add Hotel | HotelHub"}
        </title>
        <meta
          name="description"
          content={
            isEditMode
              ? "Edit hotel details including image, description, location and price."
              : "Add a new hotel with image, description, location and price."
          }
        />
      </Helmet>
      <div className="container container-md">
        <div className="card card-pad">
          {error && (
            <div className="alert alert-error" role="alert">
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}
          <HotelForm
            hotel={hotel}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </div>
      </div>
    </>
  );
}
export default HotelAddEdit;
