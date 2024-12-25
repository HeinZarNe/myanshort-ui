import { ImCrying } from "react-icons/im";

export const ExpireUrl = () => {
  return (
    <div className=" flex flex-col h-[400px] items-center justify-center  text-gray-500">
      <ImCrying size={100} className="animate-bounce " />
      <p className="text-xl text-center">Link is propably expired</p>
    </div>
  );
};
