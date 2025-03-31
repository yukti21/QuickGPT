const modelSelect = document.getElementById("model-select");
const outputDiv = document.getElementById("output");
const summarizeBtn = document.getElementById("summarize-btn");

// Load previously selected model
chrome.storage.local.get("selectedModel", (data) => {
  if (data.selectedModel) {
    modelSelect.value = data.selectedModel;
  }
});

// Save selected model on change
modelSelect.addEventListener("change", (e) => {
  chrome.storage.local.set({ selectedModel: e.target.value });
});

// Handle summarization
summarizeBtn.addEventListener("click", async () => {
  const model = modelSelect.value;
  const { lastSelectedText } = await chrome.storage.local.get("lastSelectedText");

  if (!lastSelectedText) {
    outputDiv.innerText = "⚠️ No text previously selected.";
    return;
  }

  const input = lastSelectedText.replace(/\n/g, " ").trim().slice(0, 600);

  let endpoint = "";
  let body = {};

  if (model === "bart") {
    endpoint = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";
    body = { inputs: input };
  } else {
    endpoint = "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct";
    body = { inputs: `Summarize this text in 2-3 sentences:\n\n${input}` };
  }

  try {
    outputDiv.innerText = "⏳ Summarizing...";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": "Bearer YOUR_TOKEN_HERE",  // Replace this
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    let summary = data[0]?.generated_text || "No summary returned.";

    if (model === "falcon" && summary.startsWith(body.inputs)) {
      summary = summary.replace(body.inputs, "").trim();
    }

    outputDiv.innerText = summary;

  } catch (err) {
    console.error(err);
    outputDiv.innerText = "❌ Error fetching summary.";
  }
});
