import logo from "../../public/logo--text----future-me.svg";
import Image from "next/image";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-white z-50">
      <Image
        width={100}
        height={100}
        src={logo}
        alt="Future ME Logo"
        className="ml-2"
      />
      <div className="relative w-full mt-2">
        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 w-0 h-[2px] bg-black animate-expand"></div>
      </div>
    </div>
  );
};

export default Loader;
