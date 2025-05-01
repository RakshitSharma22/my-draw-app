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
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authorize_1 = require("./middleware/authorize");
const app = (0, express_1.default)();
const PORT = 8000;
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true // This is important for cookies
}));
app.use((0, cookie_parser_1.default)());
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
app.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: "Email and password cannot be empty" });
            return;
        }
        const user = yield prisma.user.findUnique({
            where: {
                email
            }
        });
        if (!user) {
            res.status(400).json({ error: "User does not exists" });
            return;
        }
        console.log("hello");
        if (password != user.password) {
            res.status(400).json({ error: "Password  is not matching...." });
            return;
        }
        //create token
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 1000, // 1 hour
        });
        res.status(200).json({ message: "User logged in successfully !!!!!!!" });
        return;
    }
    catch (err) {
        console.log("something went wrong with signin !!!!");
    }
}));
app.get("/check", (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        res.status(200).json({ authenticated: false });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ authenticated: true });
        return;
    }
    catch (err) {
        res.status(200).json({ authenticated: false });
        return;
    }
});
app.post('/room', authorize_1.authorize, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, color, description } = req.body;
    // Basic validation
    if (!name || !color || !description) {
        res.status(400).json({ message: 'All fields are required: Name , Color, Description' });
        return;
    }
    const newRoom = yield prisma.room.create({
        data: {
            name,
            description, color
        }
    });
    res.status(201).json({ message: 'Room created successfully', room: newRoom });
    return;
}));
app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}/`));
