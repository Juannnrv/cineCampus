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
const { join } = require("path");

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use(
  express.static(join(__dirname, "client/dist"), {
    setHeaders: (res, path) => {
      console.log(`Serving file: ${path}`);
    },
  })
);

Database.getInstance();

app.use("/login", authRoutes);
app.use("/users", userRoutes);
app.use(authenticate);
app.use("/movies", movieRoutes);
app.use("/tickets", movementRoutes);
app.use("/shows", showRoutes);

app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "client/dist", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});