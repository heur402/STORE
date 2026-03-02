import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

});

const Order = mongoose.model("Product", orderSchema);
export default Order;