var Express = require("express");
var Mongoclient = require("mongodb").MongoClient;
var cors = require("cors");
var bodyParser = require("body-parser");
const { ObjectId } = require("mongodb");

var app = Express();
app.use(cors());
app.use(bodyParser.json());

var CONNECTION_STRING =
  "mongodb+srv://shaulc:admin1234@cluster0.ywdnz4v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

var DATABASENAME = "store";
const client = new Mongoclient(CONNECTION_STRING);

// The server runs on localhost:5038 (port 5038)
app.listen(5038, () => {
  console.log("port 5038 initalized");
  async function connect() {
    try {
      await client.connect();
      database = client.db("store");
    } catch (error) {
      console.log(error);
    } finally {
      // fix here
      await client.db(DATABASENAME).command({ ping: 1 });
      console.log(
        "Pinged your deployment. You successfully connected to MongoDB!"
      );
    }
  }
  connect();
});

// #### API METHODS ####

app.get("/api/store/GetItems", (request, response) => {
  console.log("retrieving data....");

  const cursor = client.db(DATABASENAME).collection("items").find({});
  var arr = [];
  async function run() {
    for await (const item of cursor) {
      console.log(item);
      arr.push(item);
    }
    response.send(arr);
  }
  run();
});

app.post("/api/store/AddItem", (request, response) => {
  const cursor = client.db(DATABASENAME).collection("items");
  async function run() {
    try {
      const result = await cursor.insertOne(request.body.newItem);
      //   await cursor.insertOne({ id: 111111, name: "grapes" });
      response.send(result);
    } catch (error) {
      console.log(error);
      response.send("error");
    }
  }
  run();
});
app.post("/api/store/deleteItem", (request, response) => {
  const cursor = client.db(DATABASENAME).collection("items");
  async function run() {
    try {
      await cursor.deleteOne({
        _id: ObjectId.createFromHexString(request.body._id),
      });
      //   await cursor.deleteOne({ id: 111111 });
      response.send("success");
    } catch (error) {
      console.log(error);
      response.send("error");
    }
  }
  run();
});
app.post("/api/store/editItem", (request, response) => {
  console.log("editing item...");
  console.log(request.body._id);

  const cursor = client.db(DATABASENAME).collection("items");
  async function run() {
    console.log(request.body._id);
    try {
      await cursor.updateOne(
        { _id: ObjectId.createFromHexString(request.body._id) },
        { $set: request.body.updatedItem }
        // );
        //   await cursor.updateOne(
        //     { name: "orange" },
        //     { $set: { name: "watermalon" } }
      );
      response.send("success");
    } catch (error) {
      console.log(error);
      response.send("error");
    }
  }
  run();
});
app.post("/api/store/searchItem", (request, response) => {
  console.log("searching item...");
  const cursor = client
    .db(DATABASENAME)
    .collection("items")
    .find({ name: { $regex: request.body.name } });
  async function run() {
    console.log(request.body.name);
    try {
      const arr = [];
      for await (const item of cursor) {
        console.log(item);
        arr.push(item);
      }
      response.send(arr);
    } catch (error) {
      console.log(error);
      response.send("error");
    }
  }
  run();
});
