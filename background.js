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

    // Truncate long selections
    const cleanedInput = selectedText.replace(/\n/g, " ").trim().slice(0, 600);
    const prompt = `Summarize this text in 2-3 sentences:\n\n${cleanedInput}`;

    try {
      // Call Falcon 7B model from Hugging Face
      const response = await fetch("https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct", {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: prompt })
      });

      const data = await response.json();
      console.log("🧠 Hugging Face response:", data);

      // Extract summary and clean echo if needed
      let summary = data[0]?.generated_text || "No summary returned.";
      if (summary.startsWith(prompt)) {
        summary = summary.replace(prompt, "").trim();
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
