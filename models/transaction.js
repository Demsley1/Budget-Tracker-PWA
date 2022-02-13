const { Schema, model } = require("mongoose");

const transactionSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      minlength: [3, "Please enter a name for this transaction"]
    },
    value: {
      type: Number,
      required: "Enter an amount"
    },
    date: {
      type: Date,
      default: Date.now
    }
  }
);

const Transaction = model("Transaction", transactionSchema);

module.exports = Transaction;
