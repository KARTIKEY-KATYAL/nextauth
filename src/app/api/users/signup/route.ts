import { db } from "@/dbConfig/dbConfig.js";
import User from "@/models/user.models.js";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import crypto from "crypto";
import { sendMail } from "@/utils/mailer.js";
import bcrypt from "bcryptjs";

db()

export async function POST(request: NextRequest) {
    try {
        const reqbody = await request.json();
        const {name ,  email, password } = reqbody;

        // Validation
        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }
        if (password.length < 8) {
            return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Check if user already exists
        const user = await User.findOne({email})

        if (user){
            return NextResponse.json({error : "User already Exist"},{status : 400})
        }
        else{
            const savedUser = await User.create({
                name,
                email,
                password: hashedPassword,
            })
            
            await savedUser.save();
            
            // Send Verification Email
            await sendMail({
              email,
              emailType: "VERIFY",
              userId: savedUser._id,
            });
            
            return NextResponse.json({ message: 'Signup successful, please verify your email' ,
                success : true ,
                user : savedUser
            }, { status: 200 });
        }
    } catch (error : any) {
        console.error('Error in signup:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });        
    }
}