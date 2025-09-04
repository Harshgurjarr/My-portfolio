
const express = require("express");
const router = express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();


const app = express();


const corsOptions = {
  origin: [
    "http://localhost:3000",                         
    "http://localhost:3001",                           
    "https://harsh-portfolio-r.netlify.app" 
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
};

app.use(cors(corsOptions));




app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const contactEmail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || "harshgurjar590@gmail.com",
    pass: process.env.EMAIL_PASS || "sbbf shui gmbg gfff"  
  },
});


contactEmail.verify((error) => {
  if (error) {
    console.log("Email configuration error:", error);
  } else {
    console.log("Ready to Send Emails");
  }
});


app.post("/contact", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;
    
    if (!firstName || !email || !message) {
      return res.status(400).json({ 
        code: 400, 
        status: "Missing required fields" 
      });
    }

    const name = firstName + " " + (lastName || "");
    
    const mail = {
      from: process.env.EMAIL_USER || "harshgurjar590@gmail.com",
      to: process.env.EMAIL_USER || "harshgurjar590@gmail.com",
      replyTo: email,
      subject: "Contact Form Submission - Portfolio",
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    await contactEmail.sendMail(mail);
    res.json({ code: 200, status: "Message Sent Successfully" });
    
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ 
      code: 500, 
      status: "Failed to send message. Please try again." 
    });
  }
});


app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

const PORT = process.env.PORT || 3001;  
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




