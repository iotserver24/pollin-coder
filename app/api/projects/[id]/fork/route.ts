import { getPrisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: {
    id: string;
  };
};

export async function POST(
  request: NextRequest,
  props: Props
) {
  try {
    const prisma = getPrisma();
    const originalChat = await prisma.chat.findUnique({
      where: { id: props.params.id },
      include: { messages: true }
    });

    if (!originalChat) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Create a new chat with the same content
    const newChat = await prisma.chat.create({
      data: {
        title: `${originalChat.title} (Fork)`,
        prompt: originalChat.prompt,
        model: originalChat.model,
        quality: originalChat.quality,
        pollinCoderVersion: originalChat.pollinCoderVersion,
        shadcn: originalChat.shadcn,
        messages: {
          create: originalChat.messages.map((msg, index) => ({
            role: msg.role,
            content: msg.content,
            position: index
          }))
        }
      }
    });

    return NextResponse.json({ newChatId: newChat.id });
  } catch (error) {
    console.error('Error forking project:', error);
    return NextResponse.json({ error: 'Failed to fork project' }, { status: 500 });
  }
} 