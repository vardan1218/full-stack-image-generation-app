import express from 'express'
import { PrismaClient } from '@prisma/client'
import authMiddleware from './middleware'
const cors = require("cors")
import OpenAI from 'openai'
import jwt from 'jsonwebtoken'
const app = express()
const prisma = new PrismaClient()
app.use(cors())
app.use(express.json())


const JWT_SECRET = process.env.JWT_SECRET || ""
const apiKey = process.env.OPENAI_API_KEY || ""
const openai = new OpenAI({ apiKey: apiKey})


app.post("/signup", async (req, res) => {
    try {
        const { email, password, username } = await req.body
        const existingUser = await prisma.user.findFirst({
            where: {
                email: email
            }
        })
        if(existingUser) {
            return res.status(403).json({
                message: "Email already taken"
            })
        }
        const user = await prisma.user.create({
            data: {
                email: email,
                password: password,
                username: username
            }
        })
        
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, {expiresIn: "10h"})

        return res.status(200).json({
            message: "Signed Up successfully",
            token: token
        })

    } catch (error) {
        console.log("Error while signing up", error)
        return res.status(500).json({
            message: "Error while signing up the user"
        })
    }
})


app.post("/signin", async (req, res) => {
    
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
        where: {
            email: email,
            password: password
        }
    })

    if (!user) {
        return res.status(403).json({
            message: "User not found"
        })
    }
    
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {expiresIn: "10h"})

    return res.status(200).json({
        message: "Signed in successfully",
        token: token
    })

    } catch (error) {
        console.log("Error while signing in the user", error)
    }
    

})


app.post("/Dalle", authMiddleware, async (req, res) => {
    try {
        const response = await openai.images.generate({
            model: req.body.model,
            prompt: req.body.message,
            n: req.body.numImages,
            size: req.body.sizes,
            quality:req.body.quality
        });
        
        const imageUrls = response.data.map(image => image.url) 
        res.json({ imageUrls }); 
    } catch (error) {
        console.log("Error while generating image", error);
        res.status(500).json({ error: "Error while generating image" });
    }
})

app.listen(3000)