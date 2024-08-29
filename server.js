const express = require("express");
const cors = require("cors");
const Database = require("./server/utils/db");
const app = express();
const movieRoutes = require("./server/routes/movieRoutes");

app.use(cors());
app.use(express.json());

Database.getInstance();

app.use('/movies', movieRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});