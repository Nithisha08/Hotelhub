import { useEffect } from "react";
import {
  Container,
  Paper,
  Image,
  Title,
  Text,
  Stack,
  Button,
  Group,
  Loader,
  Center,
  Alert,
  Divider,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { fetchHotelById } from "../store/hotelSlice";
function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
const dispatch = useDispatch();
const {
  selectedHotel: hotel,
  loading,
  error,
} = useSelector(
  (state) => state.hotels
);
  useEffect(() => {
  if (id) {
    dispatch(fetchHotelById(id));
  }
}, [id, dispatch]);
  if (loading) {
    return (
      <Center h={400}>
        <Loader size="lg" />
      </Center>
    );
  }
  if (error) {
    return (
      <Container size="md" py="xl">
        <Alert color="red">{error}</Alert>
      </Container>
    );
  }
  if (!hotel) {
    return (
      <Container size="md" py="xl">
        <Alert color="yellow">
          Hotel not found.
        </Alert>
      </Container>
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
    <Container size="lg" py="xl">
      <Paper shadow="sm" p="xl" withBorder>
        <Stack gap="lg">
          <Image
            src={imageUrl}
            height={400}
            radius="md"
            fit="cover"
            alt={hotel.title}
          />
          <Title order={1}>
            {hotel.title}
          </Title>
          <Text size="xl" fw={700}>
            ₹{hotel.price}
          </Text>
          <Divider />
          <div>
            <Text fw={700} size="lg">
              Description
            </Text>
            <Text mt="xs">
              {hotel.description}
            </Text>
          </div>
          <div>
            <Text fw={700} size="lg">
              Location
            </Text>
           <Text mt="xs">
  Latitude: {Math.abs(hotel.latitude)}°{" "}
  {hotel.latitude >= 0 ? "N" : "S"}
</Text>
<Text>
  Longitude: {Math.abs(hotel.longitude)}°{" "}
  {hotel.longitude >= 0 ? "E" : "W"}
</Text>
          </div>
          <div>
            <Text fw={700} size="lg" mb="sm">
              View Location
            </Text>
            <iframe
              title={`Map showing location of ${hotel.title}`}
              width="100%"
              height="350"
              style={{
                border: 0,
                borderRadius: "10px",
              }}
              loading="lazy"
              src={`https://www.google.com/maps?q=${hotel.latitude},${hotel.longitude}&output=embed`}
            />
          </div>
          <Group>
            <Button onClick={() => navigate(`/edit/${hotel.id}`)}>
              Edit Hotel
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
            >
              Back to Hotels
            </Button>
            <Button
              variant="light"
              component="a"
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Google Maps
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Container>
    </>
  );
}
export default HotelDetail;