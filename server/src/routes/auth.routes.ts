import express from "express";
import { loginUser, registerUser } from "../controller/auth.controller";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);

// simple logout route to clear the auth cookie
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  return res.status(200).json({ status: "success", message: "Logged out" });
});

export default router;