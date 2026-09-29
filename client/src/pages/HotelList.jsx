import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, AlertCircle, Loader2 } from "lucide-react";
import HotelCard from "../components/HotelCard";
import Pagination from "../components/Pagination";
import { useToast } from "../components/Toast";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchHotels,
  removeHotel,
} from "../store/hotelSlice";

function HotelList() {
  const [searchText, setSearchText] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const showToast = useToast();
  const { hotels, loading, error, pagination } = useSelector(
    (state) => state.hotels
  );
  const totalPages = pagination.totalPages;
  const hotelsPerPage = 6;

  useEffect(() => {
    const offset = (currentPage - 1) * hotelsPerPage;
    dispatch(
      fetchHotels({
        search: searchText,
        minPrice,
        maxPrice,
        limit: hotelsPerPage,
        offset,
      })
    );
  }, [dispatch, searchText, minPrice, maxPrice, currentPage]);

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
      showToast({
        title: "Success",
        message: "Hotel deleted successfully",
        type: "success",
      });
    } catch (deleteError) {
      console.error("Delete error:", deleteError);
      showToast({
        title: "Error",
        message: deleteError,
        type: "error",
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
      <div className="container">
        <div className="card card-pad hero-card">
          <h1 className="hero-title">HotelHub</h1>
          <p className="hero-sub">
            Search and discover comfortable hotels for your stay in HotelHub
          </p>
          <form
            className="filter-grid"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="field">
              <label className="field-label" htmlFor="search-hotel">
                Search Hotel
              </label>
              <input
                id="search-hotel"
                className="input"
                type="text"
                placeholder="Enter hotel name"
                value={searchText}
                onChange={(event) => {
                  setSearchText(event.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="min-price">
                Minimum Price
              </label>
              <input
                id="min-price"
                className="input"
                type="number"
                min="0"
                placeholder="₹ Minimum"
                value={minPrice}
                onChange={(event) => {
                  setMinPrice(event.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="max-price">
                Maximum Price
              </label>
              <input
                id="max-price"
                className="input"
                type="number"
                min="0"
                placeholder="₹ Maximum"
                value={maxPrice}
                onChange={(event) => {
                  setMaxPrice(event.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              <Search size={16} />
              Search
            </button>
          </form>
        </div>

        <div className="section-header">
          <h2>Available Hotels</h2>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate("/add")}
          >
            <Plus size={16} />
            Add Hotel
          </button>
        </div>

        {error && (
          <div className="alert alert-error" role="alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
        {loading ? (
          <div className="loading-center">
            <Loader2 size={22} className="spinner" />
            <span>Loading hotels...</span>
          </div>
        ) : hotels.length > 0 ? (
          <>
            <div className="hotel-grid">
              {hotels.map((hotel) => (
                <HotelCard
                  key={hotel.id}
                  hotel={hotel}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <p className="empty-state">No hotels found.</p>
        )}
      </div>
    </>
  );
}
export default HotelList;
