"use client";
import { cn } from "@/utils";
import Expressions from "./Expressions";
import { AnimatePresence, motion } from "motion/react";
import { ComponentRef, forwardRef } from "react";
import { useInterview } from "@/context/InterviewContext";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Lightbulb } from "lucide-react";
import { HumeVoiceMessage, UserMessage, AssistantMessage } from "@humeai/voice-react"; // Import types

const Messages = forwardRef<
  ComponentRef<typeof motion.div>,
  Record<never, never>
>(function Messages(_, ref) {
  const { state } = useInterview();
  const { messages } = state;

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
          {messages.map((msg: HumeVoiceMessage, index: number) => { // Index is now important
            // Filter out messages we don't want to render explicitly
            if (
              msg.type !== "user_message" &&
              msg.type !== "assistant_message" ||
              (msg.type === "assistant_message" && !msg.message?.content && !msg.models?.prosody?.scores)
            ) {
              return null;
            }

            let role: "User" | "Interviewer" = "User";
            let prosodyScores: Record<string, number> | undefined;
            let content: string | undefined;
            let feedbackKey: string | undefined; // Key to look up feedback

            if (msg.type === "user_message") {
              role = "User";
              prosodyScores = msg.models?.prosody?.scores;
              content = msg.message?.content;
              feedbackKey = `userMsg-${index}`; // Use index for feedback lookup
            } else if (msg.type === "assistant_message") {
              role = "Interviewer";
              prosodyScores = msg.models?.prosody?.scores; // We won't render these, but keep for consistency
              content = msg.message?.content;
              // No feedback for assistant
            }

            const feedback = feedbackKey ? state.feedback[feedbackKey] : undefined;

            if (!content) return null;


            return (
              <motion.div
                // Use index as part of the key for stability during updates
                key={(msg.type === 'assistant_message' ? msg.id : `user-${index}`) || `msg-${index}`}
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

                <div className={"pb-3 px-3"}>{content}</div>


                {/* Only show expressions for the User */}
                {role === "User" && prosodyScores && (
                  <div>
                    <p className="px-3 pt-2 text-xs font-medium text-muted-foreground">Vocal Expressions</p>
                    <Expressions values={prosodyScores} />
                  </div>
                )}

                {/* Use the index-based feedback lookup */}
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
          })}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
});

export default Messages;