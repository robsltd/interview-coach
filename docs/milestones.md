# **AI Interview Coach: Project Milestones & Technical Plan**

This document outlines the phased development plan for the AI Interview Coach application. The project is structured into four main milestones, designed to incrementally build and de-risk the product, starting from the core user experience and expanding to the full feature set.

**Technical Foundation:** All development will extend the **Hume EVI Next.js Starter** repository.

### **MS1: The Conversational Core (Target: Weeks 1-2)**

**Goal:** Establish a fluid, multi-turn interview conversation driven by a predefined script. This milestone focuses exclusively on adapting the existing EVI starter to function as an interviewer, proving the core conversational loop.

**Epics & User Stories:**

* **Epic: Interview Flow Management**  
  * **Story:** As a developer, I need to create a state management system (React Context) to hold the interview state, including the list of questions, the current question index, and the conversation history.  
  * **Story:** As a developer, I need to configure the Hume EVI to be driven by a system prompt that defines its role as a professional interviewer.  
  * **Story:** As a developer, I need to implement logic that feeds the EVI the next question from the state manager after the user has finished answering the previous one.
  
* **Epic: UI Adaptation**  
  * **Story:** As a developer, I will update the Messages.tsx component to clearly distinguish between the "Interviewer" (AI) and the "User" roles, ensuring the UI remains clean and easy to follow.  
  * **Story:** As a user, I see the vocal prosody analysis from the EVI stream displayed under my transcribed answer using the existing Expressions.tsx component.

**Definition of Done:**

* A user can start a session.  
* The AI asks a series of 3-5 hard-coded questions in a sequence.  
* The conversation feels fluid, with minimal latency between turns.  
* The chat UI correctly displays the conversation and vocal prosody scores.  
* There are no visual (camera) components in the UI yet.

### **MS2: Multi-Modal Analysis & Visuals (Target: Weeks 3-4)**

**Goal:** Integrate the user's live video feed and layer in real-time facial expression analysis to create a complete emotional picture.

**Epics & User Stories:**

* **Epic: Video Integration**  
  * **Story:** As a user, I am prompted for camera and microphone permissions when I start an interview.  
  * **Story:** As a developer, I will add a webcam component (e.g., react-webcam) to the main interview UI, allowing the user to see themselves.  
  * **Story:** As a developer, I will design the layout to accommodate the video feed alongside the existing chat interface, ensuring it is responsive on different screen sizes.  
* **Epic: Facial Expression Analysis**  
  * **Story:** As a developer, I need to implement a new client-side service that establishes a parallel WebSocket connection to the Hume Expression Measurement (EM) API.  
  * **Story:** As a developer, this service will be configured to use the face model only.  
  * **Story:** As a developer, I will implement logic to capture frames from the webcam component at a regular interval (e.g., 4 times per second) and send them over the EM WebSocket.  
  * **Story:** As a developer, I will update the application's state management to store the incoming facial expression scores.  
* **Epic: Unified Expression UI**  
  * **Story:** As a developer, I will refactor the Expressions.tsx component to accept and merge two data sources: prosody scores (from the EVI message) and face scores (from the application state).  
  * **Story:** As a user, I see a single, unified emotional analysis graph under my message that reflects the combined top expressions from both my voice and face.

**Definition of Done:**

* The user's video feed is clearly visible during the interview.  
* A second, stable WebSocket connection streams video frames to the Hume EM API.  
* The UI successfully merges and displays the top 3 expressions from both vocal and facial analysis in real-time.  
* The core conversational flow from MS1 remains fast and uninterrupted.

### **MS3: The Observer AI & Feedback Loop (Target: Weeks 5-6)**

**Goal:** Introduce the "Observer AI" to provide actionable, non-intrusive feedback and add core interview controls.

**Epics & User Stories:**

* **Epic: Feedback Generation**  
  * **Story:** As a developer, I will create a new API route (/api/feedback) that accepts a user's transcript and aggregated emotion data.  
  * **Story:** As a developer, this API route will call our primary LLM with a detailed prompt, instructing it to act as an "Observer" or "Interview Coach" and generate constructive feedback.  
  * **Story:** As a developer, after each user message is finalized, the client will call this API route in the background.  
* **Epic: Feedback UI & Controls**  
  * **Story:** As a user, after I finish an answer, a small, dismissible "Hint" or "View Feedback" button appears near my message bubble.  
  * **Story:** As a user, when I click the feedback button, I see the generated feedback from the Observer AI in a popover or expandable section.  
  * **Story:** As a developer, the "End Interview" button now navigates the user to a placeholder "Report" page.

**Definition of Done:**

* The feedback generation API is functional and returns structured feedback.  
* The UI allows users to optionally view feedback for each question without interrupting the interview.  
* Users can retry a question.  
* Users can end the interview and are moved to a new screen.

### **MS4: Full-Featured Experience & Launch (Target: Weeks 7-8)**

**Goal:** Build the complete, end-to-end user journey from setup to final report, and prepare for public launch.

**Epics & User Stories:**

* **Epic: Onboarding & Setup**  
  * **Story:** As a user, I see a landing page where I can start the interview process.  
  * **Story:** As a user, I can upload my resume (PDF or DOCX) and paste a URL to a job description on this landing page.  
  * **Story:** As a developer, I will create a new API route that parses the resume content and scrapes the job description URL.  
  * **Story:** As a developer, this API route will then call the primary LLM with the parsed content to dynamically generate a list of relevant interview questions.  
* **Epic: Comprehensive Reporting**  
  * **Story:** As a developer, I will design and build a final "Interview Report" page.  
  * **Story:** As a user, on the report page, I can see a summary of my overall performance.  
  * **Story:** As a user, I can review each of my answers, the associated combined emotional analysis, and the detailed feedback from the Observer AI.  
* **Epic: Polish & Deployment**  
  * **Story:** As a team, we will conduct thorough end-to-end testing of the entire user flow.  
  * **Story:** As a developer, I will ensure all environment variables (API keys, etc.) are correctly configured for production deployment \[cite: humeai/hume-evi-next-js-starter/hume-evi-next-js-starter-2cc05df476468e0daea8c854315c02a117b64cb1/.env.example\].  
  * **Story:** As a team, we will prepare marketing materials and a changelog for the public launch.

**Definition of Done:**

* The entire user journey from onboarding to final report is complete and polished.  
* The application is deployed to a production environment.  
* The product is launched to the public.# **AI Interview Coach: Project Milestones & Technical Plan**

This document outlines the phased development plan for the AI Interview Coach application. The project is structured into four main milestones, designed to incrementally build and de-risk the product, starting from the core user experience and expanding to the full feature set.

**Technical Foundation:** All development will extend the **Hume EVI Next.js Starter** repository.

### **MS1: The Conversational Core (Target: Weeks 1-2)**

**Goal:** Establish a fluid, multi-turn interview conversation driven by a predefined script. This milestone focuses exclusively on adapting the existing EVI starter to function as an interviewer, proving the core conversational loop.

**Epics & User Stories:**

* **Epic: Interview Flow Management**  
  * **Story:** As a developer, I need to create a state management system (e.g., React Context or Zustand) to hold the interview state, including the list of questions, the current question index, and the conversation history.  
  * **Story:** As a developer, I need to configure the Hume EVI to be driven by a system prompt that defines its role as a professional interviewer.  
  * **Story:** As a developer, I need to implement logic that feeds the EVI the next question from the state manager after the user has finished answering the previous one.  
* **Epic: UI Adaptation**  
  * **Story:** As a developer, I will modify the Controls.tsx component to remove the Mute and MicFFT features, retaining only the "End Call" functionality for this milestone.  
  * **Story:** As a developer, I will update the Messages.tsx component to clearly distinguish between the "Interviewer" (AI) and the "User" roles, ensuring the UI remains clean and easy to follow.  
  * **Story:** As a user, I see the vocal prosody analysis from the EVI stream displayed under my transcribed answer using the existing Expressions.tsx component.

**Definition of Done:**

* A user can start a session.  
* The AI asks a series of 3-5 hard-coded questions in a sequence.  
* The conversation feels fluid, with minimal latency between turns.  
* The chat UI correctly displays the conversation and vocal prosody scores.  
* There are no visual (camera) components in the UI yet.

### **MS2: Multi-Modal Analysis & Visuals (Target: Weeks 3-4)**

**Goal:** Integrate the user's live video feed and layer in real-time facial expression analysis to create a complete emotional picture.

**Epics & User Stories:**

* **Epic: Video Integration**  
  * **Story:** As a user, I am prompted for camera and microphone permissions when I start an interview.  
  * **Story:** As a developer, I will add a webcam component (e.g., react-webcam) to the main interview UI, allowing the user to see themselves.  
  * **Story:** As a developer, I will design the layout to accommodate the video feed alongside the existing chat interface, ensuring it is responsive on different screen sizes.  
* **Epic: Facial Expression Analysis**  
  * **Story:** As a developer, I need to implement a new client-side service that establishes a parallel WebSocket connection to the Hume Expression Measurement (EM) API.  
  * **Story:** As a developer, this service will be configured to use the face model only.  
  * **Story:** As a developer, I will implement logic to capture frames from the webcam component at a regular interval (e.g., 4 times per second) and send them over the EM WebSocket.  
  * **Story:** As a developer, I will update the application's state management to store the incoming facial expression scores.  
* **Epic: Unified Expression UI**  
  * **Story:** As a developer, I will refactor the Expressions.tsx component to accept and merge two data sources: prosody scores (from the EVI message) and face scores (from the application state).  
  * **Story:** As a user, I see a single, unified emotional analysis graph under my message that reflects the combined top expressions from both my voice and face.

**Definition of Done:**

* The user's video feed is clearly visible during the interview.  
* A second, stable WebSocket connection streams video frames to the Hume EM API.  
* The UI successfully merges and displays the top 3 expressions from both vocal and facial analysis in real-time.  
* The core conversational flow from MS1 remains fast and uninterrupted.

### **MS3: The Observer AI & Feedback Loop (Target: Weeks 5-6)**

**Goal:** Introduce the "Observer AI" to provide actionable, non-intrusive feedback and add core interview controls.

**Epics & User Stories:**

* **Epic: Feedback Generation**  
  * **Story:** As a developer, I will create a new API route (/api/feedback) that accepts a user's transcript and aggregated emotion data.  
  * **Story:** As a developer, this API route will call our primary LLM with a detailed prompt, instructing it to act as an "Observer" or "Interview Coach" and generate constructive feedback.  
  * **Story:** As a developer, after each user message is finalized, the client will call this API route in the background.  
* **Epic: Feedback UI & Controls**  
  * **Story:** As a user, after I finish an answer, a small, dismissible "Hint" or "View Feedback" button appears near my message bubble.  
  * **Story:** As a user, when I click the feedback button, I see the generated feedback from the Observer AI in a popover or expandable section.  
  * **Story:** As a developer, I will add a "Retry Question" button to the Controls.tsx component. When clicked, it instructs the state manager to have the EVI re-ask the current question.  
  * **Story:** As a developer, the "End Interview" button now navigates the user to a placeholder "Report" page.

**Definition of Done:**

* The feedback generation API is functional and returns structured feedback.  
* The UI allows users to optionally view feedback for each question without interrupting the interview.  
* Users can retry a question.  
* Users can end the interview and are moved to a new screen.

### **MS4: Full-Featured Experience & Launch (Target: Weeks 7-8)**

**Goal:** Build the complete, end-to-end user journey from setup to final report, and prepare for public launch.

**Epics & User Stories:**

* **Epic: Onboarding & Setup**  
  * **Story:** As a user, I see a landing page where I can start the interview process.  
  * **Story:** As a user, I can upload my resume (PDF or DOCX) and paste a URL to a job description on this landing page.  
  * **Story:** As a developer, I will create a new API route that parses the resume content and scrapes the job description URL.  
  * **Story:** As a developer, this API route will then call the primary LLM with the parsed content to dynamically generate a list of relevant interview questions.  
* **Epic: Comprehensive Reporting**  
  * **Story:** As a developer, I will design and build a final "Interview Report" page.  
  * **Story:** As a user, on the report page, I can see a summary of my overall performance.  
  * **Story:** As a user, I can review each of my answers, the associated combined emotional analysis, and the detailed feedback from the Observer AI.  
* **Epic: Polish & Deployment**  
  * **Story:** As a team, we will conduct thorough end-to-end testing of the entire user flow.  
  * **Story:** As a developer, I will ensure all environment variables (API keys, etc.) are correctly configured for production deployment \[cite: humeai/hume-evi-next-js-starter/hume-evi-next-js-starter-2cc05df476468e0daea8c854315c02a117b64cb1/.env.example\].  
  * **Story:** As a team, we will prepare marketing materials and a changelog for the public launch.

**Definition of Done:**

* The entire user journey from onboarding to final report is complete and polished.  
* The application is deployed to a production environment.  
* The product is launched to the public.
