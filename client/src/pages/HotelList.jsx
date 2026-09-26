import { useEffect, useState } from "react";
import {Container,SimpleGrid,Title,TextInput,NumberInput,Button,Group,Paper,Text,} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import HotelCard from "../components/HotelCard";
import Pagination from "../components/Pagination";
import { notifications } from "@mantine/notifications";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import {fetchHotels,removeHotel,} from "../store/hotelSlice";
function HotelList() {
  const [searchText, setSearchText] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
 const navigate = useNavigate();
 const dispatch = useDispatch();
const {
  hotels,
  loading,
  error,
  pagination,
} = useSelector((state) => state.hotels);
const totalPages = pagination.totalPages;
  const hotelsPerPage = 6;
useEffect(() => {
  const offset =
    (currentPage - 1) * hotelsPerPage;
  dispatch(
    fetchHotels({
      search: searchText,
      minPrice,
      maxPrice,
      limit: hotelsPerPage,
      offset,
    })
  );
}, [
  dispatch,
  searchText,
  minPrice,
  maxPrice,
  currentPage,
]);
  const handleEdit = (hotel) => {
  navigate(`/edit/${hotel.id}`);
};
 const handleDelete = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this hotel?"
  );
  if (!confirmed) {
    return;
  }
  try {
    await dispatch(removeHotel(id)).unwrap();
    notifications.show({
      title: "Success",
      message: "Hotel deleted successfully",
      color: "green",
    });
  } catch (error) {
    console.error("Delete error:", error);
    notifications.show({
      title: "Error",
      message: error,
      color: "red",
    });
  }
};
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
return (
  <>
    <Helmet>
      <title>Hotel List | HotelHub</title>
      <meta
        name="description"
        content="Search and discover hotels, filter by price, and explore hotel details."
      />
    </Helmet>
    <Container size="xl" py="xl">
      <Paper
        shadow="sm"
        p="xl"
        radius="md"
        withBorder
        mb="xl"
      >
        <Title order={1} ta="center">
          HotelHub
        </Title>
        <Text
          ta="center"
          c="dimmed"
          mt="xs"
          mb="lg"
        >
          Search and discover comfortable hotels for your stay in HotelHub
        </Text>
        <Group
  align="end"
  grow
  wrap="wrap"
>
          <TextInput
            label="Search Hotel"
            placeholder="Enter hotel name"
            value={searchText}
            onChange={(event) => {
              setSearchText(event.currentTarget.value);
              setCurrentPage(1);
            }}
          />
          <NumberInput
            label="Minimum Price"
            placeholder="₹ Minimum"
            min={0}
            value={minPrice}
            onChange={(value) => {
              setMinPrice(value);
              setCurrentPage(1);
            }}
          />
          <NumberInput
            label="Maximum Price"
            placeholder="₹ Maximum"
            min={0}
            value={maxPrice}
            onChange={(value) => {
              setMaxPrice(value);
              setCurrentPage(1);
            }}
          />
          <Button>
            Search
          </Button>
        </Group>
      </Paper>
<Group justify="space-between" mb="lg">
  <Title order={2}>
    Available Hotels
  </Title>
  <Button onClick={() => navigate("/add")}>
    Add Hotel
  </Button>
</Group>
{error && (
  <Text c="red" mb="md">
    {error}
  </Text>
)}{loading ? (
  <Text ta="center">
    Loading hotels...
  </Text>
) : hotels.length > 0 ? (
        <>
          <SimpleGrid
            cols={{ base: 1, sm: 2, md: 3 }}
            spacing="lg"
          >
            {hotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </SimpleGrid>
          <Group justify="center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </Group>
        </>
      ) : (
        <Text ta="center" c="dimmed">
          No hotels found.
        </Text>
      )}
    </Container>
    </>
  );
}
export default HotelList;