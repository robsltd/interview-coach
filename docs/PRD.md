## PRD AI Interview Coach: Real-Time Performance & Expression Feedback

### Context

**Go beyond rote memorization. Master the art of the interview with an AI coach that provides instant, objective feedback on not just *what* you say, but *how* you say it.**

The problem with traditional interview practice is that it's a black box. Candidates practice answers in front of a mirror, but they receive subjective, delayed feedback. They have no objective way to know if they appear confident, if their tone sounds convincing, or if their non-verbal cues are undermining their message. This leads to anxiety and uncertainty, preventing them from showcasing their true potential.

We are building an AI-powered interview coach that closes this feedback loop. By leveraging real-time expression analysiss, we can provide an experience that feels genuine while simultaneously delivering immediate, actionable insights. This transforms interview prep from a guessing game into a data-driven skill.

### Technical Foundation

This project will be built upon the **Hume EVI Next.js Starter** repository. We will adapt and extend this existing codebase, which already provides the core, low-latency conversational interface.

Our architecture will be a **Hybrid Model**:

1. **Hume EVI (Speech-to-Speech):** For the core real-time conversation between the AI Interviewer and the user. This provides the transcript and vocal prosody data.
2. **Hume Expression Measurement (Video-Only):** A parallel WebSocket stream will analyze the user's webcam feed to gather facial expression data.

### Usage Scenarios

**Scenario 1: Alex prepares for a Senior Product Manager interview.**

Alex is a product manager with five years of experience, aiming for a role at a top tech company. She's confident in her resume but knows her interview performance, especially under pressure, is her weak point.

1. **Setup:** Alex uploads her resume and pastes the URL for the "Senior Product Manager, AI Platforms" job description. The application analyzes both and generates a set of 10 tailored, challenging questions.
2. **The Interview Begins:** Alex clicks "Start Call". The AI Interviewer appears on screen and asks the first question in a natural, conversational voice: "Tell me about a time you had to launch a product with an ambiguous technical dependency."
3. **Real-Time Interaction:** As Alex answers, the UI (based on `Messages.tsx` and `Expressions.tsx`) displays her transcribed words and a live, updating graph of her top vocal and facial expressions—a combination of `Concentration`, `Anxiety`, and `Confidence`. She notices her `Confidence` score dip and makes a mental note to project more certainty. The conversation is fast and fluid; as soon as she finishes her answer, the AI immediately follows up.
4. **Feedback & Retry:** After the answer, a small, unobtrusive "Hint" notification appears. Alex can click it to see feedback from the "Observer AI": *"Great use of the STAR method. Your vocal prosody showed high `Determination` when discussing the solution, but your facial expressions registered `Doubt`. Try to align your non-verbal cues with your message."* She uses the "Retry" button for that question, focusing on her expression this time.
5. **Final Report:** After completing the interview, Alex receives a comprehensive report. It scores each answer on both content (based on the transcript) and delivery (based on the aggregated Hume data), providing a clear, actionable path for improvement.

### Milestones

This section will evolve as we build, design, and discover.

#### MS1: The Conversational Core (Internal Alpha)

Adapt the starter repository to function as an interviewer. The goal is to have a fluid, multi-turn interview conversation.

* **Specs:**
  * Utilize the existing `Chat.tsx`, `Messages.tsx`, and `Controls.tsx` components for the core UI.
  * Integrate a primary LLM to drive the interview, providing a list of questions for the EVI to ask sequentially.
  * The UI should correctly display the conversation and the **vocal prosody analysis** that comes with the EVI stream, using the `Expressions.tsx` component.

#### MS2: Multi-Modal Analysis (Internal Beta)

Layer in the visual analysis to create a complete emotional picture of the user's performance.

* **Specs:**
  * Implement a parallel WebSocket connection to the Hume Expression Measurement (EM) API, configured for the `face` model only.
  * Capture frames from the user's webcam and stream them to the EM WebSocket.
  * Modify the `Expressions.tsx` component to accept and merge two data sources: the `prosody` scores from the EVI message and the `face` scores from the EM WebSocket.
  * The UI should display a single, unified emotional analysis (top 3 expressions from both face and voice) under the user's message bubble.

#### MS3: The Observer AI & Feedback Loop (Friends & Family Beta)

Introduce the "Observer AI" to provide actionable feedback without interrupting the interview flow.

* **Specs:**
  * After each user response, package the final transcript (from EVI) and the aggregated emotional data (from EVI prosody + EM face).
  * Send this package to the primary LLM (in an "observer" mode) to generate constructive feedback.
  * Display this feedback as an optional "hint" the user can view after each question.
  * Implement "Retry Question" and "End Interview" functionality in the `Controls.tsx` component.

#### MS4: Full-Featured Experience (Public Launch)

Polish the experience and launch.

* **Specs:**
  * Build the initial setup flow: UI for resume upload and job URL input to dynamically generate interview questions.
  * Finalize the comprehensive end-of-interview summary report page.
  * Announce and release to the public.
