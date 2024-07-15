const db = require("../dbconnection");
const jwt = require("jsonwebtoken");

// get Me data
// 토큰 내 id값으로 유저의 정보를 가져다주는 코드에요
module.exports.getMe = (req, res) => {
  const token = req.headers.authorization.split(' ')[1]; // "Bearer eYj..." 형식의 헤더에서 토큰값만 추출해요

  if (!token) {
    res.send({
      status: false,
      msg: "No token",
    });

    return;
  }

  const decoded = jwt.verify(token, "privatekey");
  const userIdx = decoded.idx;

  let chkId = `SELECT * FROM users WHERE user_idx = ?`;
  db.query(chkId, [userIdx], (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      res.send({
        status: true,
        user: {
          idx: result[0].user_idx,
          id: result[0].user_id,
          name: result[0].user_name,
          email: result[0].user_email,
        },
      });
    } else {
      res.send({
        status: false,
        msg: "Invalid token",
      });
    }
  });
}

// Get user by user_idx
module.exports.getUserById = (req, res) => {
  const userIdx = req.params.user_idx;

  if (!userIdx) {
    res.send({
      status: false,
      msg: "user_idx is required",
    });

    return;
  }

  let chkId = `SELECT * FROM users WHERE user_idx = ?`;
  db.query(chkId, [userIdx], (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      res.send({
        status: true,
        user: {
          idx: result[0].user_idx,
          id: result[0].user_id,
          name: result[0].user_name,
          email: result[0].user_email,
        },
      });
    } else {
      res.send({
        status: false,
        msg: "User not found",
      });
    }
  });
}

module.exports.getLikesByUser = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "privatekey");
  const user_idx = decoded.idx;

  if (!user_idx) {
    res.send({
      status: false,
      msg: "user_idx is required",
    });

    return;
  }

  let selectqry = `SELECT * FROM likes WHERE user_idx = ?`;
  db.query(selectqry, [user_idx], (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      res.send({
        status: true,
        videos: result,
      });
    } else {
      res.send({
        status: false,
        msg: "No likes found for this user",
      });
    }
  });
}
