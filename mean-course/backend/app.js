const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const postRoutes = require('./routes/posts');
const app = express();



//mongoose.connect("mongodb+srv://test:f3JN5poiAlEQzHS8@cluster0-fm7pk.mongodb.net/node-angular?retryWrites=true&w=majority")
mongoose.connect('mongodb://localhost/node-angular', {useNewUrlParser: true})
.then(()=>{
  console.log('connected to database');
})
.catch(()=>{
  console.log('connection failed');
})
//f3JN5poiAlEQzHS8
app.use((bodyParser.json()));
//app.use((bodyParser.urlencoded({extended: false})));//

app.use("/images", express.static(path.join("backend/images")));
//app.use("/images", express.static(path.join("backend/images")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts",postRoutes);

module.exports = app;
