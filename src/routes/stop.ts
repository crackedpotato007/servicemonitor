import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { Request, Response } from "express";
import * as config from "../../config.json";
export default {
  route: "/stop/:id",
  function: async function (req: Request, res: Response) {
    if (config.checks.some((x) => x.uuid === req.params.id)) {
      prisma.$connect();
      const data = await prisma.pings.findUnique({
        where: {
          uuid: req.params.id,
        },
      });
      if (!data) return res.send("Send the first ping first!");
      if (!data.active) {
        res.status(400);
        res.send("The service is already stopped");
      } else {
        await prisma.pings.update({
          where: {
            uuid: req.params.id,
          },
          data: {
            active: false,
          },
        });
        res.status(200);
        return res.send("Service stopped!");
      }
    }
  },
};
