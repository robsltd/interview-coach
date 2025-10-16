import { useVoice } from "@humeai/voice-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "./ui/button";
import { Phone } from "lucide-react";
import { toast } from "sonner";
import { useInterview } from "@/context/InterviewContext";

export default function StartCall({ configId, accessToken }: { configId?: string, accessToken: string }) {
  const { status, connect } = useVoice();
  const { state } = useInterview();

  const handleConnect = () => {
    const questions = state.questions.map((q, i) => `${i + 1}. ${q}`).join('\\n');
    const systemPrompt = `You are a professional interviewer. Your goal is to conduct a structured interview with the user. Ask the following questions one by one. Wait for the user to finish their answer before moving to the next question. Be encouraging and professional.\\n\\nHere are the questions:\\n${questions}`;

    connect({
      auth: { type: "accessToken", value: accessToken },
      configId,
      sessionSettings: {
        systemPrompt,
      },
    })
      .catch((e) => {
        toast.error("Unable to start call");
        console.error(e);
      });
  };

  return (
    <AnimatePresence>
      {status.value !== "connected" ? (
        <motion.div
          className={"fixed inset-0 p-4 flex items-center justify-center bg-background"}
          initial="initial"
          animate="enter"
          exit="exit"
          variants={{
            initial: { opacity: 0 },
            enter: { opacity: 1 },
            exit: { opacity: 0 },
          }}
        >
          <AnimatePresence>
            <motion.div
              variants={{
                initial: { scale: 0.5 },
                enter: { scale: 1 },
                exit: { scale: 0.5 },
              }}
            >
              <Button
                className={"z-50 flex items-center gap-1.5 rounded-full"}
                onClick={handleConnect}
              >
                <span>
                  <Phone
                    className={"size-4 opacity-50 fill-current"}
                    strokeWidth={0}
                  />
                </span>
                <span>Start Call</span>
              </Button>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}