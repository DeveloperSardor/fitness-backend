const { model, Schema, Types } = require("mongoose");

const MessageSchema = new Schema(
  {
    chat: {
      type: Types.ObjectId,
      ref: "Chats",
    },
    sender: {
      type: Types.ObjectId,
      ref: "Users",
    },
    message: {
      type: String,
    },
    file: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Messages", MessageSchema);
