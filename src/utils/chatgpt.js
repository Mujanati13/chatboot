export async function Chatgpt2(txt) {
  const apiKey = process.env.REACT_APP_API_KEY;
  const apiRequestBody = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "give me the names of hotels in this text separated by commas. If not, return none :"+ txt,
      },
    ],
  };
  try {
    const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
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
  const apiKey = process.env.REACT_APP_API_KEY;
  const apiRequestBody = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          txt +
          " : Please review the text above and respond only with 'yes' if it pertains to a journey, and the specified location exists.",
      },
    ],
  };
  try {
    const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
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


