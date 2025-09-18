const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"   // 👈 reference User model
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"user"
  
  },
  status: {
    type: String,
    enum: {
      values: ["accepte", "rejecte", "sent"],
      message: `{VALUE} is not valid status`
    }
  }
});

module.exports = mongoose.model("connection", connectionSchema);
