/* eslint-disable @next/next/no-img-element */
import { getPrisma } from "@/lib/prisma";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: { messageId: string };
}) {
  let messageId = params.messageId;
  const prisma = getPrisma();
  let message = await prisma.message.findUnique({
    where: {
      id: messageId,
    },
    include: {
      chat: true,
    },
  });

  const backgroundData = await readFile(
    join(process.cwd(), "./public/dynamic-og.png"),
  );
  const backgroundSrc = Uint8Array.from(backgroundData).buffer;

  let title = message
    ? message.chat.title
    : "An app generated on pollin-coder by R3AAP3R editz";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        {/* @ts-expect-error */}
        <img src={backgroundSrc} height="100%" alt="" />
        {/* Semi-transparent overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        />
        <div
          style={{
            position: "absolute",
            fontSize: 60,
            fontWeight: "bold",
            color: "white",
            padding: "50px 200px",
            textAlign: "center",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            maxWidth: "1000px",
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
