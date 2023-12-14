import React, { useState, useEffect, useRef } from "react";
import Header from "../components/header";
import { Input, Spin } from "antd";
import { SendOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import Logo from "../images/logo.png";
import {
  getImageURLs,
  getImages,
  removeTextBetweenCurlyBrackets,
} from "../utils";

export default function ChatBoot() {
  const [isLoading, setIsLoading] = useState(0);
  const [textValue, setTextValue] = useState("");
  const [content, setContent] = useState([]);
  const bottomRef = useRef(null);

  //get hotel names from the text
  function splitHotelNamesAndImages(description) {
    const hotelPattern = /\*\*(.*?)\*\* is a/g;
    const imagePattern = /\[Image of (.*?)\]\((.*?)\)/g;

    let hotels = [];
    let hotelMatch;

    while ((hotelMatch = hotelPattern.exec(description)) !== null) {
      hotels.push(hotelMatch[1]);
    }

    let images = [];
    let imageMatch;

    while ((imageMatch = imagePattern.exec(description)) !== null) {
      images.push({ name: imageMatch[1], url: imageMatch[2] });
    }

    return { hotels, images };
  }

  //handle text input value
  const handleText = (e) => {
    setTextValue(e.target.value);
  };
  //srcall to the bottom when the text state is change
  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [content]);

  //hanlde text generator
  const generateText = async () => {
    setTextValue("");
    setContent((prevContent) => [
      ...prevContent,
      {
        text: (
          <div className="w-full m-auto bg-gray-100 p-3  mt-2 rounded-md">
            {textValue}
          </div>
        ),
        type: "user",
      },
    ]);
    const APIKEY = "AIzaSyAqtgYQGVHDAfQWILDH7TP6O5au79kCCwU"; // Replace with your actual API key
    const body = {
      prompt: {
        text:
          textValue +
          " Describe a travel agency without directly stating its name and create a travel itinerary for a particular destination. Include a list of two to five hotels with their names starting with 'Hotel,' brief descriptions, and incorporate their respective images",
      },
      // context : '',
    };
    try {
      setIsLoading(1);
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
        setIsLoading(2);
        // Handle the response data here
        console.log(data);
        const generatedText =
          data?.candidates?.[0]?.output || "No generated text available";
        console.log(splitHotelNamesAndImages(generatedText.toString()));
        scrollToBottom(); // Scroll after sending a message
        const hotelnames = splitHotelNamesAndImages(generatedText.toString());
        console.log(hotelnames);
        const imageURLsTable = []; // Create an array to store objects with hotel name and first image URL
        for (var i = 0; i < 1 ; i++) {
          if(i>2){break}
          const images = await getImages(hotelnames.hotels[i]); // Assuming hotelnames array exists
          console.log(images);
          const list = getImageURLs(images);
          const hotelName = hotelnames.hotels[i]; // Assuming hotelnames array exists and has valid hotel names
          const firstImageURL = list.length ? list[0] : null; // Get the first image URL
          // Create an object with hotel name and first image URL
          const entry = {
            name: hotelName,
            url: firstImageURL,
          };
          // Push the entry into the imageURLsTable array
          imageURLsTable.push(entry);
        }
        console.log(imageURLsTable);
        setContent([
          ...content,
          {
            text: (
              <div className="w-100 m-auto bg-gray-100 p-3  mt-2 rounded-md">
                {textValue}
              </div>
            ),
            type: "user",
          },
          {
            text: (
              <div className="w-100 m-auto bg-blue-100 p-3  mt-2 rounded-md">
                {
                  <ReactMarkdown
                    children={removeTextBetweenCurlyBrackets(generatedText)}
                  />
                }
                <div className="grid md:grid-cols-4 grid-cols-2 gap-3 mt-4">
                  {imageURLsTable.map((hotel) => (
                    <div>
                      <img
                        className="rounded-md object-contain"
                        src={hotel.url}
                      />
                      <div className="font-light text-sm text-black mt-1">
                        {hotel.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ),
            type: "generated",
          },
        ]);
        setIsLoading(0);
      } else {
        setIsLoading(0);
        throw new Error("Request failed");
      }
    } catch (error) {
      setIsLoading(0);
      setContent([
        ...content,
        {
          text: (
            <div className="w-full bg-slate-100 p-3 mt-2 rounded-md">
              {textValue}
            </div>
          ),
          type: "user",
        },
        {
          text: (
            <div className="w-full bg-red-100 p-3 mt-2 rounded-md">
              Error while retrieve response
            </div>
          ),
          type: "generated",
        },
      ]);
      console.error("Error:", error);
      // Handle errors here
    }
  };

  //handle send Req
  const handleSendRequest = async () => {
    if (textValue.length > 5) {
      await generateText();
      scrollToBottom(); // Scroll after sending a message
    }
  };

  return (
    <div className="overflow-y-hidden">
      <div className="fixed top-0 w-full">
        <Header cur='chatbot'/>
      </div>
      <div className="w-full h-screen p-2 md:pl-60 md:pr-60 overflow-y-auto md:pt-14 pt-10 pb-10">
        {content.length == 0 ? (
          <div>
            <div className="text-center mt-20 md:text-2xl font-medium animate-pulse">
              How can I help you today?
            </div>
            <div className="flex justify-center">
              <img
                className="mt-4 ease-in-out duration-300"
                width={100}
                height={100}
                src={Logo}
                alt=""
              />
            </div>
          </div>
        ) : (
          content.map((message, index) => (
            <div
              key={index}
              className={
                message.type === "user" ? "text-blue-600" : "text-green-600"
              }
            >
              {message.text}
            </div>
          ))
        )}
        {isLoading == 1 ? (
          <div className="">
            <div>
              <div className="animate-pulse bg-blue-100 h-20 mt-2 rounded-md p-4 flex items-center space-x-4">
                <img
                  width={30}
                  height={30}
                  src="https://www.gstatic.com/lamda/images/sparkle_resting_v2_1ff6f6a71f2d298b1a31.gif"
                />
                <div className="font-normal text-sm">Text processing</div>
              </div>
            </div>
          </div>
        ) : isLoading == 2 ? (
          <div className="w-full">
            <div className="">
              <div className="animate-pulse bg-blue-100 h-20 mt-2 rounded-md p-4 flex items-center space-x-4">
                <img
                  width={30}
                  height={30}
                  src="https://www.gstatic.com/lamda/images/sparkle_resting_v2_1ff6f6a71f2d298b1a31.gif"
                />
                <div className="font-normal text-sm">Image Processing</div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        <div ref={bottomRef} />
      </div>

      <div className="fixed bottom-0 w-full h-12 pl-2 pr-2 md:pl-60 md:pr-64 bg-white">
        <Input
          onKeyPress={(e) => e.key === "Enter" && handleSendRequest()}
          disabled={isLoading}
          value={textValue}
          onChange={handleText}
          className="h-10 text-lg"
          placeholder="Type something..."
          suffix={
            <SendOutlined
              onClick={handleSendRequest}
              className="cursor-pointer"
            />
          }
        />
      </div>
    </div>
  );
}
