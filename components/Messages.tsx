"use client";
import { cn } from "@/utils";
import { useVoice } from "@humeai/voice-react";
import Expressions from "./Expressions";
import { AnimatePresence, motion } from "motion/react";
import { ComponentRef, forwardRef } from "react";
import { useInterview } from "@/context/InterviewContext";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Lightbulb } from "lucide-react";

const Messages = forwardRef<
  ComponentRef<typeof motion.div>,
  Record<never, never>
>(function Messages(_, ref) {
  const { messages } = useVoice();
  const { state } = useInterview();

  return (
    <motion.div
      layoutScroll
      className={"grow overflow-auto p-4 pt-24"}
      ref={ref}
    >
      <motion.div
        className={"max-w-2xl mx-auto w-full flex flex-col gap-4 pb-24"}
      >
        <AnimatePresence mode={"popLayout"}>
          {messages.map((msg, index) => {
            if (
              msg.type === "user_message" ||
              msg.type === "assistant_message"
            ) {
              const role = msg.message.role === "assistant" ? "Interviewer" : "User";
              const prosodyScores = msg.models.prosody?.scores;
              const feedback = state.feedback[msg.message.id];

              return (
                <motion.div
                  key={msg.type + index}
                  className={cn(
                    "w-[80%]", "bg-card", "border border-border rounded-xl",
                    role === "User" ? "ml-auto" : ""
                  )}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 0 }}
                >
                  <div className={"flex items-center justify-between pt-4 px-3"}>
                    <div className={cn("text-xs capitalize font-medium leading-none opacity-50 tracking-tight")}>
                      {role}
                    </div>
                    <div className={cn("text-xs capitalize font-medium leading-none opacity-50 tracking-tight")}>
                      {msg.receivedAt.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                    </div>
                  </div>

                  <div className={"pb-3 px-3"}>{msg.message.content}</div>

                  {prosodyScores && (
                    <div>
                      <p className="px-3 pt-2 text-xs font-medium text-muted-foreground">Vocal Expressions</p>
                      <Expressions values={prosodyScores} />
                    </div>
                  )}

                  {role === "User" && feedback && (
                    <div className="px-3 pb-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="rounded-full">
                            <Lightbulb className="size-4 mr-2" /> View Feedback
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <p className="text-sm">{feedback}</p>
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </motion.div>
              );
            }
            return null;
          })}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
});

export default Messages;