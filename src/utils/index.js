import axios from "axios";

async function getLongImage(code) {
  const options = {
    method: "GET",
    url: "https://apidojo-booking-v1.p.rapidapi.com/properties/get-hotel-photos",
    params: {
      hotel_ids: code,
      languagecode: "en-us",
    },
    headers: {
      'X-RapidAPI-Key': '443e1ee92dmshdafc2f515a5756dp1f9496jsn491f11ae1d72',
      'X-RapidAPI-Host': 'apidojo-booking-v1.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    return getImageURLsV2(response.data.data[code]);
  } catch (error) {
    console.error(error);
  }
}

export async function getImages(name) {
  const options = {
    method: "GET",
    url: "https://apidojo-booking-v1.p.rapidapi.com/locations/auto-complete",
    params: {
      text: String(name).toString(),
      languagecode: "en-us",
    },
    headers: {
      'X-RapidAPI-Key': '443e1ee92dmshdafc2f515a5756dp1f9496jsn491f11ae1d72',
      'X-RapidAPI-Host': 'apidojo-booking-v1.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
    const id = response.data[0].dest_id;
    const data = await getLongImage(id);
    return data;
  } catch (error) {
    console.error(error);
  }
}

export function getImageURLs(data) {
  const imageURLs = [];
  data.forEach((item) => {
    if (item.image_url != undefined && item.image_url != null) {
      imageURLs.push(item.image_url);
    }
  });
  return imageURLs;
}

export function getImageURLsV2(data) {
  const imageURLs = [];
  data.forEach((item) => {
    if (item != undefined && item != null) {
      imageURLs.push(item[6]);
    }
  });
  return imageURLs.slice(0, 15);
}

export function removeTextBetweenCurlyBrackets(text) {
  text = text.replace(/\[.*?\]/g, "");
  text = text.replace(/\(.*?\)/g, "");
  text = text.replace(/\..*?\)/g, "");
  text = text.replace(/\(.*?\s/g, "");
  // text = text.replace( /(?:https?|ftp):\/\/[\n\S]+/gi);


  return text;
}

export function getTextBetweenPhraseAndDot(text, phrase) {
  const txt = text.replaceAll("*", "");
  const regex = new RegExp(`${phrase}(.*?)\\.`);
  const matches = txt.match(regex);

  if (matches && matches.length > 1) {
    console.log(matches[1]);
    return matches[1].replaceAll(":","");
  } else {
    return null;
  }
}

export async function contextVerify(txt) {
  const APIKEY = "AIzaSyAZkjWQUwZehg84i2EGlWZBA0-8_B9Fv5U"; // Replace with your actual API key
  const body = {
    prompt: {
      text: txt + " : Please review the text above and respond 'yes' if it pertains to a journey, and the specified location exists.",
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