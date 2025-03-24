# QuickGPT – Chrome Extension for Text Summarization

QuickGPT is a Chrome extension that allows users to highlight any text on a webpage, right-click it, and receive a smart, AI-generated summary using the open-source Falcon 7B Instruct model hosted via Hugging Face.

---

## ✅ Features Implemented

- ✅ Right-click context menu integration
- ✅ Sends selected text to Hugging Face API
- ✅ Uses `tiiuae/falcon-7b-instruct` for summarization
- ✅ Truncates long input to 600 characters for stability
- ✅ Displays result in a custom floating bubble (replaces ugly `alert()`)
- ✅ Strips model prompt echoes from output for cleaner UX
- ✅ Handles unexpected API responses or errors
- ✅ Logs output using `console.log()` for debugging (via Chrome DevTools)

---

## 📂 Project Structure

QuickGPT/
├── manifest.json        ← Chrome extension config
├── background.js        ← Handles context menu & API calls
├── popup.html           ← (Optional) UI for future chat/summary
├── popup.js             ← (Optional) handles popup logic
├── styles.css           ← (Optional) styling for popup UI
├── assets/
│   └── icon.png         ← Your chatbot icon
├── README.md            ← Project documentation



# 🧪 Current Status

- [x] Right-click → Summarize works
- [x] Text is sent to Falcon 7B model
- [x] Summary is injected as a styled popup
- [x] Repeated prompt/input is stripped from output
- [ ] Summary can still be long or incoherent (model limitation)
- [ ] UI could use copy button, auto-dismiss, or loader

---

## 🛠️ Next Steps (Planned)

- [ ] Add “Copy to Clipboard” button in the bubble
- [ ] Replace bubble with a draggable or dismissible panel
- [ ] Use a summarization-specific model (`bart-large-cnn`)
- [ ] Add error handling for model loading, rate limits
- [ ] Store previous summaries in `chrome.storage`

---

## 💻 How to Test Locally

1. Go to `chrome://extensions` in Chrome
2. Enable “Developer mode”
3. Click “Load Unpacked”
4. Select the `QuickGPT/` project folder
5. Highlight any text on a webpage → Right-click → “Summarize with QuickGPT”

> 🧠 Summary will appear in a floating styled bubble in the corner of the page.

---

## 🧠 Known Issues

- Falcon 7B may echo inputs or generate longer-than-expected responses.
- Hugging Face's inference API can be slow the first time (model cold-start).
- Current summary display uses basic CSS, needs polish.
- Token is hardcoded for now — move to backend for production.

---

## 👤 Maintainer

- **Name:** Yukti  
- **Project Status:** In progress  
- **Repo Name:** `QuickGPT`

---

> Made with ❤️ using Chrome Manifest v3, Hugging Face Inference API, and open-source LLMs.