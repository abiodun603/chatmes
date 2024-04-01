import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb"

export async function POST(
  request: Request
) {
  try {
    const currentUser = await getCurrentUser()
    const body = await request.json()

    const {userId, isGroup, members, name} = body;
    
    if(!currentUser?.id || !currentUser?.email){
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if(isGroup && (!members || members.length < 2 || name)){
      return new NextResponse("Invaide data", { status : 400 });
    }

    if(isGroup){
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: {value: string}) => ({
                id: member.value
              })),
              {
                id: currentUser.id
              }
            ]
          }
        },
        /**
         * The include:user is use to populate the users/members
         * when we fetch the conversation, by default when we get
         * a new conversation, we are not going to get array of object of yuur users inside 
         * the group chat, we are only going to get id's, but if we want to work with those user
         * i.e  displaying there image or names, we need to populate the them, in prisma we achieve
         * this using includes, by setting the field we want to populate and adding true.
         */
        include: {
          users: true
        }
      });
      return NextResponse.json(newConversation)
    }

    const existingConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId]
            }
          },
          {
            userIds: {
              equals: [userId, currentUser.id]
            }
          }
        ]
      }
    });

    const singleConversation = existingConversations[0];

    if(singleConversation){
      return NextResponse.json(singleConversation)
    }

    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currentUser.id,
            },
            {
              id: userId,
            }
          ]
        }
      },
      include: {
        users: true
      }
    })

    return NextResponse.json(newConversation);
  } catch (error: any) {
    return new NextResponse("Internal Error", { status: 500})
  }
}