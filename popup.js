document.getElementById("summarize-btn").addEventListener("click", async () => {
    const model = document.getElementById("model-select").value;
    const lastText = await chrome.storage.local.get("lastSelectedText");
  
    if (!lastText || !lastText.lastSelectedText) {
      document.getElementById("output").innerText = "⚠️ No text previously selected.";
      return;
    }
  
    const input = lastText.lastSelectedText.replace(/\n/g, " ").trim().slice(0, 600);
  
    let endpoint = "";
    let body = {};
    if (model === "falcon") {
      endpoint = "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct";
      body = { inputs: `Summarize this text in 2-3 sentences:\n\n${input}` };
    } else if (model === "bart") {
      endpoint = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";
      body = { inputs: input };
    }
  
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Authorization": "Bearer YOUR_TOKEN_HERE",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
  
      const data = await response.json();
      let summary = data[0]?.generated_text || "No summary returned.";
      if (model === "falcon" && summary.startsWith(body.inputs)) {
        summary = summary.replace(body.inputs, "").trim();
      }
  
      document.getElementById("output").innerText = summary;
  
    } catch (err) {
      console.error(err);
      document.getElementById("output").innerText = "❌ Error fetching summary.";
    }
  });
  