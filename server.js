const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const auth = require("./util/auth");
const cors = require('cors')
const path = require("path");
const express = require("express");

// multer
const multer = require("multer");
const app = express();
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images"); //slider
  },
  filename: (req, file, cb) => {
    cb(null, Date.now()  + path.extname(file.originalname));
  },
});
app.use(cors({credentials: true}))
app.use(express.static(__dirname + '/images'));
app.use('/images', express.static(__dirname + '/images'));
app.get("/images", (req, res) => { });
app.use(express.static(__dirname + '/slider'));
app.use('/slider', express.static(__dirname + '/slider'));

app.get('/', function(request,response){
  response.sendFile(__dirname + '/index.html')
});

const upload = multer({ storage: fileStorage}).single('file');

app.post('/single', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.sendStatus(500);
    }
    res.send(JSON.stringify({ image: req.file.filename}));
  });
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true
});

mongoose.set("useFindAndModify", false);
mongoose.set('useCreateIndex', true);
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Mongodb connected successfully");
    return server.listen(process.env.PORT);
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  });
