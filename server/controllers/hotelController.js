const pool = require("../db/database");
const fs = require("fs");
const path = require("path");
const getHotels = async (req, res) => {
  try {
    const {title,minPrice,maxPrice,offset = 0,limit = 6,} = req.query;
    const conditions = [];
    const values = [];
    if (title && title.trim() !== "") {
      values.push(`%${title.trim()}%`);
      conditions.push(
        `title ILIKE $${values.length}`
      );
    }
    if (minPrice !== undefined && minPrice !== "") {
      values.push(Number(minPrice));

      conditions.push(
        `price >= $${values.length}`
      );
    }
    if (maxPrice !== undefined && maxPrice !== "") {
      values.push(Number(maxPrice));
      conditions.push(
        `price <= $${values.length}`
      );
    }
    const whereClause =
      conditions.length > 0
        ? `WHERE ${conditions.join(" AND ")}`
        : "";
    const parsedOffset = Math.max(
      Number(offset) || 0,
      0
    );
    const parsedLimit = Math.min(
      Math.max(Number(limit) || 6, 1),
      100
    );
    const countQuery = `
      SELECT COUNT(*)
      FROM hotels
      ${whereClause}
    `;
    const countResult = await pool.query(
      countQuery,
      values
    );
    const total = Number(
      countResult.rows[0].count
    );
    const limitPlaceholder =
      values.length + 1;
    const offsetPlaceholder =
      values.length + 2;
    const hotelsQuery = `
      SELECT *
      FROM hotels
      ${whereClause}
      ORDER BY id DESC
      LIMIT $${limitPlaceholder}
      OFFSET $${offsetPlaceholder}
    `;
    const hotelsValues = [
      ...values,
      parsedLimit,
      parsedOffset,
    ];
    const result = await pool.query(hotelsQuery,hotelsValues);
    res.status(200).json({
      data: result.rows,

      pagination: {total,offset: parsedOffset,limit: parsedLimit,totalPages: Math.ceil( total / parsedLimit),},
    });
  } catch (error) {
    console.error(
      "Error fetching hotels:",
      error
    );
    res.status(500).json({
      message: "Failed to fetch hotels",
    });
  }
};
const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM hotels WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Hotel not found",
      });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching hotel:", error);

    res.status(500).json({
      message: "Failed to fetch hotel",
    });
  }
};
const createHotel = async (req, res) => {
  try {
    const {
      title,
      description,
      latitude,
      longitude,
      price,
    } = req.body;
    console.log({
  title,
  description,
  latitude,
  longitude,
  price,
  image: req.file,
});
    if (!req.file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }
    if (
      !title ||
      !description ||
      latitude === undefined ||
      longitude === undefined ||
      price === undefined
    ) {
      return res.status(400).json({
        message: "All hotel fields are required",
      });
    }
    const imagePath = `/uploads/${req.file.filename}`;
    const result = await pool.query(
      `INSERT INTO hotels
       (image, title, description, latitude, longitude, price)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        imagePath,
        title,
        description,
        latitude,
        longitude,
        price,
      ]
    );
    res.status(201).json({
      message: "Hotel created successfully",
      hotel: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating hotel:", error);
    res.status(500).json({
      message: "Failed to create hotel",
    });
  }
};
const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      latitude,
      longitude,
      price,
    } = req.body;
    if (
      !title ||
      !description ||
      latitude === undefined ||
      longitude === undefined ||
      price === undefined
    ) {
      return res.status(400).json({
        message: "All hotel fields except image are required",
      });
    }

    // First find the existing hotel
    const existingHotel = await pool.query(
      "SELECT * FROM hotels WHERE id = $1",
      [id]
    );

    if (existingHotel.rows.length === 0) {
      return res.status(404).json({
        message: "Hotel not found",
      });
    }

    const oldHotel = existingHotel.rows[0];

    // CASE 1: New image uploaded
    if (req.file) {
      const newImagePath = `/uploads/${req.file.filename}`;

      // Update database with new image
      const result = await pool.query(
        `UPDATE hotels
         SET image = $1,
             title = $2,
             description = $3,
             latitude = $4,
             longitude = $5,
             price = $6,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $7
         RETURNING *`,
        [
          newImagePath,
          title,
          description,
          latitude,
          longitude,
          price,
          id,
        ]
      );

      // Delete old local image
      if (oldHotel.image) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          oldHotel.image.replace("/uploads/", "uploads/")
        );

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      return res.status(200).json({
        message: "Hotel updated successfully with new image",
        hotel: result.rows[0],
      });
    }

    // CASE 2: No new image
    const result = await pool.query(
      `UPDATE hotels
       SET title = $1,
           description = $2,
           latitude = $3,
           longitude = $4,
           price = $5,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [
        title,
        description,
        latitude,
        longitude,
        price,
        id,
      ]
    );

    res.status(200).json({
      message: "Hotel updated successfully",
      hotel: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating hotel:", error);

    res.status(500).json({
      message: "Failed to update hotel",
    });
  }
};
const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;

    // First find the hotel
    const existingHotel = await pool.query(
      "SELECT * FROM hotels WHERE id = $1",
      [id]
    );

    if (existingHotel.rows.length === 0) {
      return res.status(404).json({
        message: "Hotel not found",
      });
    }

    const hotel = existingHotel.rows[0];

    // Delete hotel from database
    const result = await pool.query(
      "DELETE FROM hotels WHERE id = $1 RETURNING *",
      [id]
    );

    // Delete associated image
    if (hotel.image) {
      const imagePath = path.join(
        __dirname,
        "..",
        hotel.image.replace("/uploads/", "uploads/")
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.status(200).json({
      message: "Hotel deleted successfully",
      hotel: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting hotel:", error);

    res.status(500).json({
      message: "Failed to delete hotel",
    });
  }
};

module.exports = {
  getHotels,
    getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
};