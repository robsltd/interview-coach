"use client";
import { useVoice } from "@humeai/voice-react";
import { Button } from "./ui/button";
import { Mic, MicOff, Phone, RefreshCw, RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Toggle } from "./ui/toggle";
import MicFFT from "./MicFFT";
import { cn } from "@/utils";
import { useInterview } from "@/context/InterviewContext";

export default function Controls() {
  const { disconnect, status, isMuted, unmute, mute, micFft, sendUserInput } = useVoice();
  const { retryQuestion, state, endInterview, startNewInterview } = useInterview();

  const handleRetry = () => {
    const currentQuestion = state.questions[state.currentQuestionIndex];
    sendUserInput(`Could you please ask me the following question again: "${currentQuestion}"`);
    retryQuestion();
  };

  const showIncallControls = status.value === "connected";
  const showNewInterviewButton = status.value === "disconnected" && state.interviewCompleted;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 w-full p-4 pb-6 flex items-center justify-center",
        // Only show the gradient background if there are controls to display
        showIncallControls || showNewInterviewButton
          ? "bg-gradient-to-t from-card via-card/90 to-card/0"
          : "bg-transparent"
      )}
    >
      <AnimatePresence>
        {showIncallControls && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            className="p-4 bg-card border border-border/50 rounded-full flex items-center gap-4"
          >
            <Toggle
              className="rounded-full"
              pressed={!isMuted}
              onPressedChange={() => (isMuted ? unmute() : mute())}
            >
              {isMuted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
            </Toggle>
            <div className="relative grid h-8 w-48 shrink grow-0">
              <MicFFT fft={micFft} className="fill-current" />
            </div>
            <Button className="rounded-full" onClick={handleRetry} variant="outline">
              <RotateCcw className="size-4" />
            </Button>
            <Button
              className="flex items-center gap-1 rounded-full"
              onClick={() => {
                disconnect();
                endInterview();
              }}
              variant="destructive"
            >
              <span>
                <Phone className="size-4 opacity-50 fill-current" strokeWidth={0} />
              </span>
              <span>End Interview</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNewInterviewButton && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
          >
            <Button className="z-50 flex items-center gap-1.5 rounded-full" onClick={startNewInterview}>
              <span>
                <RefreshCw className="size-4" />
              </span>
              <span>Start New Interview</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}