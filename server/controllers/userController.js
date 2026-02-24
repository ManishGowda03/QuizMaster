// controllers/userController.js

export const getUserProfile = async (req, res) => {
  try {
    // req.user is already set by protect middleware
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};