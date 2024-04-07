var express = require('express');
var router = express.Router();
var upload = require("./multer");
var pool = require("./pool");

router.post('/submit_brand', upload.single("logo"), function (req, res, next) {
  try {
    pool.query("insert into brand (categoryid, brandname, status, logo) values(?,?,?,?)", [req.body.categoryid, req.body.brandname, req.body.status, req.file.filename], function (error, result) {
      if (error) {
        return res.status(500).json({ status: false, message: "Database Error, Plz Contact Database Admin!" })
      }
      else {
        return res.status(200).json({ status: true, message: "Brand Submitted Successfully!" })

      }
    })
  }
  catch (e) {
    console.log(e)
    return res.status(400).json({ status: false, message: "Server Error!" })
  }
});

router.get('/display_all_brands', function (req, res, next) {
  try {
    //very very important query to fetch data from foreign-key table.
    pool.query("select B.*, (select C.categoryname from category C where C.categoryid=B.categoryid) as categoryname from brand B", function (error, result) {
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

router.post('/update_brand', function (req, res, next) {
  try {
    pool.query("update brand set categoryid=?, brandname=?, status=? where brandid=?", [req.body.categoryid, req.body.brandname, req.body.status, req.body.brandid], function (error, result) {
      if (error) {
        return res.status(500).json({ status: false, message: "Database Error, Plz Contact Database Admin!" })
      }
      else {
        return res.status(200).json({ status: true, message: "Brand Updated Successfully!" })

      }
    })
  }
  catch (e) {
    console.log(e)
    return res.status(400).json({ status: false, message: "Connection Error!" })
  }
});

router.post('/update_logo', upload.single("logo"), function (req, res, next) {
  try {
    pool.query("update brand set logo=? where brandid=?", [req.file.filename, req.body.brandid], function (error, result) {
      if (error) {
        return res.status(500).json({ status: false, message: "Database Error, Plz Contact Database Admin!" })
      }
      else {
        return res.status(200).json({ status: true, message: "Logo Updated Successfully!" })

      }
    })
  }
  catch (e) {
    console.log("EEEEEEEEEEEEEEEEEEEEEEEE", e)
    return res.status(400).json({ status: false, message: "Connection Error!" })
  }
});

router.post('/delete_brand', function (req, res, next) {
  try {
    pool.query("delete from brand where brandid=?", [req.body.brandid], function (error, result) {
      if (error) {
        return res.status(500).json({ status: false, message: "Database Error, Plz Contact Database Admin!" })
      }
      else {
        console.log("RRRRRRRR")
        return res.status(200).json({ status: true, message: "Brand Deleted Successfully!" })

      }
    })
  }
  catch (e) {
    console.log("EEEEEEEEEEEEEEEEEEEEEEEE", e)
    return res.status(400).json({ status: false, message: "Connection Error!" })
  }
});

//for fetch particular brands on behalf of category
router.post('/display_all_brands_by_categoryid', function (req, res, next) {
  try {
    //very very important query to fetch data from foreign-key table.
    pool.query("select B.*, (select C.categoryname from category C where C.categoryid=B.categoryid) as categoryname from brand B where categoryid=?", [req.body.categoryid], function (error, result) {
      if (error) {
        return res.status(500).json({ status: false, message: "Server Error!" })
      }
      else {
        console.log("SSSSSSSSS", JSON.stringify(result))
        return res.status(200).json({ data: result, status: true, message: "Success!" })

      }
    })
  }
  catch (e) {
    console.log(e)
    return res.status(400).json({ status: false, message: "Connection Error!" })
  }
});

module.exports = router