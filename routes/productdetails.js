var express = require('express');
var router = express.Router();
var upload = require("./multer");
var pool = require("./pool");

router.post('/submit_productdetails', upload.any("pictures"), function (req, res, next) {
  //for upload multiple images
  var filenames = req.files.map((file, index) => file.filename)
  try {
    pool.query("insert into productdetail (categoryid, brandid, productid, modelno, hsncode, description, color, price, offerprice, stock, status, pictures) values(?,?,?,?,?,?,?,?,?,?,?,?)", [req.body.categoryid, req.body.brandid, req.body.productid, req.body.modelno, req.body.hsncode, req.body.description, req.body.color, req.body.price, req.body.offerprice, req.body.stock, req.body.status, filenames + ""], function (error, result) {
      if (error) {
        return res.status(500).json({ status: false, message: "Database Error, Plz Contact Database Admin!" })
      }
      else {
        return res.status(200).json({ status: true, message: "Product Details Submitted Successfully!" })

      }
    })
  }
  catch (e) {
    console.log(e)
    return res.status(400).json({ status: false, message: "Server Error!" })
  }
});

router.get('/display_all_productdetails', function (req, res, next) {
  try {
    //very very important query to fetch data from foreign-key table.
    pool.query("select PD.*, (select C.categoryname from category C where C.categoryid=PD.categoryid) as categoryname, (select B.brandname from brand B where B.brandid=PD.brandid) as brandname, (select P.productname from product P where P.productid=PD.productid) as productname from productdetail PD", function (error, result) {
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

router.post('/update_productdetails', upload.any("pictures"), function (req, res, next) {
  var filenames = req.files.map((file, index) => file.filename)
  try {
    pool.query("update productdetail set categoryid=?, brandid=?, productid=?, modelno=?, hsncode=?, description=?, color=?, price=?, offerprice=?, stock=?, status=?, pictures=? where productdetailid=?", [req.body.categoryid, req.body.brandid, req.body.productid, req.body.modelno, req.body.hsncode, req.body.description, req.body.color, req.body.price, req.body.offerprice, req.body.stock, req.body.status, filenames + "", req.body.productdetailid], function (error, result) {
      if (error) {
        return res.status(500).json({ status: false, message: "Database Error, Plz Contact Database Admin!" })
      }
      else {
        return res.status(200).json({ status: true, message: "Product Details Updated Successfully!" })

      }
    })
  }
  catch (e) {
    console.log(e)
    return res.status(400).json({ status: false, message: "Connection Error!" })
  }
});

router.post('/delete_productdetails', function (req, res, next) {
  try {
    pool.query("delete from productdetail where productdetailid=?", [req.body.productdetailid], function (error, result) {
      if (error) {
        return res.status(500).json({ status: false, message: "Database Error, Plz Contact Database Admin!" })
      }
      else {
        console.log("RRRRRRRR")
        return res.status(200).json({ status: true, message: "Product Details Deleted Successfully!" })

      }
    })
  }
  catch (e) {
    console.log("EEEEEEEEEEEEEEEEEEEEEEEE", e)
    return res.status(400).json({ status: false, message: "Connection Error!" })
  }
});

module.exports = router;