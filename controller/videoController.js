const jwt = require("jsonwebtoken");
const db = require("../dbconnection");

// Create new video
// S3에 업로드 된 새로운 영상의 주소를 저장하는 코드
module.exports.createVideo = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "privatekey");
    const user_idx = decoded.idx;

    const { video_url, video_name } = req.body;
    if (!video_url) {
      return res.status(400).send({
        status: false,
        msg: "video_url is required",
      });
    }

    let insertqry = `INSERT INTO videos (user_idx, video_url, video_name, like_count) VALUES (?, ?, ?, 0)`;
    db.query(insertqry, [user_idx, video_url, video_name], (err, result) => {
      if (err) throw err;

      res.send({
        status: true,
        msg: "Video created successfully",
        video_id: result.insertId,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: false,
      msg: "An error occurred",
    });
  }
};

// Get video by video_id
module.exports.getVideoById = async (req, res) => {
  try {
    const video_id = req.params.video_id;

    if (!video_id) {
      return res.status(400).send({
        status: false,
        msg: "video_id is required",
      });
    }

    let selectqry = `SELECT * FROM videos WHERE id = ?`;
    db.query(selectqry, [video_id], (err, result) => {
      if (err) throw err;

      if (result.length > 0) {
        res.send({
          status: true,
          video: result[0],
        });
      } else {
        res.send({
          status: false,
          msg: "Video not found",
        });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: false,
      msg: "An error occurred",
    });
  }
};


// Get videos by user_idx
module.exports.getVideosByUser = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "privatekey");
    const user_idx = decoded.idx;

    let selectqry = `SELECT * FROM videos WHERE user_idx = ?`;
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
          msg: "No videos found for this user",
        });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: false,
      msg: "An error occurred",
    });
  }
};

// Get all videos
module.exports.getAllVideos = async (req, res) => {
  try {
    let selectqry = `SELECT * FROM videos`;
    db.query(selectqry, (err, result) => {
      if (err) throw err;

      if (result.length > 0) {
        res.send({
          status: true,
          videos: result,
        });
      } else {
        res.send({
          status: false,
          msg: "No videos found",
        });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: false,
      msg: "An error occurred",
    });
  }
};

// Like += 1
module.exports.incrementLikeCount = (req, res) => {
  const videoId = +req.params.video_id;
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "privatekey");
  const user_idx = decoded.idx;

  if (!videoId) {
    res.send({
      status: false,
      msg: "video_id is required",
    });

    return;
  }

  if (!user_idx || !videoId) {
    res.send({
      status: false,
      msg: "user_idx and video_id are required",
    });

    return;
  }

  let insertqry = `INSERT INTO likes (user_idx, video_id) VALUES (?, ?)`;
  db.query(insertqry, [user_idx, videoId], (err, _) => {
    if (err) throw err;
  });

  let updateqry = `UPDATE videos SET like_count = like_count + 1 WHERE id = ?`;
  db.query(updateqry, [videoId], (err, result) => {
    if (err) throw err;

    if (result.affectedRows > 0) {
      res.send({
        status: true,
        msg: "Like count incremented",
      });
    } else {
      res.send({
        status: false,
        msg: "Video not found",
      });
    }
  });
};

// Like -= 1
module.exports.decrementLikeCount = (req, res) => {
  const videoId = +req.params.video_id;
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "privatekey");
  const user_idx = decoded.idx;

  if (!videoId) {
    res.send({
      status: false,
      msg: "video_id is required",
    });

    return;
  }

  if (!user_idx || !videoId) {
    res.send({
      status: false,
      msg: "user_idx and video_id are required",
    });

    return;
  }

  let deleteqry = `DELETE FROM likes WHERE user_idx = ? AND video_id = ?`;
  db.query(deleteqry, [user_idx, videoId], (err, _) => {
    if (err) throw err;
  });

  let updateqry = `UPDATE videos SET like_count = like_count - 1 WHERE id = ?`;
  db.query(updateqry, [videoId], (err, result) => {
    if (err) throw err;

    if (result.affectedRows > 0) {
      res.send({
        status: true,
        msg: "Like count decremented",
      });
    } else {
      res.send({
        status: false,
        msg: "Video not found",
      });
    }
  });
};
