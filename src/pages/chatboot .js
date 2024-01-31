import React, { useState, useEffect, useRef } from "react";
import Header from "../components/header";
import { Input, message, Spin } from "antd";
import { SendOutlined, LoadingOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import Logo from "../../src/images/robot.png";
import Deafultimages from "../images/default_image.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../global.css";

import {
  contextVerify,
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
import {
  Chatgpt2,
  contextVerifyGPT,
  contextVerifyGPT2,
} from "../utils/chatgpt";

export default function ChatBoot() {
  const [currentch, setAi] = useState(1); // 0 mean google bard and 1 mean chatgpt
  const [isLoading, setIsLoading] = useState(0);
  const [isLoadingThread, setIsLoadingThread] = useState(0);
  const [textValue, setTextValue] = useState("");
  const [RandomText, setRandomText] = useState(
    `Je veux visiter ${getRandomCity()}`
  );
  const [content, setContent] = useState([]);
  const [threadid, setthreadid] = useState([]);
  const bottomRef = useRef(null);

  async function Tread() {
    setIsLoadingThread(1);
    try {
      const response = await fetch("https://chatbot-api-v1.onrender.com/get-thread", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseData = await response.json();
      setthreadid(responseData);
      setIsLoadingThread(0);
    } catch (error) {}
  }

  useEffect(() => {
    Tread();
  }, []);

  var currentChat = [0];
  function handleAIselected(e) {
    setAi(e.target.value);
    currentChat = [e.target.value];
    currentChat.push();
    console.log(currentChat);
  }

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

  const generateText = async () => {
    setTextValue("");
    scrollToBottom(); // Scroll after sending a message
    // console.log(handleDetectLanguage("hello world"));
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
    // const TranslateTxt = await handleTranslate(textValue);
    const TranslateTxt = textValue;
    setIsLoading(1); //Google bard first call
    const context = await contextVerify(TranslateTxt);
    if (context == "yes") {
      const APIKEY = "AIzaSyAZkjWQUwZehg84i2EGlWZBA0-8_B9Fv5U"; // Replace with your actual API key
      const body = {
        prompt: {
          text:
            TranslateTxt +
            "Describe as a travel agency without directly stating its name and create travel itinerary for a particular destination 5 day. Include a list of two to 3 hotels with their names with brief descriptions, and one incorporate their respective images split by line",
        },
      };
      try {
        setIsLoading(1); //Google bard first call
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
          //display the txt
          setIsLoading(2);
          const generatedText =
            data?.candidates?.[0]?.output || "No generated text available";
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
                <div className="w-100 m-auto bg-blue-100 p-3 mt-2 pb-3 rounded-md text-black">
                  {
                    <ReactMarkdown
                      children={removeTextBetweenCurlyBrackets(generatedText)}
                    />
                  }
                </div>
              ),
              type: "generated",
            },
          ]);
          const hotelnames = await Chatgpt(generatedText.toString()); //Google start looking for hotel names
          const txtwithout = hotelnames.replaceAll("*", "");
          const hotelList = txtwithout.split(",");
          setIsLoading(3);
          // Create an array to store objects with hotel name and first image URL
          const imageURLsTable = [];
          for (var i = 0; i < hotelList.length; i++) {
            const list = await getImages(hotelList[i]); // Assuming hotelnames array exists
            const hotelName = hotelList[i]; // Assuming hotelnames array exists and has valid hotel names
            // Create an object with hotel name and first image URL
            const entry = {
              name: hotelName,
              url: list,
            };
            // Push the entry into the imageURLsTable array
            imageURLsTable.push(entry);
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
                                  {hotel.url && hotel.url.length > 1 ? (
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
                                    ))
                                  ) : (
                                    <SwiperSlide
                                      className=""
                                      style={{ fontSize: "10px" }}
                                    >
                                      <img
                                        className="rounded-md object-cover w-80 h-40 z-0"
                                        src={Deafultimages}
                                      />
                                    </SwiperSlide>
                                  )}
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
          }
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
                <div className="w-100 m-auto bg-blue-100 p-3 mt-2 pb-3 rounded-md  text-black">
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
                                {hotel.url && hotel.url.length > 1 ? (
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
                                  ))
                                ) : (
                                  <SwiperSlide
                                    className=""
                                    style={{ fontSize: "10px" }}
                                  >
                                    <img
                                      className="rounded-md object-cover w-80 h-40 z-0"
                                      src={Deafultimages}
                                    />
                                  </SwiperSlide>
                                )}
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
        console.log(error);
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
              <div className="w-full bg-red-100 p-3 mt-2 rounded-md  text-black">
                Error while retrieving response
              </div>
            ),
            type: "generated",
          },
        ]);
        console.error("Error:", error);
        // Handle errors here
      }
    } else {
      setIsLoading(0); //Google bard first call
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
            <div className="w-full bg-blue-100 p-3 mt-2 rounded-md text-black">
              Apologies, we're solely a chatbot dedicated to answering
              travel-related questions{" "}
            </div>
          ),
          type: "generated",
        },
      ]);
    }
  };

  const generateTextChatgpt = async () => {
    setTextValue("");
    scrollToBottom();
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

    const TranslateTxt = textValue;
    setIsLoading(1); //Google bard first call
    // const context = await contextVerifyGPT(TranslateTxt);
    if (/*context == "yes" || context == "Yes"*/ true) {
      const apiKey = process.env.REACT_APP_API_KEY;

      // const apiRequestBody = {
      //   model: "gpt-3.5-turbo",
      //   messages: [
      //     {
      //       role: "system",
      //       content:
      //         TranslateTxt +
      //         " Using Markdown and in French, provide a brief description of a travel agency without explicitly mentioning its name. Additionally, create a five-day travel itinerary for a specific destination. Include a list of two to three hotels with their names and brief descriptions.",
      //     },
      //   ],
      // };

      try {
        setIsLoading(1); //Google bard first call
        const response = await fetch(`https://chatbot-api-v1.onrender.com/api/v1/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ thread: threadid, text: TranslateTxt }),
        });
        if (response.ok) {
          const data = await response.json();
          //display the txt
          const generatedText = data.result || "No generated text available";
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
                <div className="w-100 m-auto bg-blue-100 p-3 mt-2 pb-3 rounded-md text-black">
                  {
                    <ReactMarkdown
                      children={removeTextBetweenCurlyBrackets(generatedText)}
                    />
                  }
                </div>
              ),
              type: "generated",
            },
          ]);
          // looking for hotels name if it availble
          const hotelnames = await Chatgpt2(generatedText.toString()); //Google start looking for hotel names
          console.log(hotelnames);
          setIsLoading(0);
          if (
            hotelnames == "none" ||
            hotelnames == undefined ||
            hotelnames == "None"
          ) {
            setIsLoading(0);
          } else {
            const hotelList = hotelnames.split(",");
            console.log(hotelList);
            setIsLoading(3);
            // Create an array to store objects with hotel name and first image URL
            const imageURLsTable = [];
            for (var i = 0; i < hotelList.length; i++) {
              const list = await getImages(hotelList[i]); // Assuming hotelnames array exists
              const hotelName = hotelList[i]; // Assuming hotelnames array exists and has valid hotel names
              // Create an object with hotel name and first image URL
              const entry = {
                name: hotelName,
                url: list,
              };
              // Push the entry into the imageURLsTable array
              imageURLsTable.push(entry);
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
                          children={removeTextBetweenCurlyBrackets(
                            generatedText
                          )}
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
                                    {hotel.url && hotel.url.length > 1 ? (
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
                                      ))
                                    ) : (
                                      <SwiperSlide
                                        className=""
                                        style={{ fontSize: "10px" }}
                                      >
                                        <img
                                          className="rounded-md object-cover w-80 h-40 z-0"
                                          src={Deafultimages}
                                        />
                                      </SwiperSlide>
                                    )}
                                  </Swiper>
                                </div>
                              ) : (
                                <div className="bg-red-300 first-letter w-full h-20 p-3 text-black rounded-md">
                                  We encountered an error while retrieving
                                  images. Please try again with the same search
                                  query.{" "}
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
            }
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
                  <div className="w-100 m-auto bg-blue-100 p-3 mt-2 pb-3 rounded-md  text-black">
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
                                  {hotel.url && hotel.url.length > 1 ? (
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
                                    ))
                                  ) : (
                                    <SwiperSlide
                                      className=""
                                      style={{ fontSize: "10px" }}
                                    >
                                      <img
                                        className="rounded-md object-cover w-80 h-40 z-0"
                                        src={Deafultimages}
                                      />
                                    </SwiperSlide>
                                  )}
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
          }
        } else {
          setIsLoading(0);
          throw new Error("Request failed");
        }
      } catch (error) {
        console.log(error);
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
              <div className="w-full bg-red-100 p-3 mt-2 rounded-md  text-black">
                Error while retrieving response
              </div>
            ),
            type: "generated",
          },
        ]);
        console.error("Error:", error);
        // Handle errors here
      }
    } else {
      setIsLoading(0); //Google bard first call
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
            <div className="w-full bg-blue-100 p-3 mt-2 rounded-md text-black">
              Apologies, we're solely a chatbot dedicated to answering
              travel-related questions{" "}
            </div>
          ),
          type: "generated",
        },
      ]);
    }
  };

  const handleSendRequest = async () => {
    if (textValue.length > 2) {
      if (currentch == "0") {
        await generateText();
        scrollToBottom(); // Scroll after sending a message
      } else if (currentch == "1") {
        await generateTextChatgpt();
        scrollToBottom(); // Scroll after sending a message
      }
    } else {
      message.warning("Your message is incorrect");
    }
  };

  return (
    <div className="overflow-y-hidden">
      <div className="z-50 fixed top-0 w-full">
        <Header cur="chatbot" />
      </div>
      {isLoadingThread == 1 ? (
        <Spin
          className="flex justify-center mt-40"
          indicator={
            <LoadingOutlined
              style={{
                fontSize: 64,
              }}
              spin
            />
          }
        />
      ) : (
        <div>
          <div className="w-full h-screen p-2 md:pl-60 md:pr-60 overflow-y-auto md:pt-14 pt-10 pb-20">
            {content.length == 0 ? (
              <div>
                <div className="flex justify-center mt-10">
                  <div className="flex md:flex-row flex-col space-y-2 md:items-center md:space-x-2">
                    <span className="font-normal">
                      Choisissez le générateur de texte
                    </span>
                    <select
                      onChange={(e) => {
                        handleAIselected(e);
                      }}
                      className="border-none bg-blue-50 text-sm outline-none p-1"
                    >
                      <option value="1">Chat-GPT 3.5</option>
                    </select>
                  </div>
                </div>
                <div className="text-center mt-14 md:text-2xl font-normal animate-pulse">
                  Où veux-tu aller?
                </div>
                <div className="flex justify-center"></div>
                <div className="md:mt-8 mt-14 flex md:flex-row flex-col items-center justify-between space-y-3">
                  <div className="hover:border hover:border-green-400 animate-pulse p-2 cursor-pointer w-80 h-20 rounded-md bg-gradient-to-r from-cyan-50 to-slate-50">
                    <div className="font-medium text-sm">Agence de voyage</div>
                    <div className="font-normal text-base mt-2 text-green-500">
                      {RandomText}
                    </div>
                  </div>
                  <div className="p-2 w-80 h-20 rounded-md bg-gradient-to-r from-cyan-50 to-slate-50">
                    <div className="font-medium text-sm cursor-pointer">
                      Aide?
                    </div>
                    <div className="font-normal text-base mt-2 text-green-500 cursor-pointer">
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
                  <div className="animate-pulse bg-blue-100 h-20 mt-2 rounded-md p-4 flex items-center space-x-6">
                    <img
                      width={30}
                      height={30}
                      src="https://www.gstatic.com/lamda/images/sparkle_resting_v2_1ff6f6a71f2d298b1a31.gif"
                    />
                    <div className="font-normal text-sm">
                      Merci pour votre patience. Nous travaillons dur pour vous
                      fournir les informations dont vous avez besoin. Restez à
                      l'écoute !t
                    </div>
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
                      À la recherche de noms d'hôtels
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
                    <div className="font-normal text-sm">
                      Traitement d'images
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            <div ref={bottomRef} />
          </div>
          <div className="z-50  fixed bottom-0 w-full h-16 pr-2 pl-2 md:pl-60 md:pr-64 bg-white">
            <Input
              classNames="shadow-lg"
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
      )}
    </div>
  );
}
