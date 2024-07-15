const db = require("../dbconnection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.home = (_, res) => {
  // 안쓰는 값은 _ 로 생략할 수 있어요
  res.send("api working ...");
};

// 회원가입
module.exports.signup = async (req, res) => {
  console.log(req.body, "data##");
  const { name, email, id, password } = req.body;

  // first check email id already exist
  let emailchkqry = `SELECT user_email FROM users WHERE user_email = ?`;
  db.query(emailchkqry, [email], async (err, result) => {
    if (err) throw err;

    // check email id already exists
    if (result.length > 0) {
      res.send({
        status: false,
        msg: "email already exists",
      });
    } else {
      // password encrypt
      const encryptedPwd = await bcrypt.hash(password, 10);

      // insert data
      let insertqry = `INSERT INTO users (user_name, user_email, user_id, user_pw) VALUES (?, ?, ?, ?)`;
      db.query(insertqry, [name, email, id, encryptedPwd], (err, result) => {
        if (err) throw err;

        res.send({
          status: true,
          msg: "user register successful",
        });
      });
    }
  });
};

// 로그인
module.exports.login = async (req, res) => {
  console.log(req.body, "login");
  const { id, password } = req.body;

  // check id, password
  let chkId = `SELECT * FROM users WHERE user_id = ?`;
  db.query(chkId, [id], async (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      // check password
      const match = await bcrypt.compare(password, result[0].user_pw);

      console.log(result[0].user_idx);

      if (match) {
        // 토큰 구별을 위해 유저의 idx값을 저장시켜요.
        const token = jwt.sign({ idx: result[0].user_idx }, "privatekey", {
          expiresIn: "7d",  // 이 토큰은 7일 후 만료돼요!
        }); 

        console.log(match, "match##");

        res.send({
          status: true,
          token: token,
          msg: "login successful",
        });
      } else {
        res.send({
          status: false,
          msg: "invalid password",
        });
      }
    } else {
      res.send({
        status: false,
        msg: "invalid id",
      });
    }
  });
};

// verify
// 토큰이 아직 유효한지 검증하는 코드에요
module.exports.verify = async (req, res) => {
  const { authorization } = req.headers; // "Bearer eYj..." 형식의 헤더에서 토큰값만 추출해요
  const token = authorization.split(' ')[1]

  if (!token) {
    res.send({
        status: false,
        msg: "No token",
    });

    return
  }

  const decoded = jwt.verify(token, "privatekey");
  const userIdx = decoded.idx;

  let chkId = `SELECT * FROM users WHERE user_idx = ?`;
  db.query(chkId, [userIdx], (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
        
        res.send({
            status: true,
            msg: "Token is valid",
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
};