"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const middleware_1 = __importDefault(require("./middleware"));
const cors = require("cors");
const openai_1 = __importDefault(require("openai"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use(cors());
app.use(express_1.default.json());
const JWT_SECRET = process.env.JWT_SECRET || "";
const apiKey = process.env.OPENAI_API_KEY || "";
const openai = new openai_1.default({ apiKey: apiKey });
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, username } = yield req.body;
        const existingUser = yield prisma.user.findFirst({
            where: {
                email: email
            }
        });
        if (existingUser) {
            return res.status(403).json({
                message: "Email already taken"
            });
        }
        const user = yield prisma.user.create({
            data: {
                email: email,
                password: password,
                username: username
            }
        });
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "10h" });
        return res.status(200).json({
            message: "Signed Up successfully",
            token: token
        });
    }
    catch (error) {
        console.log("Error while signing up", error);
        return res.status(500).json({
            message: "Error while signing up the user"
        });
    }
}));
app.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield prisma.user.findUnique({
            where: {
                email: email,
                password: password
            }
        });
        if (!user) {
            return res.status(403).json({
                message: "User not found"
            });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "10h" });
        return res.status(200).json({
            message: "Signed in successfully",
            token: token
        });
    }
    catch (error) {
        console.log("Error while signing in the user", error);
    }
}));
app.post("/Dalle", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield openai.images.generate({
            model: req.body.model,
            prompt: req.body.message,
            n: req.body.numImages,
            size: req.body.sizes,
            quality: req.body.quality
        });
        const imageUrls = response.data.map(image => image.url);
        res.json({ imageUrls });
    }
    catch (error) {
        console.log("Error while generating image", error);
        res.status(500).json({ error: "Error while generating image" });
    }
}));
app.listen(3000);
