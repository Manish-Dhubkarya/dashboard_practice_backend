var express = require('express');
var router = express.Router();
var upload = require("./multer");
var pool = require("./pool");

router.post('/submit_product', upload.single("picture"), function (req, res, next) {
  try {
    pool.query("insert into product (categoryid, brandid, productname, status, picture) values(?,?,?,?,?)", [req.body.categoryid, req.body.brandid, req.body.productname, req.body.status, req.file.filename], function (error, result) {
      if (error) {
        return res.status(500).json({ status: false, message: "Database Error, Plz Contact Database Admin!" })
      }
      else {
        return res.status(200).json({ status: true, message: "Product Submitted Successfully!" })

      }
    })
  }
  catch (e) {
    console.log(e)
    return res.status(400).json({ status: false, message: "Server Error!" })
  }
});

router.get('/display_all_products', function (req, res, next) {
  try {
    //very very important query to fetch data from foreign-key table.
    pool.query("select P.*, (select C.categoryname from category C where C.categoryid=P.categoryid) as categoryname, (select B.brandname from brand B where B.brandid=P.brandid) as brandname from product P", function (error, result) {
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

router.post('/update_product', function (req, res, next) {
  try {
    pool.query("update product set categoryid=?, brandid=?, productname=?, status=? where productid=?", [req.body.categoryid, req.body.brandid, req.body.productname, req.body.status, req.body.productid], function (error, result) {
      if (error) {
        return res.status(500).json({ status: false, message: "Database Error, Plz Contact Database Admin!" })
      }
      else {
        return res.status(200).json({ status: true, message: "Product Updated Successfully!" })

      }
    })
  }
  catch (e) {
    console.log(e)
    return res.status(400).json({ status: false, message: "Connection Error!" })
  }
});

router.post('/update_picture', upload.single("picture"), function (req, res, next) {
  try {
    pool.query("update product set picture=? where productid=?", [req.file.filename, req.body.productid], function (error, result) {
      if (error) {
        return res.status(500).json({ status: false, message: "Database Error, Plz Contact Database Admin!" })
      }
      else {
        return res.status(200).json({ status: true, message: "Picture Updated Successfully!" })

      }
    })
  }
  catch (e) {
    console.log("EEEEEEEEEEEEEEEEEEEEEEEE", e)
    return res.status(400).json({ status: false, message: "Connection Error!" })
  }
});

router.post('/delete_product', function (req, res, next) {
  try {
    pool.query("delete from product where productid=?", [req.body.productid], function (error, result) {
      if (error) {
        return res.status(500).json({ status: false, message: "Database Error, Plz Contact Database Admin!" })
      }
      else {
        console.log("RRRRRRRR")
        return res.status(200).json({ status: true, message: "Product Deleted Successfully!" })

      }
    })
  }
  catch (e) {
    console.log("EEEEEEEEEEEEEEEEEEEEEEEE", e)
    return res.status(400).json({ status: false, message: "Connection Error!" })
  }
});


router.post('/display_all_products_by_brandid', function (req, res, next) {
  try {
    pool.query("select * from product where categoryid=? and brandid=?", [req.body.categoryid, req.body.brandid], function (error, result) {
      if (error) {
        return res.status(500).json({ status: false, message: "Server Error!" })
      }
      else {
        // console.log("SSSSSSSSS", JSON.stringify(result))
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
