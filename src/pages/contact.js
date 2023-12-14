import React, { useState, useEffect } from "react";
import { message, Input, Button } from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";
import Header from "../components/header";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setisLoading] = useState(false);

  const handleSubmit = () => {
    if (!name || !email) {
      message.error("Veuillez remplir votre nom et votre e-mail.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      message.error("Veuillez entrer une adresse e-mail valide.");
      return;
    }
    setisLoading(true);

    fetch("/users/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, type, msg }), // Include type and msg in the request body
    })
      .then((response) => {
        if (response.ok) {
          message.success("Email sent successfully");
          setisLoading(false);
          setName("");
          setEmail("");
          setMsg("");
          setType("");
        } else {
          message.error("Failed to send email");
        }
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        message.error("Error sending email");
      })
      .then(() => {
        setisLoading(false);
      });
  };

  return (
    <div className="">
      <div className="h-14">
        <Header cur='contact'/>
      </div>
      <div className="flex justify-center text-2xl md:text-4xl mt-10 tracking-wider">
        Contactez-nous
      </div>
      <div className="w-full bg-blue-50 h-800 mt-10">
        <div className="md:text-2xl text-xl font-normal flex justify-center pt-5">
          ÉCRIVEZ UN MESSAGE
        </div>
        <div className="text-center text-lg font-light md:flex md:justify-center pt-5">
          Si vous n'avez pas trouvé la réponse à votre question, veuillez nous
          contacter.
        </div>
        <div className="flex justify-center md:pl-64 md:pr-64 pl-5 pr-5">
          <div className="bg-white md:h-36 mt-5 md:w-full p-5">
            <div className="font-light text-lg">Vos détails</div>
            <div className="md:flex justify-between items-center pt-5">
              <input
                placeholder="Nom et Prénom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                prefix={<UserOutlined />}
                className="md:w-5/12 w-full border border-black text-sm h-8 p-2"
              />
              <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                prefix={<MailOutlined />}
                onBlur={() => {
                  if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                    message.error("Veuillez entrer une adresse e-mail valide.");
                  }
                }}
                className="md:w-5/12 w-full md:mt-0 mt-2 border border-black text-sm h-8 p-2"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center md:pl-64 md:pr-64 mt-5">
          <div className="bg-white h-80 mt-5 w-full p-5">
            <div className="font-normal flex justify-center md:text-lg">
              COMMENT POUVONS-NOUS VOUS AIDER ?
            </div>
            <div>
              <textarea
                value={msg}
                placeholder="Message"
                className="text-starts outline-none w-full h-40 p-2 border border-black/20 mt-5"
                type="text"
                onChange={(e) => setMsg(e.target.value)} // Update message state
              />
            </div>
            <div className="flex justify-center">
              <Button
                type="default"
                loading={isLoading}
                onClick={handleSubmit}
                className="cursor-pointer  mt-5 font-medium text-center w-52 bg-orange-300 text-black"
              >
                Envoyer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
