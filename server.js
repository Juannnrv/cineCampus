const express = require("express");
const cors = require("cors");
const Database = require("./server/utils/db");
const app = express();
const movieRoutes = require("./server/routes/movieRoutes");
const movementRoutes = require("./server/routes/movementRoutes");

app.use(cors());
app.use(express.json());

Database.getInstance();

app.use('/movies', movieRoutes);
app.use('/tickets', movementRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});