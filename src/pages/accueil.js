import React from "react";
import Header from "../components/header";
import Cover from "../../src/images/v3.jpg";
export default function Accueil() {
  return (
    <div>
      <Header cur='home'/>
      <div className="w-full">
        <img style={{height:'90vh'}} className="h-screen object-cover" src={Cover} alt="" srcset="" />
      </div>
      {/* <div className="md:hidden block fixed top-72 font-bold text-2xl left-2/4">Agency chatbot</div> */}
    </div>
  );
}
