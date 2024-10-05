import newDatabase from "./database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Change this boolean to true if you wish to keep your
// users between restart of your application
const isPersistent = false;
const database = newDatabase({ isPersistent });
const secretKey = "super-secret-key";

export const register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = database.create({ username, password: hashedPassword });
    res.status(201).json({ id: newUser.id, username: newUser.username });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const users = database.getAll();
    const user = users.find((user) => user.username === username);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: "1h" });

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProfile = (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.id;

    const user = database.getById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ username: user.username });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid token" });
  }
};

export const logout = (req, res) => {
  res.status(204).send();
};
