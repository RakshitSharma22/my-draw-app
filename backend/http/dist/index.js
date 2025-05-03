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
            res.status(400).json({ error: "Name, email, password should not be empty" });
            return;
        }
        // Check whether user exists or not
        const existingUser = yield prisma.user.findUnique({
            where: {
                email,
            }
        });
        if (existingUser) {
            res.status(400).json({ error: "User already exists !!!!" });
            return;
        }
        // Hashing of password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = yield prisma.user.create({
            data: {
                fullName,
                email,
                password: hashedPassword // Store hashed password, not plain text
            }
        });
        // Create a member profile for this user
        const member = yield prisma.member.create({
            data: {
                name: fullName,
                color: generateRandomColor(),
                userId: newUser.id
            }
        });
        res.status(201).json({
            message: "User created successfully...",
            data: {
                name: newUser.fullName,
                email: newUser.email,
                memberId: member.id
            }
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
app.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
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
            },
            include: {
                member: true // Include the associated member profile
            }
        });
        if (!user) {
            res.status(400).json({ error: "User does not exist" });
            return;
        }
        // Compare hashed password
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ error: "Invalid password" });
            return;
        }
        // Update member status to Online
        if (user.member) {
            yield prisma.member.update({
                where: { id: user.member.id },
                data: { status: "Online" }
            });
        }
        // Create token
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            memberId: (_a = user.member) === null || _a === void 0 ? void 0 : _a.id
        }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict",
            maxAge: 60 * 60 * 1000, // 1 hour
        });
        res.status(200).json({
            message: "User logged in successfully!",
        });
        return;
    }
    catch (err) {
        console.error("Error during signin:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}));
app.post("/signout", authorize_1.authorize, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.token;
        if (token) {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            // Set member status to Offline
            if (decoded.memberId) {
                yield prisma.member.update({
                    where: { id: decoded.memberId },
                    data: { status: "Offline" }
                });
            }
        }
        // Clear the authentication cookie
        res.clearCookie("token");
        res.status(200).json({ message: "Signed out successfully" });
    }
    catch (err) {
        console.error("Error during signout:", err);
        res.status(500).json({ error: "Internal server error" });
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
        res.status(200).json({
            authenticated: true,
            userId: decoded.id,
            memberId: decoded.memberId
        });
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
        res.status(400).json({ message: 'All fields are required: Name, Color, Description' });
        return;
    }
    const newRoom = yield prisma.room.create({
        data: {
            name,
            description,
            color
        }
    });
    res.status(201).json({ message: 'Room created successfully', room: newRoom });
    return;
}));
app.get("/room", authorize_1.authorize, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allRooms = yield prisma.room.findMany({
            include: {
                _count: {
                    select: { messages: true }
                }
            }
        });
        res.status(200).json({ rooms: allRooms });
        return;
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
app.get("/room/:id", authorize_1.authorize, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roomId = parseInt(req.params.id);
        const room = yield prisma.room.findUnique({
            where: { id: roomId },
            include: {
                messages: {
                    include: {
                        sender: true
                    },
                    orderBy: {
                        timestamp: 'asc'
                    }
                }
            }
        });
        if (!room) {
            res.status(404).json({ error: 'Room not found' });
            return;
        }
        res.status(200).json({ room });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Members endpoints
app.get("/members", authorize_1.authorize, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const members = yield prisma.member.findMany({
            select: {
                id: true,
                name: true,
                status: true,
                color: true,
                createdAt: true
            }
        });
        res.status(200).json({ members });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
app.get("/member/:id", authorize_1.authorize, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const memberId = req.params.id;
        const member = yield prisma.member.findUnique({
            where: { id: memberId },
            select: {
                id: true,
                name: true,
                status: true,
                color: true,
                createdAt: true,
                messages: {
                    select: {
                        content: true,
                        timestamp: true,
                        room: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    },
                    orderBy: {
                        timestamp: 'desc'
                    },
                    take: 10 // Get latest 10 messages
                }
            }
        });
        if (!member) {
            res.status(404).json({ error: 'Member not found' });
            return;
        }
        res.status(200).json({ member });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
app.put("/member/status", authorize_1.authorize, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.token;
        const { status } = req.body;
        if (!status || !['Online', 'Away', 'Offline'].includes(status)) {
            res.status(400).json({ error: 'Invalid status value' });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const updatedMember = yield prisma.member.update({
            where: { id: decoded.memberId },
            data: { status }
        });
        res.status(200).json({
            message: 'Status updated successfully',
            member: {
                id: updatedMember.id,
                status: updatedMember.status
            }
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Messages endpoints
app.post("/message", authorize_1.authorize, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content, roomId } = req.body;
        const token = req.cookies.token;
        if (!content || !roomId) {
            res.status(400).json({ error: 'Content and roomId are required' });
            return;
        }
        // Get the member ID from the token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Verify room exists
        const room = yield prisma.room.findUnique({
            where: { id: parseInt(roomId) }
        });
        if (!room) {
            res.status(404).json({ error: 'Room not found' });
            return;
        }
        const message = yield prisma.message.create({
            data: {
                content,
                senderId: decoded.memberId,
                roomId: parseInt(roomId)
            },
            include: {
                sender: true
            }
        });
        res.status(201).json({
            message: 'Message sent successfully',
            data: message
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
app.get("/messages/:roomId", authorize_1.authorize, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roomId = parseInt(req.params.roomId);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const messages = yield prisma.message.findMany({
            where: { roomId },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        color: true,
                        status: true
                    }
                }
            },
            orderBy: {
                timestamp: 'desc'
            },
            skip,
            take: limit
        });
        const totalMessages = yield prisma.message.count({
            where: { roomId }
        });
        res.status(200).json({
            messages,
            pagination: {
                total: totalMessages,
                page,
                limit,
                pages: Math.ceil(totalMessages / limit)
            }
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Helper function to generate random color
function generateRandomColor() {
    const colors = [
        '#FF5733', '#33FF57', '#3357FF', '#F033FF', '#FF33F0',
        '#33FFF0', '#F0FF33', '#5733FF', '#FF5733', '#33FF57'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}
// Add the authorize middleware
// You should have this in ./middleware/authorize.ts
// If not, here's what it should look like:
/*
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authorize = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};
*/
app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}/`));
exports.default = app;
