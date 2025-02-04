import prisma from "@/app/libs/prismadb"
import getCurrentUser from "./getCurrentUser"

const getConversations =  async() => {
  const currentUser = await getCurrentUser();

  if(!currentUser?.id){
    return [];
  }

  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: 'desc'
      },
      where: {
        userIds: {
          has: currentUser.id
        }
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
            sender: true
          }
        }
      }
    })


    return conversations

  } catch (err: any){
    return [];
  }
}

export default getConversations