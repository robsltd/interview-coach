"use client";

import { VoiceProvider, type HumeVoiceMessage } from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import { ComponentRef, useRef } from "react";
import { toast } from "sonner";
import { FacialAnalysisManager } from "./FacialAnalysisManager";
import { useInterview } from "@/context/InterviewContext";

export default function ClientComponent({
  accessToken,
  connectFacialAnalysis,
  disconnectFacialAnalysis,
}: {
  accessToken: string;
  connectFacialAnalysis: () => void;
  disconnectFacialAnalysis: () => void;
}) {
  const timeout = useRef<number | null>(null);
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);
  const { nextQuestion, generateFeedback, state, addMessage } = useInterview();
  const lastUserMessage = useRef<HumeVoiceMessage | null>(null);

  const configId = process.env.NEXT_PUBLIC_HUME_CONFIG_ID;

  const handleMessage = (message: HumeVoiceMessage) => {
    // Determine the ID *before* adding the message, as adding might trigger re-renders
    let potentialUserMessageIdForFeedback: string | undefined;
    if (message.type === "assistant_message" && lastUserMessage.current) {
      const lastMsg = lastUserMessage.current;
      // Find the index of the last user message in the *current* state
      const userMessageIndex = state.messages.findIndex(m => m === lastMsg);
      if (userMessageIndex !== -1) {
        potentialUserMessageIdForFeedback = `userMsg-${userMessageIndex}`; // Use index as key
      }
    }

    addMessage(message); // Store every message in our context

    // 1. Handle UI scrolling
    if (timeout.current) window.clearTimeout(timeout.current);
    timeout.current = window.setTimeout(() => {
      if (ref.current) {
        ref.current.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });
      }
    }, 100);

    // 2. Track the last user message object reference
    if (message.type === "user_message") {
      lastUserMessage.current = message as UserMessage;
    }

    // 3. When the assistant starts speaking, generate feedback using the index-based key
    if (potentialUserMessageIdForFeedback && lastUserMessage.current) {
      // Check if feedback already exists for this index-based key
      if (!state.feedback[potentialUserMessageIdForFeedback]) {
        const lastMsg = lastUserMessage.current; // Get the message content from the tracked ref
        const transcript = lastMsg.message.content;
        const emotions = {
          prosody: lastMsg.models?.prosody?.scores,
          facial: state.facialScores,
        };
        generateFeedback(potentialUserMessageIdForFeedback, transcript, emotions);
      }
      // Clear the ref regardless of whether feedback was generated now or previously
      lastUserMessage.current = null;
    }

    // 4. Handle interview progression
    if (message.type === "assistant_end") {
      nextQuestion();
    }
  };

  return (
    <div className="relative grow flex flex-col w-full overflow-hidden h-[0px] rounded-lg border border-border bg-card">
      <VoiceProvider onMessage={handleMessage} onError={(error) => toast.error(error.message)}>
        <FacialAnalysisManager connect={connectFacialAnalysis} disconnect={disconnectFacialAnalysis} />
        <Messages ref={ref} />
        <Controls />
        <StartCall configId={configId} accessToken={accessToken} />
      </VoiceProvider>
    </div>
  );
}