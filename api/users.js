import express from "express";
import bcrypt from "bcrypt";

import { createUser, getUserByUsername } from "#db/queries/users";
import { createToken } from "#utils/jwt";

import requireBody from "#middleware/requireBody";

const router = express.Router();

router.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user = await createUser(username, password);
      const token = createToken({ id: user.id });
      res.status(201).send(token);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user = await getUserByUsername(username);

      if (!user) {
        return res.status(401).send("Invalid login");
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).send("Invalid password");
      }

      const token = createToken({ id: user.id });
      res.status(200).send(token);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
