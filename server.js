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
const cookieParser = require("cookie-parser");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

Database.getInstance();

app.use("/login", authRoutes);
app.use("/users", userRoutes);

app.use(authenticate);

app.use("/movies", movieRoutes);
app.use("/tickets", movementRoutes);
app.use("/shows", showRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
