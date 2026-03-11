import { log } from "console";
import { Router } from "express";
import { loginFunc, registerFunc } from "./controller";

const authRoutes = Router();

authRoutes.post("/login", loginFunc);
authRoutes.post("/register", registerFunc)
authRoutes.post("/logout", loginFunc)
authRoutes.post("/refresh", loginFunc)
authRoutes.post("/forgot-password", loginFunc)
authRoutes.post("/reset-password", loginFunc)

export default authRoutes;