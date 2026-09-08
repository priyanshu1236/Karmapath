const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use("/uploads",express.static("uploads"));
const uploadRoutes = require("./routes/uploadRoutes");

app.use("/",uploadRoutes);

app.listen(8000);

