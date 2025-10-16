"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

interface InterviewState {
  questions: string[];
  currentQuestionIndex: number;
  conversationHistory: any[];
  facialScores: Record<string, number>;
  feedback: Record<string, string>; // message.id -> feedback
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
  conversationHistory: [],
  facialScores: {},
  feedback: {},
};

const InterviewContext = createContext<{
  state: InterviewState;
  nextQuestion: () => void;
  retryQuestion: () => void;
  addToHistory: (message: any) => void;
  setFacialScores: (scores: Record<string, number>) => void;
  generateFeedback: (messageId: string, transcript: string, emotions: any) => void;
}>({
  state: initialState,
  nextQuestion: () => { },
  retryQuestion: () => { },
  addToHistory: () => { },
  setFacialScores: () => { },
  generateFeedback: () => { },
});

export const useInterview = () => useContext(InterviewContext);

export const InterviewProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<InterviewState>(initialState);

  const nextQuestion = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      currentQuestionIndex: prevState.currentQuestionIndex + 1,
    }));
  }, []);

  const retryQuestion = useCallback(() => {
    // This function will be used to re-ask the current question.
    // For now, we can just log it. The actual logic will be in the EVI call.
    console.log("Retrying question:", state.questions[state.currentQuestionIndex]);
  }, [state.currentQuestionIndex, state.questions]);

  const addToHistory = useCallback((message: any) => {
    setState((prevState) => ({
      ...prevState,
      conversationHistory: [...prevState.conversationHistory, message],
    }));
  }, []);

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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ transcript, emotions }),
        });
        const data = await response.json();
        if (data.feedback) {
          setState((prevState) => ({
            ...prevState,
            feedback: {
              ...prevState.feedback,
              [messageId]: data.feedback,
            },
          }));
        }
      } catch (error) {
        console.error("Failed to generate feedback:", error);
      }
    },
    []
  );

  const value = {
    state,
    nextQuestion,
    retryQuestion,
    addToHistory,
    setFacialScores,
    generateFeedback,
  };

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
};