import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  AlertTriangle,
  Loader2,
  MapPin,
  ExternalLink,
  FileText,
 IndianRupee,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { fetchHotelById } from "../store/hotelSlice";

function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedHotel: hotel, loading, error } = useSelector(
    (state) => state.hotels
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchHotelById(id));
    }
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="container container-lg">
        <div className="loading-center tall">
          <Loader2 size={26} className="spinner" />
          <span>Loading hotel...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container container-md">
        <div className="alert alert-error" role="alert">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="container container-md">
        <div className="alert alert-warning" role="alert">
          <AlertTriangle size={16} />
          <span>Hotel not found.</span>
        </div>
      </div>
    );
  }

  const imageUrl = hotel.image
    ? `http://localhost:5000${hotel.image}`
    : "";
  const mapUrl = `https://www.google.com/maps?q=${hotel.latitude},${hotel.longitude}`;

  return (
    <>
      <Helmet>
        <title>{hotel.title} | HotelHub</title>
        <meta
          name="description"
          content={
            hotel.description ||
            `View details, price and location of ${hotel.title}.`
          }
        />
      </Helmet>
      <div className="container container-lg">
        <div className="card card-pad">
          <div className="form-stack">
            {imageUrl ? (
              <img
                className="detail-image"
                src={imageUrl}
                alt={hotel.title}
              />
            ) : (
              <div className="image-placeholder">
                <MapPin size={32} />
              </div>
            )}
            <h1 className="detail-title">{hotel.title}</h1>
            <p className="detail-price">
              <IndianRupee size={22} strokeWidth={2.5} /> {hotel.price}
            </p>
            <hr className="divider" />
            <div className="detail-section">
              <h3 className="section-heading">
                <FileText size={18} />
                Description
              </h3>
              <p className="detail-text">{hotel.description}</p>
            </div>
            <div className="detail-section">
              <h3 className="section-heading">
                <MapPin size={18} />
                Location
              </h3>
              <p className="detail-text">
                Latitude: {Math.abs(hotel.latitude)}°{" "}
                {hotel.latitude >= 0 ? "N" : "S"}
              </p>
              <p className="detail-text">
                Longitude: {Math.abs(hotel.longitude)}°{" "}
                {hotel.longitude >= 0 ? "E" : "W"}
              </p>
            </div>
            <div className="detail-section">
              <h3 className="section-heading">
                <MapPin size={18} />
                View Location
              </h3>
              <iframe
                title={`Map showing location of ${hotel.title}`}
                className="map-frame"
                height="350"
                loading="lazy"
                src={`https://www.google.com/maps?q=${hotel.latitude},${hotel.longitude}&output=embed`}
              />
            </div>
            <div className="button-row">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate(`/edit/${hotel.id}`)}
              >
                Edit Hotel
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate("/")}
              >
                Back to Hotels
              </button>
              <a
                className="btn btn-light"
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Google Maps
                <ExternalLink size={15} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default HotelDetail;
