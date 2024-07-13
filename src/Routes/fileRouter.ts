import express from "express";
const router = express.Router();
import multer from "multer";
const base = "http://localhost:3000/"
const storage = multer.diskStorage ({
 destination : function (req, file, cb) {
    cb(null, 'public/')
    },
    filename: function (req, file, cb) {
    const ext = file.originalname .split('.')
    . filter(Boolean) 
    . slice(1)
    . join('.')
    cb(null, Date.now() + "." + ext)
    }
})
const upload = multer({ storage: storage });
router.post('/', upload.single("file"), function (req, res) {
 res.status(200).send({ url: base + req.file.path })
});
/**
 * @swagger
 * /file:
 *   post:
 *     summary: Upload a file
 *     description: Upload a file
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 */
export default router;