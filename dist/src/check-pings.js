"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
prisma.$connect();
const config = __importStar(require("../config.json"));
const nodemailer = __importStar(require("nodemailer"));
var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.auth.user,
        pass: config.auth.pass,
    },
});
function check() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield prisma.pings.findMany();
        data.forEach((ping) => __awaiter(this, void 0, void 0, function* () {
            const configData = config.checks.find((x) => (x.uuid = ping.uuid));
            if (!configData)
                return; //TS happy now?
            if (Date.now() - configData.grace * 1000 * 60 > ping.lastPing) {
                const data = yield prisma.pings.findUnique({
                    where: {
                        uuid: ping.uuid,
                    },
                });
                if (!(data === null || data === void 0 ? void 0 : data.active))
                    return;
                if (data === null || data === void 0 ? void 0 : data.tripped)
                    return;
                yield prisma.pings.update({
                    where: {
                        uuid: ping.uuid,
                    },
                    data: {
                        tripped: true,
                    },
                });
                var mailOptions = {
                    from: config.auth.user,
                    to: config.mailto,
                    subject: "Your service went down!",
                    text: `Your service named ${configData.name} just went down!`,
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    }
                });
            }
        }));
    });
}
exports.default = check;
