import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Logged-in user route
router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});


export default router;