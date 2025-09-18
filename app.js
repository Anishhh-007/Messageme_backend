const connectDB = require("./config/database-connection");
const express = require("express")
const userRouter = require("./routes/userRouter")
const chatRouter = require("./routes/chatRouter")
const searchRouter = require("./routes/searchRouter")
const connectionRouter = require("./routes/connectionRouter")
const cp = require("cookie-parser")
const cors = require("cors")
const http = require("http")
const config = require("config");
const initialiseSocket = require("./utils/socket");
const app = express()

const server = http.createServer(app)


app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cp())
app.use(cors({
    origin: ["http://localhost:5173", "http://3.88.142.205"], // add your server IP or domain
    credentials: true
}));


app.use("/user" , userRouter)
app.use("/chat" , chatRouter)
app.use("/search" , searchRouter)
app.use("/connection" , connectionRouter)


initialiseSocket(server)

connectDB().then(() =>{
   server.listen(`${config.get("PORT")}`, () => {
        console.log("App running on the port 8000");
    })
}).catch((err) => {
    console.log("ERROR : " + err.message);
})