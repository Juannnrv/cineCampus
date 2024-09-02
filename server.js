const express = require("express");
const cors = require("cors");
const Database = require("./server/utils/db");
const app = express();
const movieRoutes = require("./server/routes/movieRoutes");
const movementRoutes = require("./server/routes/movementRoutes");
const showRoutes = require("./server/routes/showRoutes");
const userRoutes = require("./server/routes/userRoutes");
const authRoutes = require("./server/routes/authRoutes");
const authenticate = require("./server/middleware/authMiddleware");

app.use(cors());
app.use(express.json());

Database.getInstance();

app.use('/login', authRoutes);

app.use(authenticate);
app.use('/movies', movieRoutes);
app.use('/tickets', movementRoutes);
app.use('/shows', showRoutes);
app.use('/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});