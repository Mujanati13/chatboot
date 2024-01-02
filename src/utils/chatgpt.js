export async function Chatgpt2(txt) {
  const API_KEY = "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";
  const apiRequestBody = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: txt + " :give me only the name of hotel in the above text split by ,",
      },
    ],
  };
  try {
    const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Hotels ",data.choices[0].message.content);
      return data.choices[0].message.content;
    } else {
      throw new Error("Request failed");
    }
  } catch (error) {
    console.error("Error:", error);
    // Handle errors here
  }
}

export async function contextVerifyGPT(txt) {
  const API_KEY = "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";
  const apiRequestBody = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          txt +
          " : Please review the text above and respond 'yes' if it pertains to a journey, and the specified location exists.",
      },
    ],
  };
  try {
    const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("GPT ",data.choices[0].message.content);
      return data.choices[0].message.content;
    } else {
      throw new Error("Request failed");
    }
  } catch (error) {
    console.error("Error:", error);
    // Handle errors here
  }
}


