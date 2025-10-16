"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback, // Import useCallback
} from "react";

interface InterviewState {
  questions: string[];
  currentQuestionIndex: number;
  conversationHistory: any[];
  facialScores: Record<string, number>;
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
};

const InterviewContext = createContext<{
  state: InterviewState;
  nextQuestion: () => void;
  addToHistory: (message: any) => void;
  setFacialScores: (scores: Record<string, number>) => void;
}>({
  state: initialState,
  nextQuestion: () => { },
  addToHistory: () => { },
  setFacialScores: () => { },
});

export const useInterview = () => useContext(InterviewContext);

export const InterviewProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<InterviewState>(initialState);

  // Wrap functions in useCallback
  const nextQuestion = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      currentQuestionIndex: prevState.currentQuestionIndex + 1,
    }));
  }, []);

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

  // Memoize the context value
  const value = { state, nextQuestion, addToHistory, setFacialScores };

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
};