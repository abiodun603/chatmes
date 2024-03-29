import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb'

export async function POST(req: Request){
  try {
    const body = await req.json();
    console.log(body);
    const {email, name, password} = body
  
    if(!email || !name || !password){
      return new NextResponse('Missing info', { status: 400 });
    }
    
    // Check for existing user with the same email
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse('Email already exists', { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12)
  
    const user = await prisma.user.create({
      data: { email, name, hashedPassword },
    })

    return NextResponse.json(user)

  } catch (error) {
    console.log(error, "REGISTRATION_ERROR")
    return new NextResponse("Internal Error", {status: 500})
  }
}
