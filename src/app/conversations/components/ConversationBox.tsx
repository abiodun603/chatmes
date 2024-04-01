'use client'

import { useRouter } from "next/navigation"
import { FC, useCallback, useMemo } from "react"
import { Conversation, Message, User } from "@prisma/client"
import { useSession } from "next-auth/react"
import clsx from "clsx"
import { FullConversationType } from "@/app/types"
import useOtherUser from "@/app/hooks/useOtherUser"
import Avatar from "@/app/components/Avatar"
import { format } from "date-fns"

interface ConversationBoxProps {
  data: FullConversationType,
  selected?: boolean
}

const ConversationBox: FC<ConversationBoxProps> = ({data, selected}) => {
  const otherUser = useOtherUser(data);
  const session = useSession();
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`)
  }, [data.id, router])

  const lastMessage = useMemo(() => {
    const messages = data.messages || []
    
    // check for the last message in the array
    return messages[messages.length - 1]
  }, [data.messages]) 

  /**
   * the useSession hook need sometime to load
   * so we put it in the useMemo hook so it is updated
   * once it is loaded.
   */
  const userEmail = useMemo(() => {
    return session.data?.user?.email
  }, [session.data?.user?.email]);

  //  control where has seen message or not 
  const hasSeen = useMemo(() => {
    if(!lastMessage) return false

    /**
     * we write this check here so we can
     * use the filter on seen messages without 
     * typescript throwing "cannot perform filter on 
     * undefined"
     */
    const seenArray = lastMessage.seen || []

    if(!userEmail) return false

    return seenArray.filter((user) => user.email === userEmail).length !== 0;
  }, [userEmail, lastMessage])

  const lastMessageText = useMemo(() => {
    if(lastMessage?.image){
      return "Sent an image";
    }

    if(lastMessage?.body){
      return lastMessage.body;
    }

    return "Started a conversation"

  }, [lastMessage])

  return (
    <div 
      className={clsx(`
        w-full relative flex items-center space-x-3 p-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer
      `,
      selected ? 'bg-neutral-100' : 'bg-white')}
      onClick={handleClick}
    >
      <Avatar user = {otherUser} />
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-1">
            <p className="text-md font-medium text-gray-900">{data.name || otherUser.name}</p>
            {lastMessage?.createdAt && (
              <p className="text-xs text-gray-400 font-light">{format(new Date, 'p')}</p>
            )}
          </div>
          <p className={clsx(`
            truncate text-sm
          `,
          hasSeen ? 'text-gray-500' : 'text-black font-medium')}>{lastMessageText}</p>
        </div>
      </div>
    </div>
  )
}

export default ConversationBox