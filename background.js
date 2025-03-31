// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "quickgpt-summarize",
    title: "Summarize with QuickGPT",
    contexts: ["selection"]
  });
});

// Handle right-click events
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "quickgpt-summarize") {
    const selectedText = info.selectionText;

    if (!selectedText) {
      console.log("No text selected");
      return;
    }

    // Save selected text for popup use
    await chrome.storage.local.set({ lastSelectedText: selectedText });

    const cleanedInput = selectedText.replace(/\n/g, " ").trim().slice(0, 600);

    // Read selected model from popup (defaults to Falcon)
    const { selectedModel = "falcon" } = await chrome.storage.local.get("selectedModel");

    let endpoint = "";
    let body = {};
    if (selectedModel === "bart") {
      endpoint = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";
      body = { inputs: cleanedInput };
    } else {
      endpoint = "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct";
      body = { inputs: `Summarize this text in 2-3 sentences:\n\n${cleanedInput}` };
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Authorization": "Bearer YOUR_TOKEN_HERE",  // Replace with your actual token
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      console.log("🧠 Hugging Face response:", data);

      let summary = data[0]?.generated_text || "No summary returned.";
      if (selectedModel === "falcon" && summary.startsWith(body.inputs)) {
        summary = summary.replace(body.inputs, "").trim();
      }

      // Inject floating summary bubble
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (summaryText) => {
          // Remove existing bubble if any
          const existing = document.getElementById("quickgpt-bubble");
          if (existing) existing.remove();

          const bubble = document.createElement("div");
          bubble.id = "quickgpt-bubble";
          bubble.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            max-width: 400px;
            max-height: 250px;
            background: #111827;
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            font-size: 14px;
            line-height: 1.4;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 9999;
            overflow-y: auto;
            white-space: pre-wrap;
            font-family: sans-serif;
          `;

          // Close button
          const closeBtn = document.createElement("span");
          closeBtn.innerText = "×";
          closeBtn.style.cssText = "float: right; cursor: pointer; font-weight: bold; margin-left: 10px;";
          closeBtn.onclick = () => bubble.remove();
          bubble.prepend(closeBtn);

          // Summary text
          const text = document.createElement("div");
          text.innerText = "🧠 QuickGPT Summary:\n\n" + summaryText;
          bubble.appendChild(text);

          // Copy button
          const copyBtn = document.createElement("button");
          copyBtn.innerText = "📋 Copy";
          copyBtn.style.cssText = `
            margin-top: 10px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 6px 12px;
            font-size: 13px;
            cursor: pointer;
          `;

          copyBtn.onclick = () => {
            navigator.clipboard.writeText(summaryText)
              .then(() => {
                copyBtn.innerText = "✅ Copied!";
                setTimeout(() => copyBtn.innerText = "📋 Copy", 2000);
              })
              .catch(err => {
                console.error("Copy failed: ", err);
                copyBtn.innerText = "❌ Failed";
              });
          };

          bubble.appendChild(copyBtn);
          document.body.appendChild(bubble);
        },
        args: [summary]
      });

    } catch (error) {
      console.error("QuickGPT error:", error);
    }
  }
});
