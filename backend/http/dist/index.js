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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const app = (0, express_1.default)();
const PORT = 8000;
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.json({ message: "Hello World !!!" });
    return;
});
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            res.status(400).json({ error: "Name,email,password should not be empty" });
            return;
        }
        //check wheather user exists or not
        const existingUser = yield prisma.user.findUnique({
            where: {
                email,
            }
        });
        if (existingUser) {
            res.status(400).json({ error: "User already exists !!!!" });
            return;
        }
        //hashing of password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = yield prisma.user.create({
            data: {
                fullName, email, password
            }
        });
        res.status(201).json({ message: "User created successfully...",
            data: {
                Name: newUser.fullName,
                email: newUser.email
            } });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}/`));
