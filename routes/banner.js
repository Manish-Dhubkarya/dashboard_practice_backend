var express = require('express');
var router = express.Router();
var upload = require("./multer");
var pool = require("./pool");

router.post('/submit_banner', upload.any("banners"), function (req, res, next) {
  var filenames = req.files.map((file) => file.filename)
  try {
    pool.query("insert into banner (status, banners) values(?,?)", [req.body.status, filenames + ''], function (error, result) {
      if (error) {
        console.log(error)
        return res.status(500).json({ status: false, message: "Database Error, Plz Contact Database Admin!" })
      }
      else {
        return res.status(200).json({ status: true, message: "Banners Submitted Successfully!" })

      }
    })
  }
  catch (e) {
    console.log(e)
    return res.status(400).json({ status: false, message: "Server Error!" })
  }
});

router.get('/display_all_banners', function (req, res, next) {
  try {
    pool.query("select * from banner", function (error, result) {
      if (error) {
        return res.status(500).json({ status: false, message: "Server Error!" })
      }
      else {
        return res.status(200).json({ data: result, status: true, message: "Success!" })

      }
    })
  }
  catch (e) {
    console.log(e)
    return res.status(400).json({ status: false, message: "Connection Error!" })
  }
});

router.post('/delete_banners', function (req, res, next) {
  try {
    pool.query("delete from banner where bannerid=?", [req.body.bannerid], function (error, result) {
      if (error) {
        return res.status(500).json({ status: false, message: "Database Error, Plz Contact Database Admin!" })
      }
      else {
        console.log("RRRRRRRR")
        return res.status(200).json({ status: true, message: "Banners Deleted Successfully!" })

      }
    })
  }
  catch (e) {
    console.log("EEEEEEEEEEEEEEEEEEEEEEEE", e)
    return res.status(400).json({ status: false, message: "Connection Error!" })
  }
});
module.exports = router;
