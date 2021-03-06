const express = require("express");
const config = require("../config");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");
const middleware = require("../middleware");
const multer = require("multer");
const path = require("path");


const router = express.Router();


//multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, req.decoded.adminid+ ".jpg");
  }
});
  
const fileFilter = (req, file, cb) => {
  if(file.mimetype == "image/jpeg" || IdleDeadline.mimetype == "image/png") {
    cb(null, true);
  }
  else{
    cb(null, false);
  }
}
  
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 6,
  },
  // fileFilter: fileFilter
});
  
router
.route("/add/image")
.patch(middleware.checkToken, upload.single("img"), (req, res) =>{
  Admin.findOneAndUpdate(
    {adminid: req.decoded.adminid},
    {
      $set: {
        img: req.file.path,
      },
    },
    {new: true},
    (err, result) => {
      if(err) return res.status(500).send(err);
      const response = {
        message: "image added successfully updated",
        data: result,
      };
      return res.status(200).send(response);
    }
  );
});
  

router.route("/login").post((req, res) => {
  Admin.findOne({ adminid: req.body.adminid }, (err, result) => {
    if (err) return res.status(500).json({ msg: err });
    if (result === null) {
      return res.status(403).json("Admin ID incorrect");
    }
    if (result.password === req.body.password) {
      // here we implement the JWT token functionality
      let token = jwt.sign({adminid: req.body.adminid}, config.key, {
        //expiresIn: "24h" // expires in 24 hours
      });
      res.json({
        token: token,
        msg: "success",
        type: "admin"
      });
    } else {
      res.status(403).json("password is incorrect");
    }
  });
});

router.route("/register").post((req, res) => {
  console.log("inside the register");
  const admin = new Admin({
    adminid: req.body.adminid,
    name: req.body.name,
    password: req.body.password,
    mobile: req.body.mobile,
    email: req.body.email,
    college: req.body.college
  });
  admin
    .save()
    .then(() => {
        console.log("Admin data added");
        res.status(200).json("ok");
    })
    .catch((err) => {
        res.status(403).json({ msg: err });
    });
});

router.route("/update/:adminid").patch((req, res) => {
  console.log(req.params.adminid);
  Admin.findOneAndUpdate(
    { adminid: req.params.adminid },
    { $set: { password: req.body.password } },
    (err, result) => {
      if (err) return res.status(500).json({ msg: err });
      if(result == null) return res.status(403).json("Admin ID not present");
      if (result != null) {
          console.log(result);
          const msg = {
          msg: "password successfully updated",
          adminid: req.params.adminid,
          };
          return res.json(msg);
      }
      else{
          return res.status(403).json("Something went wrong");
      }
    }
  );
});

router.route("/getData").get(middleware.checkToken, (req,res)=>{
  Admin.findOne({adminid: req.decoded.adminid}, (err, result) =>{
    if(err) return res.json({err: err});
    if(result == null) return res.json({data: []})
    else return res.json({data: result});
  });
});

module.exports = router;