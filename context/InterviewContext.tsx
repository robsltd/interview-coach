"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { useVoice, HumeVoiceMessage } from "@humeai/voice-react";

interface InterviewState {
  questions: string[];
  currentQuestionIndex: number;
  messages: HumeVoiceMessage[]; // Messages are stored here
  facialScores: Record<string, number>;
  feedback: Record<string, string>;
  interviewCompleted: boolean;
}

const initialState: InterviewState = {
  questions: [
    "Tell me about yourself.",
    "What are your biggest strengths?",
    "What is your biggest weakness?",
    "Where do you see yourself in five years?",
    "Why should we hire you?",
  ],
  currentQuestionIndex: 0,
  messages: [],
  facialScores: {},
  feedback: {},
  interviewCompleted: false,
};

const InterviewContext = createContext<{
  state: InterviewState;
  nextQuestion: () => void;
  retryQuestion: () => void;
  setFacialScores: (scores: Record<string, number>) => void;
  generateFeedback: (messageId: string, transcript: string, emotions: any) => void;
  endInterview: () => void;
  startNewInterview: () => void;
  addMessage: (message: HumeVoiceMessage) => void;
}>({
  state: initialState,
  nextQuestion: () => { },
  retryQuestion: () => { },
  setFacialScores: () => { },
  generateFeedback: () => { },
  endInterview: () => { },
  startNewInterview: () => { },
  addMessage: () => { },
});

export const useInterview = () => useContext(InterviewContext);

export const InterviewProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<InterviewState>(initialState);

  const addMessage = useCallback((newMessage: HumeVoiceMessage) => {
    setState((prevState) => {
      const lastMessage = prevState.messages[prevState.messages.length - 1];

      // --- Logic for User Messages (Replace last if it was also user_message) ---
      if (newMessage.type === "user_message") {
        if (lastMessage?.type === "user_message") {
          const updatedMessages = [...prevState.messages];
          updatedMessages[prevState.messages.length - 1] = newMessage;
          return { ...prevState, messages: updatedMessages };
        } else {
          return { ...prevState, messages: [...prevState.messages, newMessage] };
        }
      }

      // --- Logic for Assistant Messages and Prosody (using top-level ID) ---
      else if ('id' in newMessage && newMessage.id) {
        const messageId = newMessage.id;
        const existingMessageIndex = prevState.messages.findIndex(
          (msg) => 'id' in msg && msg.id === messageId
        );

        if (existingMessageIndex !== -1) {
          // Found existing message - MERGE intelligently
          const updatedMessages = [...prevState.messages];
          const existingMessage = updatedMessages[existingMessageIndex];

          // Start with the existing message
          let updatedMessage = { ...existingMessage };

          // If the new message has content, update the content
          if (newMessage.type === "assistant_message" && newMessage.message?.content) {
            // Ensure the 'message' object exists before updating content
            updatedMessage.message = {
              ...(updatedMessage.message || { role: 'assistant' }), // Keep existing role or default
              content: newMessage.message.content // Update content
            };
          }

          // If the new message has models (prosody), merge them
          if (newMessage.models) {
            updatedMessage.models = {
              ...(updatedMessage.models || {}),
              ...newMessage.models
            };
          }

          // Ensure the type is correctly set (e.g., remains assistant_message even if prosody updated)
          // But allow prosody type if it's the first time we see this ID
          if (!(newMessage.type === 'assistant_prosody' && existingMessage.type === 'assistant_message')) {
            updatedMessage.type = newMessage.type;
          }
          // Ensure it has a message property if it's supposed to be an assistant message
          if (updatedMessage.type === 'assistant_message' && !updatedMessage.message) {
            updatedMessage.message = { role: 'assistant', content: '' };
          }


          updatedMessages[existingMessageIndex] = updatedMessage;
          return { ...prevState, messages: updatedMessages };
        } else {
          // Append if no message with this ID exists yet
          // Ensure assistant_prosody isn't added without a preceding assistant_message
          if (newMessage.type !== 'assistant_prosody') {
            return { ...prevState, messages: [...prevState.messages, newMessage] };
          } else {
            // Ignore prosody if its message doesn't exist yet (should be rare)
            return prevState;
          }
        }
      }

      // --- Logic for other messages (append) ---
      else {
        // Append messages without IDs (metadata, end events)
        return { ...prevState, messages: [...prevState.messages, newMessage] };
      }
    });
  }, []);

  const nextQuestion = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      currentQuestionIndex: prevState.currentQuestionIndex + 1,
    }));
  }, []);

  const retryQuestion = useCallback(() => {
    console.log("Retrying question:", state.questions[state.currentQuestionIndex]);
  }, [state.currentQuestionIndex, state.questions]);

  const setFacialScores = useCallback((scores: Record<string, number>) => {
    setState((prevState) => ({
      ...prevState,
      facialScores: scores,
    }));
  }, []);

  const generateFeedback = useCallback(
    async (messageId: string, transcript: string, emotions: any) => {
      try {
        const response = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript, emotions }),
        });
        const data = await response.json();
        if (data.feedback) {
          setState((prevState) => ({
            ...prevState,
            feedback: { ...prevState.feedback, [messageId]: data.feedback },
          }));
        }
      } catch (error) {
        console.error("Failed to generate feedback:", error);
      }
    },
    []
  );

  const endInterview = useCallback(() => {
    setState((prevState) => ({ ...prevState, interviewCompleted: true }));
  }, []);

  const startNewInterview = useCallback(() => {
    window.location.reload();
  }, []);

  const value = {
    state,
    nextQuestion,
    retryQuestion,
    setFacialScores,
    generateFeedback,
    endInterview,
    startNewInterview,
    addMessage,
  };

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
};