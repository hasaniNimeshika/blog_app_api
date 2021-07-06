const express = require('express');
const mongoose  = require("mongoose");
const bodyParser  = require('body-parser');
const doteenv = require("dotenv")
const cors  = require("cors");
const multer = require("multer");
const path = require("path");
const authRouter = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json()); 
app.use("/images", express.static(path.join(__dirname, "/images")));
// app.use(express.urlencoded())
app.use(bodyParser.json());

const URL = process.env.MONGODB_URL;

mongoose.connect(URL, {
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false


})

const connectin = mongoose.connection;
connectin.once('open',()=>{
    console.log("Mongob cnnection sucsee!");
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "images");
    },
    filename: (req, file, cb) => {
      cb(null, req.body.name);
    },
  });
  
  const upload = multer({ storage: storage });
  app.post("/api/upload", upload.single("file"), (req, res) => {
    res.status(200).json("File has been uploaded");
  });


app.use("/api/auth",authRouter);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

app.listen(PORT, ()=>{
    console.log(`Server is up and running port no: ${PORT}`);
})