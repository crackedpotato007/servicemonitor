import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import * as config from "../config.json";
import * as nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.auth.user,
    pass: config.auth.pass,
  },
});
async function check() {
  await prisma.$connect();
  const data = await prisma.pings.findMany();
  data.forEach(async (ping) => {
    const configData = await prisma.pings.findUnique({
      where: { uuid: ping.uuid },
    });
    if (!configData) return; //TS happy now?
    if (Date.now() - configData.grace * 1000 * 60 > ping.lastPing) {
      const data = await prisma.pings.findUnique({
        where: {
          uuid: ping.uuid,
        },
      });
      if (!data?.active) return;
      if (data?.tripped) return;
      await prisma.pings.update({
        where: {
          uuid: ping.uuid,
        },
        data: {
          tripped: true,
        },
      });
      var mailOptions = {
        from: config.auth.user,
        to: ping.email,
        subject: "Your service went down!",
        text: `Your service named ${configData.name} just went down!`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        }
      });
    }
  });
}

export default check;
