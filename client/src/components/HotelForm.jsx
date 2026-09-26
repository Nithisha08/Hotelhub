import { useEffect, useState } from "react";
import {
  TextInput,
  Textarea,
  NumberInput,
  FileInput,
  Button,
  Image,
  Stack,
  Title,
  Group,
  Text,
} from "@mantine/core";
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
      setLatitude(hotel.latitude || "");
      setLongitude(hotel.longitude || "");
      setPrice(hotel.price || "");
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
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      setValidationError(
        "Only JPG, JPEG, PNG and WEBP images are allowed"
      );
      setImage(null);
      setPreview(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setValidationError(
        "Image size must be less than 5 MB"
      );
      setImage(null);
      setPreview(null);
      return;
    }
    setImage(file);
    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
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
  if (
    latitude === "" ||
    latitude === null ||
    latitude === undefined
  ) {
    return "Latitude is required";
  }
  if (Number(latitude) < -90 || Number(latitude) > 90) {
    return "Latitude must be between -90 and 90";
  }
  if (
    longitude === "" ||
    longitude === null ||
    longitude === undefined
  ) {
    return "Longitude is required";
  }
  if (Number(longitude) < -180 || Number(longitude) > 180) {
    return "Longitude must be between -180 and 180";
  }
  if (
    price === "" ||
    price === null ||
    price === undefined
  ) {
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
   <form onSubmit={handleSubmit}>
  <Stack gap="md">
    {validationError && (
      <Text c="red" size="sm">
        {validationError}
      </Text>
    )}
        <Title order={2}>
          {hotel ? "Edit Hotel" : "Add Hotel"}
        </Title>
        <FileInput
          label={hotel ? "Hotel Image (Optional)" : "Hotel Image"}
          placeholder="Choose an image"
          accept="image/png,image/jpeg,image/webp"
          value={image}
          onChange={handleImageChange}
          required={!hotel}
        />
        {preview && (
          <Image
            src={preview}
            h={220}
            fit="cover"
            radius="md"
            alt={title || "Hotel preview"}
          />
        )}
        <TextInput
          label="Hotel Title"
          placeholder="Enter hotel title"
          value={title}
          onChange={(event) => setTitle(event.currentTarget.value)}
          required
        />
        <Textarea
          label="Description"
          placeholder="Enter hotel description"
          minRows={4}
          value={description}
          onChange={(event) =>
            setDescription(event.currentTarget.value)
          }
          required
        />
<NumberInput
  label="Latitude"
  placeholder="Example: 13.0827"
  value={latitude}
  onChange={setLatitude}
  min={-90}
  max={90}
  decimalScale={7}
  required
/>
        <NumberInput
  label="Longitude"
  placeholder="Example: 80.2707"
  value={longitude}
  onChange={setLongitude}
  min={-180}
  max={180}
  decimalScale={7}
  required
/>
        <NumberInput
          label="Price"
          placeholder="Enter price"
          min={0}
          value={price}
          onChange={setPrice}
          required
        />
        <Group>
          <Button type="submit" loading={loading}>
            {hotel ? "Update Hotel" : "Add Hotel"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
export default HotelForm;