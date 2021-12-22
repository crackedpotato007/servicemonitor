import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { Request, Response } from "express";
import * as config from "../../config.json";
export default {
  route: "/ping/:id",
  function: async function (req: Request, res: Response) {
    if (config.checks.some((x) => x.uuid === req.params.id)) {
      await prisma.$connect();
      await prisma.pings.upsert({
        where: {
          uuid: req.params.id,
        },
        update: {
          lastPing: Date.now(),
          tripped: false,
          active: true,
        },
        create: {
          uuid: req.params.id,
          lastPing: Date.now(),
          tripped: false,
          active: true,
        },
      });
      res.status(200);
      res.send("OK!");
      prisma.$disconnect();
    } else {
      res.status(400);
      res.send("Invalid uuid!");
    }
  },
};
