import logo from "../../public/logo.svg";
import Image from "next/image";
import { useState, useEffect } from "react";

const quotes = [
    "Set goals, crush them.",
    "Dream big, work hard.",
    "Success starts with a goal.",
    "Goals are dreams with deadlines.",
    "Chase your goals, not approval.",
    "Make it happen, take action."
  ];
  

const Footer = () => {
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    const intervalId = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setQuote(quotes[randomIndex]);
  
    }, 10000); 

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="text-center py-8 text-white">
      <p className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-yellow-500 to-blue-500 animate-gradient bg-[length:400%] ">{quote}</p>
      <h3 className="text-sm text-slate-400 flex justify-center items-center hover:text-blue-500 hover:underline cursor-pointer transition-all">
        Powered by:
        <a href="https://pixeltochka.tech/" target="_blank" rel="noopener noreferrer">
        <Image
          width={30}
          height={30}
          src={logo}
          alt="PixelTochka Logo"
          className="ml-2"
        />
        </a>
      </h3>
    </div>
  );
};

export default Footer;

