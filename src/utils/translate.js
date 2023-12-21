import axios from "axios";

export const handleDetectLanguage = async (text) => {
  const encodedParams = new URLSearchParams();
  encodedParams.set("text", text);

  const options = {
    method: "POST",
    url: "https://google-translate113.p.rapidapi.com/api/v1/translator/detect-language",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "X-RapidAPI-Key": "443e1ee92dmshdafc2f515a5756dp1f9496jsn491f11ae1d72",
      "X-RapidAPI-Host": "google-translate113.p.rapidapi.com",
    },
    data: encodedParams,
  };

  try {
    const response = await axios.request(options);
    console.log(response.data.source_lang_code);
    return response.data.source_lang_code;
  } catch (error) {
    console.error(error);
  }
};

export const handleTranslate = async (txt) => {
  const encodedParams = new URLSearchParams();
  encodedParams.set("from", "auto");
  encodedParams.set("to", "en");
  encodedParams.set("text", txt);

  const options = {
    method: "POST",
    url: "https://google-translate113.p.rapidapi.com/api/v1/translator/text",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "X-RapidAPI-Key": "443e1ee92dmshdafc2f515a5756dp1f9496jsn491f11ae1d72",
      "X-RapidAPI-Host": "google-translate113.p.rapidapi.com",
    },
    data: encodedParams,
  };

  try {
    const response = await axios.request(options);
    console.log(response.data.trans);
    return response.data.trans
  } catch (error) {
    console.error(error);
  }
};

export async function Chatgpt(txt) {
  const APIKEY = "AIzaSyAAYHTFDusWkD7c0aN9O--x8KI-8njYOWo"; // Replace with your actual API key
  const body = {
    prompt: {
      text: txt + " : give the name of hotel in the above text split by ,",
    },
    // context : '',
  };
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta3/models/text-bison-001:generateText?key=${APIKEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const generatedText =
        data?.candidates?.[0]?.output || "No generated text available";
      console.log(generatedText);
      return generatedText;
    } else {
      throw new Error("Request failed");
    }
  } catch (error) {
    console.error("Error:", error);
    // Handle errors here
  }
}
