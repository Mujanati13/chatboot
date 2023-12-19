import React, { useState, useEffect, useRef } from "react";
import Header from "../components/header";
import { Input, message } from "antd";
import { SendOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import Logo from "../../src/images/logov1.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../global.css";
import {
  getImageURLs,
  getImages,
  getTextBetweenPhraseAndDot,
  removeTextBetweenCurlyBrackets,
} from "../utils";
import { Link } from "react-router-dom";
import { checkForTravelWords, getRandomCity } from "../utils/city";
import {
  Chatgpt,
  handleDetectLanguage,
  handleTranslate,
} from "../utils/translate";

export default function ChatBoot() {
  const [isLoading, setIsLoading] = useState(0);
  const [textValue, setTextValue] = useState("");
  const [RandomText, setRandomText] = useState(
    `I wanna to visit ${getRandomCity()}`
  );
  const [content, setContent] = useState([]);
  const bottomRef = useRef(null);

  //handle images switch
  const onChange = (currentSlide) => {
    console.log(currentSlide);
  };

  //get hotel names from the text
  // function splitHotelNamesAndImages(description) {
  //   const hotelPattern = /\*\*(.*?)\*\* is a/g;
  //   const imagePattern = /\[Image of (.*?)\]\((.*?)\)/g;

  //   let hotels = [];
  //   let hotelMatch;

  //   let images = [];
  //   let imageMatch;

  //   while ((imageMatch = imagePattern.exec(description)) !== null) {
  //     hotels.push(imageMatch[1]);
  //     images.push({ name: imageMatch[1], url: imageMatch[2] });
  //   }
  //   if (hotels.length == 0) {
  //     while ((hotelMatch = hotelPattern.exec(description)) !== null) {
  //       hotels.push(hotelMatch[1]);
  //     }
  //   }

  //   return { hotels, images };
  // }

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
    console.log(handleDetectLanguage("hello world"));
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
    const TranslateTxt = await handleTranslate(textValue);
    const APIKEY = "AIzaSyAJewv2MpfI1ZnbxQSAN0JcYFXgIPb5kjI"; // Replace with your actual API key
    const body = {
      prompt: {
        text:
          TranslateTxt +
          "Describe as a travel agency without directly stating its name and create travel itinerary for a particular destination 5 day. Include a list of two to 3 hotels with their names with brief descriptions, and one incorporate their respective images split by line",
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
        //Handle the response data here
        console.log(data);
        const generatedText =
          data?.candidates?.[0]?.output || "No generated text available";
        console.log((await Chatgpt(generatedText.toString())) + " hhh");

        scrollToBottom(); // Scroll after sending a message
        const hotelnames = await Chatgpt(generatedText.toString());
        const txtwithout = hotelnames.replaceAll("*", "");
        const hotelList = txtwithout.split(",");
        setIsLoading(3);
        const imageURLsTable = []; // Create an array to store objects with hotel name and first image URL
        for (var i = 0; i < hotelList.length; i++) {
          if (i > 2) {
            break;
          }
          const list = await getImages(hotelList[i]); // Assuming hotelnames array exists
          console.log(list);
          const hotelName = hotelList[i]; // Assuming hotelnames array exists and has valid hotel names
          // Create an object with hotel name and first image URL
          const entry = {
            name: hotelName,
            url: list,
          };
          // Push the entry into the imageURLsTable array
          imageURLsTable.push(entry);
        }
        console.log(imageURLsTable);
        setContent([
          ...content,
          {
            text: (
              <div className="w-100 m-auto bg-gray-100 p-3 mt-2 rounded-md">
                {textValue}
              </div>
            ),
            type: "user",
          },
          {
            text: (
              <div className="w-100 m-auto bg-blue-100 p-3 mt-2 pb-3 rounded-md">
                {
                  <ReactMarkdown
                    children={removeTextBetweenCurlyBrackets(generatedText)}
                  />
                }
                <div className="mt-4">
                  {imageURLsTable.length > 0 &&
                    imageURLsTable.map((hotel) => (
                      <div
                        className="md:flex md:items-start md:space-x-4 space-y-3 pb-4 mt-2"
                        key={hotel.name}
                      >
                        {hotel && hotel.name && hotel.name.length > 1 ? (
                          <div className="w-80 h-40">
                            <Swiper
                              pagination={{
                                type: "fraction",
                              }}
                              navigation={true}
                              modules={[Pagination, Navigation]}
                              className="mySwiper"
                            >
                              {hotel.url &&
                                hotel.url.map((url, index) => (
                                  <SwiperSlide
                                    className=""
                                    style={{ fontSize: "10px" }}
                                  >
                                    <img
                                      className="rounded-md object-cover w-80 h-40 z-0"
                                      src={`https://cf.bstatic.com${url}`}
                                      alt={`Image ${index}`}
                                    />
                                  </SwiperSlide>
                                ))}
                            </Swiper>
                          </div>
                        ) : (
                          <div className="bg-red-300 first-letter w-full h-20 p-3 text-black rounded-md">
                            We encountered an error while retrieving images.
                            Please try again with the same search query.{" "}
                          </div>
                        )}
                        {hotel.name && hotel.name.length > 1 ? (
                          <div className="flex flex-col space-y-2">
                            <div className="font-medium text-base text-black mt-1">
                              {hotel.name}
                            </div>
                            <div className="font-light text-base text-black">
                              {getTextBetweenPhraseAndDot(
                                generatedText,
                                hotel.name
                              )}
                            </div>
                            <div>
                              <a
                                className="font-normal text-sm text-blue-500 flex items-center space-x-1"
                                href={`https://www.google.com/search?q=booking ${hotel.name}`}
                                target="_blank"
                              >
                                <div>open in Booking.com</div>
                                <img
                                  width="14"
                                  height="14"
                                  src="https://img.icons8.com/ios-glyphs/30/external-link.png"
                                  alt="external-link"
                                />
                              </a>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
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
              Error while retrieving response{" "}
            </div>
          ),
          type: "generated",
        },
      ]);
      console.error("Error:", error);
      // Handle errors here
    }
  };

  //
  const generateRandomText = async () => {
    setTextValue("");
    console.log(handleDetectLanguage(RandomText));
    setContent((prevContent) => [
      ...prevContent,
      {
        text: (
          <div className="w-full m-auto bg-gray-100 p-3  mt-2 rounded-md">
            {RandomText}
          </div>
        ),
        type: "user",
      },
    ]);
    const APIKEY = "AIzaSyAqtgYQGVHDAfQWILDH7TP6O5au79kCCwU"; // Replace with your actual API key
    const body = {
      prompt: {
        text:
          RandomText +
          "Describe as a travel agency without directly stating its name and create travel itinerary for a particular destination. Include a list of two to 3 hotels with their names with brief descriptions, and incorporate their respective images",
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
        //Handle the response data here
        console.log(data);
        const generatedText =
          data?.candidates?.[0]?.output || "No generated text available";
        console.log(await Chatgpt(generatedText.toString()));
        // console.log(splitHotelNamesAndImages(generatedText.toString()));
        scrollToBottom(); // Scroll after sending a message
        const hotelnames = await Chatgpt(generatedText.toString());
        const txtwithout = hotelnames.replaceAll("*", "");
        const hotelList = txtwithout.split(",");
        const imageURLsTable = []; // Create an array to store objects with hotel name and first image URL
        setIsLoading(3);
        for (var i = 0; i < hotelList.length; i++) {
          if (i > 2) {
            break;
          }
          const list = await getImages(hotelList[i]); // Assuming hotelnames array exists
          console.log(list);
          const hotelName = hotelList[i]; // Assuming hotelnames array exists and has valid hotel names
          // Create an object with hotel name and first image URL
          const entry = {
            name: hotelName,
            url: list,
          };
          // Push the entry into the imageURLsTable array
          imageURLsTable.push(entry);
        }
        console.log(imageURLsTable);
        setContent([
          ...content,
          {
            text: (
              <div className="w-100 m-auto bg-gray-100 p-3 mt-2 rounded-md">
                {RandomText}
              </div>
            ),
            type: "user",
          },
          {
            text: (
              <div className="w-100 m-auto bg-blue-100 p-3 mt-2 pb-3 rounded-md">
                {
                  <ReactMarkdown
                    children={removeTextBetweenCurlyBrackets(generatedText)}
                  />
                }
                <div className="mt-4">
                  {imageURLsTable &&
                    imageURLsTable.length > 0 &&
                    imageURLsTable.map((hotel) => (
                      <div
                        className="md:flex md:items-start md:space-x-4 space-y-3 pb-4 mt-2"
                        key={hotel.name}
                      >
                        {hotel.name && hotel.name.length > 1 ? (
                          <div className="w-80 h-40">
                            <Swiper
                              pagination={{
                                type: "fraction",
                              }}
                              navigation={true}
                              modules={[Pagination, Navigation]}
                              className="mySwiper"
                            >
                              {hotel.url &&
                                hotel.url.length > 0 &&
                                hotel.url.map((url, index) => (
                                  <SwiperSlide
                                    className=""
                                    style={{ fontSize: "10px" }}
                                  >
                                    <img
                                      className="rounded-md object-cover w-80 h-40"
                                      src={`https://cf.bstatic.com${url}`}
                                      alt={`Image ${index}`}
                                    />
                                  </SwiperSlide>
                                ))}
                            </Swiper>
                          </div>
                        ) : (
                          <div className="bg-red-300 first-letter w-full h-20 p-3 text-black">
                            We encountered an error while retrieving images.
                            Please try again with the same search query.{" "}
                          </div>
                        )}
                        {hotel.name && hotel.name.length > 1 ? (
                          <div className="flex flex-col space-y-2">
                            <div className="font-medium text-base text-black mt-1">
                              {hotel.name}
                            </div>
                            <div className="font-light text-base text-black">
                              {getTextBetweenPhraseAndDot(
                                generatedText,
                                hotel.name
                              )}
                            </div>
                            <div>
                              <a
                                className="font-normal text-sm text-blue-500 flex items-center space-x-1"
                                href={`https://www.google.com/search?q=booking ${hotel.name}`}
                                target="_blank"
                              >
                                <div>open in Booking.com</div>
                                <img
                                  width="14"
                                  height="14"
                                  src="https://img.icons8.com/ios-glyphs/30/external-link.png"
                                  alt="external-link"
                                />
                              </a>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
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
              {RandomText}
            </div>
          ),
          type: "user",
        },
        {
          text: (
            <div className="w-full bg-red-100 p-3 mt-2 rounded-md">
              Error while retrieving response{" "}
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
    if (textValue.length > 5 && checkForTravelWords(textValue)) {
      await generateText();
      scrollToBottom(); // Scroll after sending a message
    } else {
      message.warning("Your message is incorrect");
    }
  };

  const handleRandomText = async () => {
    await generateRandomText();
    scrollToBottom(); // Scroll after sending a message
  };

  return (
    <div className="overflow-y-hidden">
      <div className="z-50 fixed top-0 w-full">
        <Header cur="chatbot" />
      </div>
      <div className="w-full h-screen p-2 md:pl-60 md:pr-60 overflow-y-auto md:pt-14 pt-10 pb-10">
        {content.length == 0 ? (
          <div>
            <div className="text-center mt-14 md:text-2xl font-normal animate-pulse">
              How can I help you today
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
            <div className="md:mt-8 mt-14 flex md:flex-row flex-col items-center justify-between space-y-3">
              <div
                onClick={handleRandomText}
                className="hover:border hover:border-green-400 animate-pulse p-2 cursor-pointer w-80 h-20 rounded-md bg-gradient-to-r from-cyan-50 to-slate-50"
              >
                <div className="font-medium text-sm">Travel Agencey</div>
                <div className="font-normal text-base mt-2 text-green-500">
                  {RandomText}
                </div>
              </div>
              <div className="p-2 w-80 h-20 rounded-md bg-gradient-to-r from-cyan-50 to-slate-50">
                <div className="font-medium text-sm cursor-pointer">Help?</div>
                <div className="font-normal text-base mt-2 text-green-500 cursor-pointer">
                  Go to{" "}
                  <Link to="/contact" className="text-blue-500">
                    contact
                  </Link>{" "}
                  or{" "}
                  <Link to="/question" className="text-blue-500">
                    fq question
                  </Link>
                </div>
              </div>
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
                <div className="font-normal text-sm">
                  Looking for hotel names
                </div>
              </div>
            </div>
          </div>
        ) : isLoading == 3 ? (
          <div className="w-full">
            <div className="">
              <div className="animate-pulse bg-blue-100 h-20 mt-2 rounded-md p-4 flex items-center space-x-4">
                <img
                  width={30}
                  height={30}
                  src="https://www.gstatic.com/lamda/images/sparkle_resting_v2_1ff6f6a71f2d298b1a31.gif"
                />
                <div className="font-normal text-sm">Images processing</div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        <div ref={bottomRef} />
      </div>

      <div className="z-50 shadow-lg fixed bottom-0 w-full h-12 pl-2 pr-2 md:pl-60 md:pr-64 bg-white">
        <Input
          classNames="mt-2"
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
