import express,{Request,Response} from "express"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import cors from 'cors';
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser";


const app=express()

const PORT=8000
const prisma=new PrismaClient()
app.use(express.json())
app.use(cors());
app.use(cookieParser())


app.get("/",(req:Request,res:Response)=>{
    res.json({message:"Hello World !!!"})
    return
})

app.post("/signup",async (req,res)=>{
  try
  {

  
    const {fullName,email,password}=req.body

    if(!fullName || !email ||!password ){
        res.status(400).json({error:"Name,email,password should not be empty"})
        return
    }

    //check wheather user exists or not
    const existingUser=await prisma.user.findUnique({
        where:{
            
            email,
            
        }
    })
    if(existingUser)
    {
        res.status(400).json({error:"User already exists !!!!"})
        return
    }

    //hashing of password
    const hashedPassword=await bcrypt.hash(password,10)

    const newUser=await prisma.user.create({
        data:{
            fullName,email,password
        }
    })

    res.status(201).json({message:"User created successfully...",
              data:{
                  Name:newUser.fullName,
                  email:newUser.email
    }})

   
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.post("/signin",async (req:Request,res:Response)=>{
   try{

   console.log(req.body)
   const {email,password}=req.body

   if(!email || !password)
   {
    res.status(400).json({error:"Email and password cannot be empty"})
    return
   }

   const user=await prisma.user.findUnique({
    where:{
        email
    }
   })

   if(!user)
   {
    res.status(400).json({error:"User does not exists"})
    return
   }
   
   if(password != user.password)
   {
    res.status(400).json({error:"Password  is not matching...."})
    return

   }


   //create token
   const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

   res.cookie("token",token,{
    httpOnly:true,
    secure:true,
    sameSite:"strict",
    maxAge: 60 * 60 * 1000, // 1 hour

   }

   )
   res.status(200).json({message:"User logged in successfully !!!!!!!"})
   return 
}catch(err){
    console.log("something went wrong with signin !!!!")
}
})

app.get('/profile', async (req: Request, res: Response) => {
    const token = req.cookies?.token;
    
  
    if (!token) {
       res.status(401).json({ message: 'No token' });
       return 
    }
  
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET!);
      res.json({ user });
    } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
    }
  });
app.listen(PORT,()=>console.log(`Server started at http://localhost:${PORT}/`))
