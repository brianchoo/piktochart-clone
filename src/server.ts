import express from "express";
import fs from "fs";
import multer from "multer";
import { not as isNotJunk } from "junk";
import cors from "cors";
import path from "path";

const server = express();
const PORT = 8000;

// Enable CORS
server.use(
  cors({
    origin: "http://localhost:5173", // Allow your Vue app's origin
    methods: ["GET", "POST"], // Allow these HTTP methods
    allowedHeaders: ["Content-Type"], // Allow these headers
  })
);

// Serve static files in /images
server.use("/images", express.static(path.join(__dirname, "images")));

// Configure Multer Middleware and Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/images");
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").slice(-1);
    cb(null, "uploads-" + Date.now() + "." + ext);
  },
});

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: any
) => {
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    cb(null, true);
  } else {
    cb("Failed: format not supported");
  }
};

const uploadMiddleware = multer({ storage, fileFilter }).single("upload");

server
  // .use(express.static("./"))
  // .use(express.static(path.join(__dirname, "client")))
  .post("/uploads", (req, res) => {
    uploadMiddleware(req, res, (err) => {
      if (err || !req.file) {
        console.error(err);
        res.status(400).json({
          message: err,
        });
      } else {
        res.status(200).json({
          file:
            req.protocol +
            "://" +
            req.get("host") +
            "/images/" +
            req.file.filename,
        });
      }
    });
  })
  .get("/images", (req, res) => {
    const filePath = req.protocol + "://" + req.get("host") + "/images/";
    const files = fs
      .readdirSync(__dirname + "/images")
      .filter(isNotJunk) // remove .DS_STORE etc
      .map((url) => filePath + url); // map with url path
    res.json(files);
  })
  // .get("/", (req, res) => {
  //   res.sendFile(path.join(__dirname, "client/index.html"));
  // })
  .listen(PORT, () => {
    console.log(`Server started. listening to ${PORT}`);
  });
