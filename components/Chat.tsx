"use client";

import { VoiceProvider, type HumeVoiceMessage, UserMessage } from "@humeai/voice-react";
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
  const { nextQuestion, generateFeedback, state } = useInterview();
  const lastUserMessage = useRef<UserMessage | null>(null);

  const configId = process.env.NEXT_PUBLIC_HUME_CONFIG_ID;

  const handleMessage = (message: HumeVoiceMessage) => {
    // 1. Handle UI scrolling
    if (timeout.current) {
      window.clearTimeout(timeout.current);
    }
    timeout.current = window.setTimeout(() => {
      if (ref.current) {
        ref.current.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });
      }
    }, 100);

    // 2. Track the last user message
    if (message.type === "user_message") {
      lastUserMessage.current = message;
    }

    // 3. THIS IS THE FIX: When the assistant starts speaking,
    // generate feedback for the last user message.
    if (message.type === "assistant_message" && lastUserMessage.current) {
      const lastMsg = lastUserMessage.current;
      // Check if feedback has already been generated
      if (!state.feedback[lastMsg.message.id]) {
        const transcript = lastMsg.message.content;
        const emotions = {
          prosody: lastMsg.models.prosody?.scores,
          facial: state.facialScores,
        };
        generateFeedback(lastMsg.message.id, transcript, emotions);
        // Clear the ref so we don't generate feedback again for the same message
        lastUserMessage.current = null;
      }
    }

    // 4. Handle interview progression
    if (message.type === "assistant_end") {
      nextQuestion();
    }
  };

  return (
    <div
      className={
        "relative grow flex flex-col w-full overflow-hidden h-[0px] rounded-lg border border-border bg-card"
      }
    >
      <VoiceProvider
        onMessage={handleMessage}
        onError={(error) => {
          toast.error(error.message);
        }}
      >
        <FacialAnalysisManager
          connect={connectFacialAnalysis}
          disconnect={disconnectFacialAnalysis}
        />
        <Messages ref={ref} />
        <Controls />
        <StartCall configId={configId} accessToken={accessToken} />
      </VoiceProvider>
    </div>
  );
}