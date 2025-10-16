"use client";

import Chat from "@/components/Chat";
import WebcamView from "@/components/WebcamView";
import { useFacialAnalysis } from "@/hooks/useFacialAnalysis";
import * as R from "remeda";
import { useInterview } from "@/context/InterviewContext";
import Expressions from "@/components/Expressions";

export default function InterviewPage({ accessToken }: { accessToken: string }) {
  const humeApiKey = process.env.NEXT_PUBLIC_HUME_API_KEY || "";
  const { connect, sendFrame, disconnect } = useFacialAnalysis(humeApiKey);
  const { state } = useInterview();

  const handleFrame = (frame: string | null) => {
    if (frame) {
      sendFrame(frame);
    }
  };

  const top3Facial = R.pipe(
    state.facialScores,
    R.entries(),
    R.sortBy(R.pathOr([1], 0)),
    R.reverse(),
    R.take(3)
  );

  return (
    <div className={"grow flex flex-col md:flex-row p-4 gap-4"}>
      {/* Reverted layout for the chat column */}
      <div className="flex flex-col flex-1 md:flex-[2] min-w-0">
        <Chat
          accessToken={accessToken}
          connectFacialAnalysis={connect}
          disconnectFacialAnalysis={disconnect}
        />
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <div className="md:aspect-video">
          <WebcamView onFrame={handleFrame} />
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <h2 className="text-sm font-medium mb-2">Live Facial Expressions</h2>
          {Object.keys(state.facialScores).length > 0 ? (
            <Expressions values={state.facialScores} />
          ) : (
            <p className="text-sm text-muted-foreground">Waiting for expression data...</p>
          )}
        </div>
      </div>
    </div>
  );
}