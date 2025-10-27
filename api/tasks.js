import express from "express";

import {
  createTask,
  getTasksByUserId,
  getTaskById,
  updateTask,
  deleteTask,
} from "#db/queries/tasks";

import requireBody from "#middleware/requireBody";
import getUserFromToken from "#middleware/getUserFromToken";
import requireUser from "#middleware/requireUser";

const router = express.Router();

router.use(getUserFromToken);
router.use(requireUser);

router.post("/", requireBody(["title", "done"]), async (req, res, next) => {
  try {
    const { title, done } = req.body;
    const task = await createTask(title, done, req.user.id);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const tasks = await getTasksByUserId(req.user.id);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", requireBody(["title", "done"]), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, done } = req.body;

    const existingTask = await getTaskById(id);
    if (!existingTask || existingTask.user_id !== req.user.id) {
      return res.status(403).send("Forbidden");
    }

    const updatedTask = await updateTask(id, title, done);
    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingTask = await getTaskById(id);
    if (!existingTask || existingTask.user_id !== req.user.id) {
      return res.status(403).send("Forbidden");
    }

    await deleteTask(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
