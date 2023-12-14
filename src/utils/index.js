import axios from "axios";

export async function getImages(name) {
  const options = {
    method: "GET",
    url: "https://apidojo-booking-v1.p.rapidapi.com/locations/auto-complete",
    params: {
      text: String(name).toString(),
      languagecode: "en-us",
    },
    headers: {
      "X-RapidAPI-Key": "52e056e34cmshb557e10a3143d38p11d6b7jsn847d96bee1af",
      "X-RapidAPI-Host": "apidojo-booking-v1.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
    return response.data
  } catch (error) {
    console.error(error);
  }
}

export function getImageURLs(data) {
  const imageURLs = [];
  data.forEach((item) => {
    if (item.image_url != undefined && item.image_url!= null ) {
      imageURLs.push(item.image_url);
    }
  });
  return imageURLs;
}

export function removeTextBetweenCurlyBrackets(text) {
  text = text.replace(/\[.*?\]/g, "");
  text = text.replace(/\(.*?\)/g, "");
  text = text.replace(/\..*?\)/g, "");
  return text;
}
