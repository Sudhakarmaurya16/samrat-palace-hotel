import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
  try {
    // Backend 'username' expect kar raha hai
    const { username, password } = req.body;

    console.log("Login Request received:", req.body); // Debugging ke liye

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and Password required" });
    }

    // Hardcoded check
    if (username === "admin" && password === "admin123") {
      const token = jwt.sign(
        { role: "admin", username },
        process.env.JWT_SECRET || "secret_key",
        { expiresIn: "1d" }
      );
      return res.status(200).json({ message: "Login Successful", token });
    } else {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
