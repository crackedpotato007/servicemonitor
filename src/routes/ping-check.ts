import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { Request, Response } from "express";
export default {
  route: "/ping/:id",
  function: async function (req: Request, res: Response) {
    await prisma.$connect();
    const data = await prisma.pings.findUnique({
      where: { uuid: req.params.id },
    });
    if (data) {
      await prisma.pings.update({
        where: {
          uuid: req.params.id,
        },
        data: {
          lastPing: Date.now(),
          tripped: false,
          active: true,
        },
      });
      res.status(200);
      res.send({ messaage: "OK!" });
      prisma.$disconnect();
    } else {
      res.status(404);
      res.send("Invalid uuid!");
    }
  },
};
