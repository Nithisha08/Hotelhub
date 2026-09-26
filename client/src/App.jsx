import { BrowserRouter, Routes, Route } from "react-router-dom";

import HotelList from "./pages/HotelList";
import HotelAddEdit from "./pages/HotelAddEdit";
import HotelDetail from "./pages/HotelDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HotelList />} />

        <Route path="/add" element={<HotelAddEdit />} />

        <Route
          path="/edit/:id"
          element={<HotelAddEdit />}
        />

        <Route
          path="/hotel/:id"
          element={<HotelDetail />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;