import express,{Request,Response} from "express"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
const app=express()
const PORT=8000
const prisma=new PrismaClient()
app.use(express.json())


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
app.listen(PORT,()=>console.log(`Server started at http://localhost:${PORT}/`))
