const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const db_connection = require("./database/index");
require('dotenv').config();
var cors = require('cors');

const PORT = process.env.PORT || 3000;

const menuRoutes = require("./routes/menu");   
const appointmentRoutes = require("./routes/appointment");  
const doctorRoutes = require("./routes/doctor");  
const ResourceRoutes = require("./routes/resource"); 
const UserRoutes = require("./routes/user");   

const app = express();

app.use(cors()); 
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

db_connection();

app.use("/user", UserRoutes);
app.use("/menu", menuRoutes);   
app.use("/appointment", appointmentRoutes);   
app.use("/doctors", doctorRoutes);   
app.use("/resources", ResourceRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
