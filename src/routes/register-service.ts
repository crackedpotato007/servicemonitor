import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";
export default {
  route: "/register",
  function: async function (req: Request, res: Response) {
    await prisma.$connect();
    if (!req.query.name?.toString()) return res.send("No check name!");
    if (typeof req.query.name !== "string")
      return res.send("Name must be a string!");
    if (!req.query.grace) return res.send("No grace period!");
    if (!parseInt(req.query.grace as string))
      return res.send("Grace time must be a number in minutes!");
    if (!req.query.email) return res.send("No email to be notified specified!");
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!regexEmail.test(req.query.email as string)) {
      res.status(400);
      return res.send({
        message: "The string specified as email is not a valid email!",
      });
    }
    const id = uuidv4();
    await prisma.pings.create({
      data: {
        name: req.query.name as string,
        tripped: false,
        active: true,
        lastPing: Date.now(),
        uuid: id,
        grace: parseInt(req.query.grace as string),
        email: req.query.email as string,
      },
    });
    return res.send({ id: id });
  },
};
