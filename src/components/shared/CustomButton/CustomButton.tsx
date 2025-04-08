import { MouseEventHandler } from "react";
type CustomButtonProps = {
  className?: string;
  text: string;
  onclickEvent?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
};

const CustomButton = ({
  disabled = false,
  className = "",
  text,
  onclickEvent,
}: CustomButtonProps) => {
  return (
    <button
      disabled={disabled}
      onClick={onclickEvent}
      className={`transition duration-300 font-poppins font-semibold ease-in-out border-2 border-transparent ${className} ${
        disabled
          ? "cursor-not-allowed opacity-50 hover:bg-empoweredFlag hover:text-white hover:border-transparent"
          : "hover:bg-white hover:text-black hover:border-empoweredFlag"
      }`}>
      {text}
    </button>
  );
};

export default CustomButton;
