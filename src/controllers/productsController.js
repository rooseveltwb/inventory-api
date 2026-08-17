const pool = require("../db/pool");

const getAllProducts = async (req, res) => {
  const result = await pool.query("SELECT * FROM products");

  res.json(result.rows);
};

const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Something went wrong.",
    });
  }
};

const createProduct = async (req, res) => {
  const { name, price, category } = req.body;

  // Validation
  if (!name) {
    return res.status(400).json({
      error: "Name is required",
    });
  }

  if (price <= 0) {
    return res.status(400).json({
      error: "Price must be greater than 0",
    });
  }

  if (!category) {
    return res.status(400).json({
      error: "Category is required",
    });
  }

  try {
    const result = await pool.query(
      "INSERT INTO products (name, price, category) VALUES ($1, $2, $3) RETURNING *",
      [name, price, category]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Something went wrong.",
    });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, category } = req.body;

  // Validation
  if (!name) {
    return res.status(400).json({
      error: "Name is required",
    });
  }

  if (price <= 0) {
    return res.status(400).json({
      error: "Price must be greater than 0",
    });
  }

  if (!category) {
    return res.status(400).json({
      error: "Category is required",
    });
  }

  try {
    const result = await pool.query(
      `UPDATE products
       SET name = $1,
           price = $2,
           category = $3
       WHERE id = $4
       RETURNING *`,
      [name, price, category, id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Something went wrong.",
    });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Something went wrong.",
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};