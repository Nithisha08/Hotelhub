import { useEffect, useState } from "react";
import { ImagePlus, TriangleAlert } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function HotelForm({ hotel, onSubmit, loading = false }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (hotel) {
      setTitle(hotel.title || "");
      setDescription(hotel.description || "");
      setLatitude(hotel.latitude ?? "");
      setLongitude(hotel.longitude ?? "");
      setPrice(hotel.price ?? "");
      if (hotel.image) {
        setPreview(`http://localhost:5000${hotel.image}`);
      }
    } else {
      setTitle("");
      setDescription("");
      setLatitude("");
      setLongitude("");
      setPrice("");
      setImage(null);
      setPreview(null);
    }
  }, [hotel]);

  const handleImageChange = (file) => {
    setValidationError("");
    if (file) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setValidationError("Only JPG, JPEG, PNG and WEBP images are allowed");
        setImage(null);
        setPreview(null);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setValidationError("Image size must be less than 5 MB");
        setImage(null);
        setPreview(null);
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setImage(null);
      if (hotel?.image) {
        setPreview(`http://localhost:5000${hotel.image}`);
      } else {
        setPreview(null);
      }
    }
  };

  const validateForm = () => {
    if (!title.trim()) {
      return "Hotel title is required";
    }
    if (title.trim().length < 3) {
      return "Hotel title must contain at least 3 characters";
    }
    if (!description.trim()) {
      return "Hotel description is required";
    }
    if (description.trim().length < 10) {
      return "Hotel description must contain at least 10 characters";
    }
    if (latitude === "" || latitude === null || latitude === undefined) {
      return "Latitude is required";
    }
    if (Number(latitude) < -90 || Number(latitude) > 90) {
      return "Latitude must be between -90 and 90";
    }
    if (longitude === "" || longitude === null || longitude === undefined) {
      return "Longitude is required";
    }
    if (Number(longitude) < -180 || Number(longitude) > 180) {
      return "Longitude must be between -180 and 180";
    }
    if (price === "" || price === null || price === undefined) {
      return "Price is required";
    }
    if (Number(price) <= 0) {
      return "Price must be greater than 0";
    }
    if (!hotel && !image) {
      return "Hotel image is required";
    }
    return "";
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const error = validateForm();
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError("");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("price", price);
    if (image) {
      formData.append("image", image);
    }
    onSubmit(formData);
  };

  return (
    <form className="form-stack" onSubmit={handleSubmit}>
      {validationError && (
        <div className="form-error" role="alert">
          <TriangleAlert size={16} />
          <span>{validationError}</span>
        </div>
      )}
      <h2 className="form-title">{hotel ? "Edit Hotel" : "Add Hotel"}</h2>
      <div className="field">
        <label className="field-label" htmlFor="hotel-image">
          {hotel ? "Hotel Image (Optional)" : "Hotel Image"}
        </label>
        <input
          id="hotel-image"
          className="file-input-hidden"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(event) => {
            handleImageChange(event.target.files[0] || null);
          }}
          required={!hotel}
        />
        <label
          className={`file-drop${preview ? " has-file" : ""}`}
          htmlFor="hotel-image"
        >
          <ImagePlus size={18} />
          {preview ? "Change image" : "Choose an image"}
        </label>
      </div>
      {preview && (
        <img
          className="form-preview"
          src={preview}
          alt={title || "Hotel preview"}
        />
      )}
      <div className="field">
        <label className="field-label" htmlFor="hotel-title">
          Hotel Title
        </label>
        <input
          id="hotel-title"
          className="input"
          type="text"
          placeholder="Enter hotel title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </div>
      <div className="field">
        <label className="field-label" htmlFor="hotel-description">
          Description
        </label>
        <textarea
          id="hotel-description"
          className="input"
          placeholder="Enter hotel description"
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
        />
      </div>
      <div className="field">
        <label className="field-label" htmlFor="hotel-latitude">
          Latitude
        </label>
        <input
          id="hotel-latitude"
          className="input"
          type="number"
          placeholder="Example: 13.0827"
          step="any"
          min="-90"
          max="90"
          value={latitude}
          onChange={(event) => setLatitude(event.target.value)}
          required
        />
      </div>
      <div className="field">
        <label className="field-label" htmlFor="hotel-longitude">
          Longitude
        </label>
        <input
          id="hotel-longitude"
          className="input"
          type="number"
          placeholder="Example: 80.2707"
          step="any"
          min="-180"
          max="180"
          value={longitude}
          onChange={(event) => setLongitude(event.target.value)}
          required
        />
      </div>
      <div className="field">
        <label className="field-label" htmlFor="hotel-price">
          Price
        </label>
        <input
          id="hotel-price"
          className="input"
          type="number"
          placeholder="Enter price"
          min="0"
          step="any"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          required
        />
      </div>
      <div className="button-row">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : hotel ? "Update Hotel" : "Add Hotel"}
        </button>
      </div>
    </form>
  );
}
export default HotelForm;
