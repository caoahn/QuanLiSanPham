const express = require("express");
const path = require("path");
const { Server } = require("socket.io");
const http = require("http");
const app = express();

const moment = require("moment");

//Load env
require("dotenv").config();
const methodOverride = require("method-override");
const bodyParser = require("body-parser");

// flash
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");

app.use(cookieParser("123456"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

//Port
const port = process.env.PORT;

app.use(methodOverride("_method"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//Set up Pug
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

const systemConfig = require("./config/system.js");

//SOcket.io
const server = http.createServer(app);
const io = new Server(server);
global._io = io;

// io.on("connection", (socket) => {
//   console.log("a user connected", socket.id);
// });

// variable global
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.locals.moment = moment;

//Set up body-parser
app.use(express.static(`${__dirname}/public`));
const route = require("./routes/client/index.route"); // route client
const routeAdmin = require("./routes/admin/index.route"); // route admin

//Connect to MongoDB
const database = require("./config/database");
database.connect();

//tinyMce
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);

//Routes
route(app);
routeAdmin(app);

app.get("*", (req, res) => {
  res.render("client/pages/errors/404", {
    pageTitle: "404",
  });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
