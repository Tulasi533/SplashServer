const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Admin = Schema({
  adminid: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  college: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Admin", Admin);