var express = require('express');
var router = express.Router();
var upload = require("./multer");
var pool = require("./pool");
var jwt = require("jsonwebtoken")
var secretKey = "NobiThrill"
router.get("/login", function (req, res, next) {
  var result = { uid: "1111", name: "Nobita Nobi", city: "Tokiyo" }
  jwt.sign(result, secretKey, { expiresIn: "600s" }, (error, token) => {
    res.json({ token: token })
  })
})
function verifyToken(req, res, next) {
  var bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== undefined) {
    var token = bearerHeader.split(" ")
    req.token = token[1]
    console.log("ABABABABBABABABABABA",bearerHeader)
    next()
  }
  else {
    res.send("Invalid token...!");
  }
}
router.post('/submit_category', verifyToken, upload.single("picture"), function (req, res, next) {
  try {
    jwt.verify(req.token, secretKey, (err, authData) => {
      if (err) {
        res.json({ result: "Token Error" })
      }
      else {
        pool.query("insert into category (categoryname, picture) values(?,?)", [req.body.categoryname, req.file.filename], function (error, result) {
          if (error) {
            console.log(error)
            return res.status(500).json({ status: false, message: "Database Error, Plz Contact Database Admin!" })
          }
          else {
            return res.status(200).json({ status: true, message: "Category Submitted Successfully!" })

          }
        })
        console.log(authData)
      }
    })

  }
  catch (e) {
    console.log(e)
    return res.status(400).json({ status: false, message: "Server Error!" })
  }
});

router.get('/display_all_category', function (req, res, next) {
  try {
    pool.query("select * from category", function (error, result) {
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

router.post('/update_category', function (req, res, next) {
  try {
    pool.query("update category set categoryname=? where categoryid=?", [req.body.categoryname, req.body.categoryid], function (error, result) {
      if (error) {
        return res.status(500).json({ status: false, message: "Database Error, Plz Contact Database Admin!" })
      }
      else {
        return res.status(200).json({ status: true, message: "Category Updated Successfully!" })

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
    pool.query("update category set picture=? where categoryid=?", [req.file.filename, req.body.categoryid], function (error, result) {
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

router.post('/delete_category', function (req, res, next) {
  try {
    pool.query("delete from category where categoryid=?", [req.body.categoryid], function (error, result) {
      if (error) {
        return res.status(500).json({ status: false, message: "Database Error, Plz Contact Database Admin!" })
      }
      else {
        console.log("RRRRRRRR")
        return res.status(200).json({ status: true, message: "Category Deleted Successfully!" })

      }
    })
  }
  catch (e) {
    console.log("EEEEEEEEEEEEEEEEEEEEEEEE", e)
    return res.status(400).json({ status: false, message: "Connection Error!" })
  }
});
module.exports = router;
