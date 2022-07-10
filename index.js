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

app.get("/", (req, res) => {
  res.send("Backend is running");
});

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

app.listen(port, () => {
  console.log("Port is connected");
});
