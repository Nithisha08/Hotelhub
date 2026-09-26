import { useEffect, useState } from "react";
import { Container, Paper, Center, Loader, Alert } from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
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
      return;
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
      } catch (error) {
        console.error(error);
        setError(error.message);
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
      await dispatch(
        addHotel(formData)
      ).unwrap();

      alert("Hotel added successfully");
    }
    navigate("/");
  } catch (error) {
    console.error(error);
    setError(error);
  } finally {
    setLoading(false);
  }
};
  if (fetching) {
    return (
      <Center h={300}>
        <Loader />
      </Center>
    );
  }
  return (
  <>
    <Helmet>
      <title>
        {isEditMode
          ? "Edit Hotel | HotelHub"
          : "Add Hotel | HotelHub"}
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
    <Container size="md" py="xl">
      <Paper shadow="sm" p="xl" withBorder>
        {error && (
          <Alert color="red" mb="md">
            {error}
          </Alert>
        )}
        <HotelForm
          hotel={hotel}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </Paper>
    </Container>
    </>
  );
}
export default HotelAddEdit;