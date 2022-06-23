const express = require("express");
const { default: helmet } = require("helmet");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require('path');
const dotenv = require('dotenv');


const userRouter = require("./routes/user.routes");
const authRouter = require("./routes/auth.routes");
const postRouter = require('./routes/post.routes');

const app = express();
dotenv.config();
app.use(cors());

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const config = require("./config/config");
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});


mongoose.connect(config.mongoUri, { useNewUrlParser: true },function (err) {
    if (err) {
        throw new Error("Unable to connect to mongodb", config.mongoUri)
    }
    console.log("connected to mongodb");
})






app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,'public')))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
// app.use(
//     helmet.contentSecurityPolicy({
//       useDefaults: true,
//       directives: {
//         "img-src": ["'self'", "https: data:"]
//       }
//     })
//   )
app.use(morgan("dev"))

// assign io to req.io
app.use(function (req, res, next) {
    req.io = io;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
})

////////// routes ////////////
app.use("/", userRouter);
app.use("/", authRouter);
app.use("/", postRouter)


// ----------------- deployment --------------//

__dirname = path.resolve();
if (process.env.NODE_ENV == "production") {
    app.use(express.static(path.join(__dirname, "/frontend/build")))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    })
} else {
    app.get("/", (req, res) => {
        res.send('API is running')
    })
}

// ----------------- deployment --------------//


// not found error
app.use(function (req, res) {
    return res.status(404).json({
        error: true,
        message: "the route: (" + req.url + ") is not found"
    })
})
// error middleware
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({
            error: true,
            type: "authError",
            message: err.name + ": " + err.message || 'Something went wrong'
        })
    } else if (err) {
        res.status(400).json({
            error: true,
            message: err.name + ": " + err.message || 'Something went wrong'
        })
        console.log(err)
    }
});

server.listen(config.port, function (err) {
    if (err) {
        console.log(err);
    }
    console.info("Server is running on port: ", config.port)
});
