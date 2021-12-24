import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { Request, Response } from "express";
export default {
  route: "/stop/:id",
  function: async function (req: Request, res: Response) {
    await prisma.$connect();
    const data = await prisma.pings.findUnique({
      where: { uuid: req.params.id },
    });
    if (data) {
      await prisma.$connect();
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
        await prisma.$disconnect();
        return res.send("Service stopped!");
      }
    }
  },
};
