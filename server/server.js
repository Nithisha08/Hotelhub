const express = require("express");
const cors = require("cors");
const pool = require("./db/database");
const hotelRoutes = require("./routes/hotelRoutes");
const app = express();
const path = require("path");
app.use(cors());
app.use(express.json());
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);
app.use("/api/hotels", hotelRoutes);
app.get("/", (req, res) => {
  res.send("Hotel List API is running");
});

app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM hotels");
    
    res.json({
      message: "Database connected successfully",
       hotels: result.rows,
    });
  } catch (error) {
    console.error("Database connection error:", error);
    
    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});