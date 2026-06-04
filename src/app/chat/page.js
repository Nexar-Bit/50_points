import { Suspense } from "react";
import ChatPageClient from "@/app/chat/ChatPageClient";
import ChatLoading from "@/app/chat/loading";

export default function ChatPage() {
  return (
    <Suspense fallback={<ChatLoading />}>
      <ChatPageClient />
    </Suspense>
  );
}
