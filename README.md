# QuickGPT – Chrome Extension for Text Summarization

QuickGPT is a Chrome extension that allows users to highlight any text on a webpage, right-click it, and receive a smart, AI-generated summary using the open-source Falcon 7B Instruct model hosted via Hugging Face.

---

## ✅ Features Implemented

- ✅ Right-click context menu integration
- ✅ Sends selected text to Hugging Face API
- ✅ Model switching: `Falcon 7B Instruct` / `BART Large CNN`
- ✅ Truncates long input to 600 characters for stability
- ✅ Floating bubble shows the summary (not `alert()`)
- ✅ “Copy to Clipboard” button inside the bubble
- ✅ Popup UI to control model & re-summarize last input
- ✅ Stores model preference & last selected text via `chrome.storage`
- ✅ Handles API errors gracefully
- ✅ Logs debug info using `console.log()` (for DevTools)

---



## 🧠 Model Options

| Model              | Description                              |
|-------------------|------------------------------------------|
| Falcon 7B Instruct | General-purpose instruction-following    |
| BART Large CNN     | Summarization-specific, concise output   |

You can switch models in the extension popup!

---

## 🚀 How to Get a Hugging Face API Token

1. Go to [https://huggingface.co](https://huggingface.co)
2. Log in or create an account
3. Click your profile > Settings > Access Tokens
4. Create a **new token** (choose "Read" access)
5. Copy the token and **replace** `YOUR_TOKEN_HERE` in both:
   - `background.js`
   - `popup.js`

headers: {
  "Authorization": "Bearer YOUR_TOKEN_HERE",
  ...
}

## 💻 How to Implement Locally

1. Go to `chrome://extensions` in Chrome
2. Enable “Developer mode”
3. Click “Load Unpacked”
4. Select the `QuickGPT/` project folder
5. Highlight any text on a webpage → Right-click → “Summarize with QuickGPT”

> Made with ❤️ using Chrome Manifest v3, Hugging Face Inference API, and open-source LLMs.