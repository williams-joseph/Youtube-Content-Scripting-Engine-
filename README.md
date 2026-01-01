# PATTERN SENSE SCRIPTING ENGINE

**Engineered by Williams Joseph**

A specialized generative AI interface designed exclusively for the **Pattern Sense** YouTube channel. This application serves as a strict epistemic filter and script generation engine, converting raw cognitive science research into analytically authoritative video scripts that adhere to specific structural and stylistic canons.

**Live Application:** [pattern-sense-scripting-tool.web.app](https://pattern-sense-scripting-tool.web.app)
**YouTube Channel:** [Pattern Sense](https://www.youtube.com/channel/UC4Chiim8Ln_QauvOcmz8PWw)

---

## 🧠 Core Philosophy

The engine is built to enforce a specific content philosophy:
1.  **Mechanism-First:** Explaining systems, not stories.
2.  **Epistemic Humility:** Explaining > Advising. No prescriptions or "fixing."
3.  **Anti-Identity:** Describing processing states (e.g., "High-Latency Processing") rather than identity labels (e.g., "Overthinkers").
4.  **Clinical Aesthetic:** Promoting a "Clinical Symbolic" visual style (flat vector, minimalist, specific color palette).

---

## ⚙️ How It Works

The application operates on a dual-phase workflow powered by the Google Gemini API (Model: `gemini-flash-latest`).

### Phase 1: Research Protocol
*   **Input:** Topic, Core Theme, Hook, Angle, Keywords.
*   **Output:** A structured research guide designed for **NotebookLM**. This guide generates specific prompts to extract mechanistic data, misclassification analysis, and boundary conditions from source material without hallucinating narratives.
*   *Note:* Research guides are transient and not stored in the local history.

### Phase 2: Script Synthesis
*   **Input:** Filtered, raw text output from the NotebookLM research phase.
*   **Process:** The engine analyzes the input against the **Master Rules**:
    *   **Automatic Title Refinement:** Rewrites identity-based titles (e.g., "The Burden of Depth") into mechanistic ones (e.g., "When Analytical Processing Becomes a Load").
    *   **Strict Hook Structure:** Enforces a 12-15 second, 4-step hook (Recognition → Misdiagnosis → Reversal → Deferred Promise).
    *   **The Pivot:** Mandates the transition phrase *"What’s happening here is a mechanism known as..."*
*   **Output:**
    1.  **Full Longform Script (6-8 mins):** Complete with visual generation prompts.
    2.  **Vertical Short Script (60s):** A self-contained micro-model of the same topic.

---

## 🏗️ Technical Architecture

This is a high-performance React application built for script reliability and safety.

*   **Framework:** React 19 (Vite)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS (Dark System UI)
*   **AI Integration:** `@google/genai` (Gemini Flash Tier)
*   **Deployment:** Firebase Hosting
*   **Security:** Environment-based API key management.

### App Logic Flow
1.  **Input Parsing:** Detects "Bulk Paste" formats or accepts raw research dumps.
2.  **Prompt Engineering:** `geminiService.ts` constructs a complex system prompt enforcing the *Pattern Sense* voice.
3.  **Generation:** Fault-tolerant API calls with quota-aware error handling.
4.  **Persistence:** Local history storage for session continuity.

---

## 🎨 Visual Style Guide

The app enforces a "Clinical Symbolic" visual language for image generation prompts embedded in the scripts:
*   **Style:** Flat vector, diagrammatic, instructional.
*   **Palette:** Black, White, Grey, with Red ONLY for semantic emphasis (load/friction).
*   **Constraints:** No faces, no text, no shadows, no cinematic lighting.

---

## 🚀 Installation & Local Development

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env.local` file with your Gemini API Key:
    ```env
    GEMINI_API_KEY=your_key_here
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```

---

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

**© 2026 Williams Joseph**
