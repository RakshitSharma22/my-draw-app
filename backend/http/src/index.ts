import express, { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import cors from 'cors';
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser";
import { authorize } from "./middleware/authorize";

const app = express()

const PORT = 8000
const prisma = new PrismaClient()
app.use(express.json())
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true  // This is important for cookies
}));
app.use(cookieParser())


app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello World !!!" })
    return
})

app.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body

    if (!fullName || !email || !password) {
        res.status(400).json({ error: "Name, email, password should not be empty" })
        return
    }

    // Check whether user exists or not
    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        }
    })
    
    if (existingUser) {
        res.status(400).json({ error: "User already exists !!!!" })
        return
    }

    // Hashing of password
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
        data: {
            fullName,
            email,
            password: hashedPassword // Store hashed password, not plain text
        }
    })

    // Create a member profile for this user
    const member = await prisma.member.create({
      data: {
        name: fullName,
        color: generateRandomColor(),
        userId: newUser.id
      }
    })

    res.status(201).json({
      message: "User created successfully...",
      data: {
        name: newUser.fullName,
        email: newUser.email,
        memberId: member.id
      }
    })
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.post("/signin", async (req: Request, res: Response) => {
  try {
    console.log(req.body)
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ error: "Email and password cannot be empty" })
      return
    }

    const user = await prisma.user.findUnique({
      where: {
        email
      },
      include: {
        member: true // Include the associated member profile
      }
    })

    if (!user) {
      res.status(400).json({ error: "User does not exist" })
      return
    }
   
    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      res.status(400).json({ error: "Invalid password" })
      return
    }

    // Update member status to Online
    if (user.member) {
      await prisma.member.update({
        where: { id: user.member.id },
        data: { status: "Online" }
      })
    }

    // Create token
    const token = jwt.sign({ 
      id: user.id,
      memberId: user.member?.id 
    }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    })
    
    res.status(200).json({
      message: "User logged in successfully!",
      
    })
    return 
  } catch (err) {
    console.error("Error during signin:", err)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.post("/signout", authorize, async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number, memberId: string };
      
      // Set member status to Offline
      if (decoded.memberId) {
        await prisma.member.update({
          where: { id: decoded.memberId },
          data: { status: "Offline" }
        });
      }
    }

    // Clear the authentication cookie
    res.clearCookie("token");
    res.status(200).json({ message: "Signed out successfully" });
  } catch (err) {
    console.error("Error during signout:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/check", (req: Request, res: Response) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(200).json({ authenticated: false });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number, memberId: string };
    res.status(200).json({ 
      authenticated: true,
      userId: decoded.id,
      memberId: decoded.memberId
    });
    return;
  } catch (err) {
    res.status(200).json({ authenticated: false });
    return;
  }
});  

app.post('/room', authorize, async (req: Request, res: Response) => {
  const { name, color, description } = req.body;

  // Basic validation
  if (!name || !color || !description) {
    res.status(400).json({ message: 'All fields are required: Name, Color, Description' });
    return;
  }

  const newRoom = await prisma.room.create({
    data: {
      name,
      description,
      color
    }
  });

  res.status(201).json({ message: 'Room created successfully', room: newRoom });
  return;
});  

app.get("/room", authorize, async (req: Request, res: Response) => {
  try {
    const allRooms = await prisma.room.findMany({
      include: {
        _count: {
          select: { messages: true }
        }
      }
    });
    res.status(200).json({ rooms: allRooms });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get("/room/:id", authorize, async (req: Request, res: Response) => {
  try {
    const roomId = parseInt(req.params.id);
    
    const room = await prisma.room.findUnique({
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Members endpoints
app.get("/members", authorize, async (req: Request, res: Response) => {
  try {
    const members = await prisma.member.findMany({
      select: {
        id: true,
        name: true,
        status: true,
        color: true,
        createdAt: true
      }
    });
    
    res.status(200).json({ members });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get("/member/:id", authorize, async (req: Request, res: Response) => {
  try {
    const memberId = req.params.id;
    
    const member = await prisma.member.findUnique({
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put("/member/status", authorize, async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    const { status } = req.body;
    
    if (!status || !['Online', 'Away', 'Offline'].includes(status)) {
      res.status(400).json({ error: 'Invalid status value' });
      return;
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number, memberId: string };
    
    const updatedMember = await prisma.member.update({
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Messages endpoints
app.post("/message", authorize, async (req: Request, res: Response) => {
  try {
    const { content, roomId } = req.body;
    const token = req.cookies.token;
    
    if (!content || !roomId) {
      res.status(400).json({ error: 'Content and roomId are required' });
      return;
    }
    
    // Get the member ID from the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number, memberId: string };
    
    // Verify room exists
    const room = await prisma.room.findUnique({
      where: { id: parseInt(roomId) }
    });
    
    if (!room) {
      res.status(404).json({ error: 'Room not found' });
      return;
    }
    
    const message = await prisma.message.create({
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get("/messages/:roomId", authorize, async (req: Request, res: Response) => {
  try {
    const roomId = parseInt(req.params.roomId);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    
    const messages = await prisma.message.findMany({
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
    
    const totalMessages = await prisma.message.count({
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to generate random color
function generateRandomColor(): string {
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

app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}/`))

export default app;