const express = require("express");
const cors = require("cors");
const Database = require("./server/utils/db");
const app = express();
const movieRoutes = require("./server/routes/movieRoutes");
const movementRoutes = require("./server/routes/movementRoutes");
const showRoutes = require("./server/routes/showRoutes");

app.use(cors());
app.use(express.json());

Database.getInstance();

app.use('/movies', movieRoutes);
app.use('/tickets', movementRoutes);
app.use('/shows', showRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});