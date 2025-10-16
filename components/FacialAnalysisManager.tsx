"use client";

import { useVoice } from "@humeai/voice-react";
import { useEffect } from "react";

interface FacialAnalysisManagerProps {
  connect: () => void;
  disconnect: () => void;
}

export const FacialAnalysisManager: React.FC<FacialAnalysisManagerProps> = ({
  connect,
  disconnect,
}) => {
  const { status } = useVoice();

  useEffect(() => {
    if (status.value === "connected") {
      connect();
    } else if (status.value === "disconnected" || status.value === "error") {
      disconnect();
    }
  }, [status.value, connect, disconnect]);

  // This component does not render anything
  return null;
};