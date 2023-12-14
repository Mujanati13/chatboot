import React from "react";
import Header from "../components/header";
import { Collapse } from "antd";
import { Link } from "react-router-dom";

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
`;
const items = [
  {
    key: "1",
    label: "This is panel question 1",
    children: <p>{text}</p>,
  },
  {
    key: "2",
    label: "This is panel question 2",
    children: <p>{text}</p>,
  },
  {
    key: "3",
    label: "This is panel question 3",
    children: <p>{text}</p>,
  },
  {
    key: "4",
    label: "This is panel question 4",
    children: <p>{text}</p>,
  },
];

export default function Quations() {
  const onChange = (key) => {
    console.log(key);
  };
  return (
    <div className="">
      <div className="fixed top-0 left-0 w-full z-50">
        <Header cur='question' />
      </div>
      <div className="w-full h-48 bg-blue-100 pt-20">
        <div className="flex items-center space-x-3 justify-center ">
          <img
            width="25"
            height="25"
            src="https://img.icons8.com/ios-filled/50/help.png"
            alt="help"
          />
          <div className="font-normal md:text-2xl text-lg">
            <div>You need help?</div>
          </div>
        </div>
        <Link to='/contact'>
          {" "}
          <div className="text-base underline text-blue-500 mt-2 text-center cursor-pointer">
            {" "}
            or contact with us
          </div>
        </Link>
      </div>
      <div className="md:pl-40 md:pr-40 p-2 mt-6 pb-2">
        <Collapse
          accordion
          items={items}
          defaultActiveKey={["1"]}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
