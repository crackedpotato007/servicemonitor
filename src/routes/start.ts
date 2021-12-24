import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { Request, Response } from "express";
export default {
  route: "/start/:id",
  function: async function (req: Request, res: Response) {
    await prisma.$connect();
    const data = await prisma.pings.findUnique({
      where: { uuid: req.params.id },
    });
    if (!data) {
      res.status(404);
      return res.send(
        "Invalid UUID or the api hasn't been pinged a single time!"
      );
    }
    if (data) {
      if (data.active) {
        res.status(404);
        res.send("The service is already active!");
      } else {
        await prisma.pings.update({
          where: {
            uuid: req.params.id,
          },
          data: {
            active: true,
          },
        });
        res.status(200);
        await prisma.$disconnect();
        return res.send("Service started!");
      }
    }
  },
};
