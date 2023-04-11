import { Router } from "express";
import {
  menu_get,
  menu_post,
  menu_delete,
  menu_put,
} from "../controllers/menuController.js";
import { restrictToAdmin } from "../controllers/userController.js";
import { verifyToken } from "../verifyToken.js";

const menuRoutes = Router();
menuRoutes.get("/", menu_get);
menuRoutes.post("/", verifyToken, restrictToAdmin, menu_post);
menuRoutes.delete("/:id", verifyToken, restrictToAdmin, menu_delete);
menuRoutes.put("/:id", verifyToken, restrictToAdmin, menu_put);

export default menuRoutes;
