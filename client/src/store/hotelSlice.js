import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import {
  getHotels,
  getHotelById,
  deleteHotel,
  createHotel,
  updateHotel,
} from "../services/hotelApi";

export const fetchHotels = createAsyncThunk(
  "hotels/fetchHotels",
  async (params, { rejectWithValue }) => {
    try {
      const data = await getHotels(params);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.message
      );
    }
  }
);
export const removeHotel = createAsyncThunk(
  "hotels/removeHotel",
  async (id, { rejectWithValue }) => {
    try {
      const data = await deleteHotel(id);

      return {
        id,
        data,
      };
    } catch (error) {
      return rejectWithValue(
        error.message
      );
    }
  }
);
export const addHotel = createAsyncThunk(
  "hotels/addHotel",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await createHotel(formData);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.message
      );
    }
  }
);
export const editHotel = createAsyncThunk(
  "hotels/editHotel",
  async (
    { id, formData },
    { rejectWithValue }
  ) => {
    try {
      const data = await updateHotel(
        id,
        formData
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.message
      );
    }
  }
);
export const fetchHotelById = createAsyncThunk(
  "hotels/fetchHotelById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await getHotelById(id);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.message
      );
    }
  }
);
const hotelSlice = createSlice({
  name: "hotels",

  initialState: {
    hotels: [],
    selectedHotel: null,
    loading: false,
    error: null,

    pagination: {
      total: 0,
      offset: 0,
      limit: 6,
      totalPages: 1,
    },
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(
        fetchHotels.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchHotels.fulfilled,
        (state, action) => {
          state.loading = false;

          state.hotels =
            action.payload.data;

          state.pagination =
            action.payload.pagination;
        }
      )

      .addCase(
        fetchHotels.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to fetch hotels";
        }
      )
      .addCase(
  removeHotel.pending,
  (state) => {
    state.loading = true;
    state.error = null;
  }
)

.addCase(
  removeHotel.fulfilled,
  (state, action) => {
    state.loading = false;

    state.hotels =
      state.hotels.filter(
        (hotel) =>
          hotel.id !== action.payload.id
      );
  }
)

.addCase(
  removeHotel.rejected,
  (state, action) => {
    state.loading = false;

    state.error =
      action.payload ||
      "Failed to delete hotel";
  }
)
.addCase(
  addHotel.pending,
  (state) => {
    state.loading = true;
    state.error = null;
  }
)

.addCase(
  addHotel.fulfilled,
  (state, action) => {
    state.loading = false;

    state.hotels.unshift(
      action.payload
    );
  }
)

.addCase(
  addHotel.rejected,
  (state, action) => {
    state.loading = false;

    state.error =
      action.payload ||
      "Failed to add hotel";
  }
)

.addCase(
  editHotel.pending,
  (state) => {
    state.loading = true;
    state.error = null;
  }
)

.addCase(
  editHotel.fulfilled,
  (state, action) => {
    state.loading = false;

    const updatedHotel =
      action.payload;

    const index =
      state.hotels.findIndex(
        (hotel) =>
          hotel.id === updatedHotel.id
      );

    if (index !== -1) {
      state.hotels[index] =
        updatedHotel;
    }
  }
)

.addCase(
  editHotel.rejected,
  (state, action) => {
    state.loading = false;

    state.error =
      action.payload ||
      "Failed to update hotel";
  }
)
.addCase(
  fetchHotelById.pending,
  (state) => {
    state.loading = true;
    state.error = null;
    state.selectedHotel = null;
  }
)

.addCase(
  fetchHotelById.fulfilled,
  (state, action) => {
    state.loading = false;
    state.selectedHotel =
      action.payload;
  }
)

.addCase(
  fetchHotelById.rejected,
  (state, action) => {
    state.loading = false;
    state.error =
      action.payload ||
      "Failed to fetch hotel";
  }
);   
  },
});
export default hotelSlice.reducer;