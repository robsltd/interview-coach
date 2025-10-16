"use client";

import { useInterview } from "@/context/InterviewContext";
import { useCallback, useRef } from "react";
import { snakeToCamel } from "@/utils"; // Import the new helper function

export const useFacialAnalysis = (apiKey: string) => {
  const wsRef = useRef<WebSocket | null>(null);
  const { setFacialScores } = useInterview();

  const connect = useCallback(() => {
    if (!apiKey) {
      console.error(
        "Hume API key is missing for facial analysis. Add NEXT_PUBLIC_HUME_API_KEY to your .env.local file and restart the server."
      );
      return;
    }

    if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
      return;
    }

    const ws = new WebSocket(
      `wss://api.hume.ai/v0/stream/models?apiKey=${apiKey}`
    );
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ Facial analysis WebSocket connected successfully.");
      const configMessage = {
        models: {
          face: {},
        },
        stream_window_ms: 2000,
      };
      ws.send(JSON.stringify(configMessage));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.face?.predictions) {
        // Use the snakeToCamel helper function here
        const scores = data.face.predictions[0].emotions.reduce(
          (acc: Record<string, number>, e: { name: string; score: number }) => {
            const camelCaseName = snakeToCamel(e.name);
            acc[camelCaseName] = e.score;
            return acc;
          },
          {}
        );
        setFacialScores(scores);
      }
    };

    ws.onerror = (error) => {
      console.error(
        "❌ Facial analysis WebSocket error. Please verify your NEXT_PUBLIC_HUME_API_KEY.",
        error
      );
    };

    ws.onclose = (event) => {
      console.log(
        "Facial analysis WebSocket disconnected:",
        event.code,
        event.reason
      );
    };
  }, [apiKey, setFacialScores]);

  const sendFrame = useCallback((frame: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const base64Data = frame.split(",")[1];
      const payload = {
        data: base64Data,
        models: {
          face: {},
        },
      };
      wsRef.current.send(JSON.stringify(payload));
    }
  }, []);

  const disconnect = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState < WebSocket.CLOSING) {
      wsRef.current.close();
    }
  }, []);

  return { connect, disconnect, sendFrame };
};