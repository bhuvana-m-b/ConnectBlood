import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDb from './config/db.js'
import authRoutes from './routes/AuthRoutes.js'
import bloodRequestRoutes from './routes/requestRoutes.js'
import donationRoutes from './routes/donationRoutes.js'
import userProfileRoutes from './routes/userProfile.js'
//import uploadRoutes from './routes/uploadRoutes.js';
import uploadRoutes from "./routes/uploadRoutes.js";
import http from 'http'
import {Server} from 'socket.io';
dotenv.config()

const base_url = process.env.CLIENT_URL
connectDb()
const PORT = process.env.PORT || 8000

const app = express()
const server = http.createServer(app);

const io = new Server(server , {
  cors :{
    origin : `${base_url}`,
    credentials : true
  }
})

export {io};//exporting io globally so that can use it from wherever needed i.e controllers , middlewares

app.use(express.json())
app.use(cookieParser())

export const connectedDonors = new Map();

io.on("connection",(socket)=>{
    console.log("A new user connected : ",socket.id);

    socket.on('registerDonor' , ({userId , blood_group , location})=>{
      connectedDonors.set(socket.id , {userId , blood_group , location})
      console.log(`New user connected: (${userId})`);
    })

    socket.on('newDonationRequest', (donationData) => {
      // Broadcast to all connected users (the requester will receive this)
      socket.broadcast.emit('newDonationRequest', donationData);
      console.log(`New donation request sent: ${donationData.donationId}`);
    });

    // Handle donation status updates
    socket.on('donationStatusUpdated', (statusData) => {
      // Broadcast to all connected users (the donor will receive this)
      socket.broadcast.emit('donationStatusUpdated', statusData);
      console.log(`Donation status updated: ${statusData.donationId} to ${statusData.status}`);
    });

    socket.on("disconnect" ,()=>{
      connectedDonors.delete(socket.id)
       console.log("A user disconnected",socket.id);
    })
})

// CORS configuration: allow credentials and set the frontend origin.
app.use(cors({
  origin: `${base_url}`,
  methods : ['GET','POST','PUT','DELETE','PATCH'],
  credentials: true
}))

app.get('/', (req, res) => {
  res.send("Blood donation running successfully")
})

app.use("/api/auth", authRoutes)
app.use("/api/bloodrequest", bloodRequestRoutes)
app.use("/api/donations", donationRoutes)
app.use("/api/user",userProfileRoutes)

app.use("/api", uploadRoutes);


export default app;

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log("Server started successfully");
  });
}
