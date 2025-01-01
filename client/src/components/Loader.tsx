import Image from "next/image";
import logo from "../../public/logo-called----future-me (1).svg";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-white z-[9999]">
      <Image
        width={200}
        height={200}
        src={logo}
        alt="Future ME Logo"
        className="object-contain"
        priority
      />
      <div className="relative w-3/4 mt-4">
        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 w-[100px] h-[2px] bg-black animate-expand"></div>
      </div>
    </div>
  );
};

export default Loader;
