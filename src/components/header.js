import React from "react";
import { Link } from "react-router-dom";
import { MenuUnfoldOutlined } from "@ant-design/icons";

export default function Header({ cur }) {
  return (
    <div className="w-full md:h-14 p-1 pb-2 md:pb-0 md:p-0 bg-blue-50 shadow-md md:shadow-sm font-medium text-base">
      <div className="flex items-center space-x-6 pl-3 pr-3 pt-1 pb-1 md:pt-4 md:justify-start justify-between">
        <Link to="/accueil">
          <div
            className={`${
              cur == "home" ? "font-medium" : "font-normal"
            } flex items-center space-x-2 text-black cursor-pointe `}
          >
            <div>
              <img
                width="22"
                height="22"
                src="https://img.icons8.com/material-rounded/48/home.png"
                alt="home"
              />{" "}
            </div>
            <div className="md:block hidden">Accueil</div>
          </div>
        </Link>
        <Link to="/chatbot">
          <div
            className={`${
              cur == "chatbot" ? "font-medium" : "font-normal"
            } flex items-center space-x-2 text-black cursor-pointe `}
          >
            <div>
              <img
                width="22"
                height="22"
                src="https://img.icons8.com/sf-black-filled/64/chat.png"
                alt="chat"
              />{" "}
            </div>
            <div className="md:block hidden">ChatBot</div>
          </div>
        </Link>
        <Link to="/contact">
          <div
            className={`${
              cur == "contact" ? "font-medium" : "font-normal"
            } flex items-center space-x-2 text-black cursor-pointe `}
          >
            <div>
              <img
                width="22"
                height="22"
                src="https://img.icons8.com/pastel-glyph/64/email--v1.png"
                alt="email--v1"
              />{" "}
            </div>
            <div className="md:block hidden">Contact</div>
          </div>
        </Link>
        <Link to="/question">
          <div
            className={`${
              cur == "question" ? "font-medium" : "font-normal"
            } flex items-center space-x-2 text-black cursor-pointe `}
          >
            <div>
              <img
                width="22"
                height="22"
                src="https://img.icons8.com/ios-filled/50/help.png"
                alt="help"
              />
            </div>
            <div className="md:block hidden">FAQ</div>
          </div>
        </Link>
        <Link to="/legal">
          <div
            className={`${
              cur == "legal" ? "font-medium" : "font-normal"
            } flex items-center space-x-2 text-black cursor-pointe `}
          >
            <div>
              <img
                width="22"
                height="22"
                src="https://img.icons8.com/ios-filled/50/auction.png"
                alt="auction"
              />
            </div>
            <div className="md:block hidden">Mentions légales</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
