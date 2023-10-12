const { model, Schema, Types } = require("mongoose");

const ChatSchema = new Schema(
  {
    members: [
      {
        type: Types.ObjectId,
        ref: "Users",
      },
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = model("Chats", ChatSchema);
