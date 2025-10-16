"use client";

import { VoiceProvider } from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import { ComponentRef, useRef } from "react";
import { toast } from "sonner";
import { FacialAnalysisManager } from "./FacialAnalysisManager";

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

  const configId = process.env['NEXT_PUBLIC_HUME_CONFIG_ID'];

  return (
    <div
      className={
        "relative grow flex flex-col w-full overflow-hidden h-[0px] rounded-lg border border-border bg-card"
      }
    >
      <VoiceProvider
        onMessage={() => {
          if (timeout.current) {
            window.clearTimeout(timeout.current);
          }

          timeout.current = window.setTimeout(() => {
            if (ref.current) {
              const scrollHeight = ref.current.scrollHeight;

              ref.current.scrollTo({
                top: scrollHeight,
                behavior: "smooth",
              });
            }
          }, 200);
        }}
        onError={(error) => {
          toast.error(error.message);
        }}
      >
        {/* Add the manager here */}
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