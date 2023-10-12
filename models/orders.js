const { model, Schema, Types } = require("mongoose");

const OrderSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "Users",
    },
    products: [
      {
        count: Number,
        product: {
          type: Types.ObjectId,
          ref: "Products",
        },
      },
    ],
    totalSum: {
      type: Number,
    },
    isReached: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Orders", OrderSchema);

