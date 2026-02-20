require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const router = require("./routes/Router.js");
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Upload files
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

//DB Connection
//const db = require("./config/firebase.js");

//Routes
app.use(router);

//Middleware de Tratamento de Erros Global:
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ errors: [err.message] });
});

app.listen(port, () => {
  console.log(`🚀 Server run in http://localhost:${port}`);
});

module.exports = app;
