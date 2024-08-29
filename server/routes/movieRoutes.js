
const express = require("express");
const { findAllMovies, findOneMovie } = require("../controllers/movieController");
const router = express.Router();

router.get("/v1", findAllMovies);
router.get("/v1/:id", findOneMovie);

module.exports = router;
