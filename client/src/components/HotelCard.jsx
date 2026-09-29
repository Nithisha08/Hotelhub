import { useNavigate } from "react-router-dom";
function HotelCard({ hotel, onEdit, onDelete }) {
  const navigate = useNavigate();
  return (
    <div className="card hotel-card">
      <img
        className="hotel-card-image"
        src={`http://localhost:5000${hotel.image}`}
        alt={hotel.title}
      />
      <div className="hotel-card-body">
        <h3 className="hotel-card-title">{hotel.title}</h3>
        <p className="hotel-card-price">₹{hotel.price}</p>
        <p className="hotel-card-desc">{hotel.description}</p>
        <div className="hotel-card-actions">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => navigate(`/hotel/${hotel.id}`)}
          >
            View Details
          </button>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => onEdit(hotel)}
          >
            Edit
          </button>
          <button
            type="button"
            className="btn btn-danger-outline btn-sm"
            onClick={() => onDelete(hotel.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
export default HotelCard;
