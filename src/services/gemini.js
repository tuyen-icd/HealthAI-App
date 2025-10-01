const GEMINI_URL = "https://generativelanguage.googleapis.com/v1/models";
const MODEL = "gemini-2.5-flash";

export async function callGemini(apiKey, prompt, base64Image = null) {
  const body = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  };

  if (base64Image) {
    body.contents[0].parts.push({
      inline_data: { mime_type: "image/jpeg", data: base64Image },
    });
  }

  const res = await fetch(
    `${GEMINI_URL}/${MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}
