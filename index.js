const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const stripe = require("stripe")(
  "sk_test_51L3GjVAjo3Oz9HwzW5UJ7bk7I5YLzM2WI7YgouCJRqEce2wzfGfFnglQAafOdS6w3RDy8WYmKb43j5X35eKmSuzb00NjtK5adh"
);
require("dotenv").config();
//middleware
app.use(cors());
app.use(express.json());

//mongodb
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://amazonAdmin:${process.env.DB_PASS}@cluster0.on3ec.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    client.connect();
    const orderCollection = client.db("amazon-store").collection("orders");
    // to get payment client secret
    app.post("/create-payment-intent", async (req, res) => {
      const order = req.body;
      const price = order.totalPrice;
      const amount = price * 100;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"],
      });
      res.send({ clientSecret: paymentIntent.client_secret });
    });
    //to post order
    app.post("/post-orders", async (req, res) => {
      const newOrder = req.body;
      const result = await orderCollection.insertMany(newOrder);
      res.send(result);
    });
    //to get orders
    app.get("/my-orders/:email", async (req, res) => {
      const orderer = req.params.email;
      const result = await orderCollection.find({ email: orderer }).toArray();
      res.send(result);
    });
  } finally {
  }
}
run();
app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.listen(port, () => {
  console.log("Port is connected");
});
