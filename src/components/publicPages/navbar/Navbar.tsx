"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "@/assets/index";
const navLinks = [
  {
    Name: "How it Works",
    Route: "/how-it-works",
  },
  {
    Name: "Our Approach",
    Route: "/our-approach",
  },
  {
    Name: "Testimonials",
    Route: "/testimonials",
  },
  {
    Name: "Work with Us",
    Route: "/work-with-us",
  },
  {
    Name: "Log In",
    Route: "/login",
  },
  {
    Name: "Sign Up",
    Route: "/signup",
  },
];
const Navbar = () => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUnderline, setIsUnderline] = useState<boolean[]>(
    Array(navLinks.length).fill(false)
  );
  const [activePath, setActivePath] = useState<string>("");
  const [isbold, setIsbold] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const onPageClick = () => {
    setIsSidebarOpen(false);
    document.body.style.overflow = "auto";
  };

  const handleUnderline = (index: number) => {
    setIsUnderline(Array(navLinks.length).fill(false));
    setIsbold(false);
    if (index >= 0) {
      setIsUnderline((prev) => {
        prev[index] = true;
        return prev;
      });
    } else if (index === -2) {
      setIsbold(true);
    }
  };

  useEffect(() => {
    if (pathname === "/our-approach") {
      handleUnderline(1);
    }
    else if(pathname === "/how-it-works"){
      handleUnderline(0);
    }
    else if(pathname === "/testonimals"){
      handleUnderline(2);
    }
    else if(pathname === "/work-with-us"){
      handleUnderline(-2);
    }
    else{
      handleUnderline(-1);
    }
    
  },[pathname]);  

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "auto";
  }, [isSidebarOpen]);

  return (
    <div
      style={{ zIndex: 9999 }}
      className="max-w-[100%] border-b-[1px] sticky top-0 bg-white border-[#7A7A7A] py-2"
    >
      {/* Full-width sidebar with left-to-right transition */}
      <div
        className={`fixed top-0 left-0 h-full w-full bg-white z-50 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center gap-10 p-6">
          <div className="flex flex-row items-center justify-between w-full mb-8">
            <div className="flex flex-row items-center gap-3">
              {/* <div className="w-[25px] h-[25px] bg-[#4A148C] rounded-full"></div> */}
              <div>
                <Image
                  src={Logo}
                  alt="Logo Image"
                  className="md:h-[75px] md:w-[75px] h-[45px] w-[45px]"
                />
              </div>
              <div>
                <Link href="/">
                  <h2 className="font-semibold">
                    Empower<span className="text-[#4A148C]">Ed</span> Learnings
                  </h2>
                </Link>
              </div>
            </div>
            <div onClick={toggleSidebar} className="cursor-pointer">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="absolute w-5 h-0.5 bg-[#4A148C] transform rotate-45"></div>
                <div className="absolute w-5 h-0.5 bg-[#4A148C] transform -rotate-45"></div>
              </div>
            </div>
          </div>
          {navLinks.map((link, index) => {
            return (
              <div className="font-semibold" key={link.Route}>
                {" "}
                {/* Use link.Route as the unique key */}
                <Link href={link.Route} onClick={onPageClick} prefetch={true}>
                  <h3>{link.Name}</h3>
                </Link>
              </div>
            );
          })}
          <div>
            <button className="bg-[#4A148C] text-white px-8 py-3 rounded-full">
              Find Your Perfect Mentor
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="max-w-7xl px-6 mx-auto my-0">
        <div className="flex flex-row justify-between items-center">
          <div
            className="lg:hidden flex flex-col justify-around h-6 w-8 cursor-pointer"
            onClick={toggleSidebar}
          >
            <div className="block h-1 bg-[#4A148C]"></div>
            <div className="block h-1 bg-[#4A148C]"></div>
            <div className="block h-1 bg-[#4A148C]"></div>
          </div>
          <div>
            <Link href="/" onClick={() => handleUnderline(-1)}>
              <div className="flex flex-row items-center gap-3">
                <div>
                  <Image
                    src={Logo}
                    alt="Logo Image"
                    className="md:h-[75px] md:w-[75px] h-[45px] w-[45px]"
                  />
                </div>
                <div>
                  <h2 className="font-semibold">
                    Empower<span className="text-[#4A148C]">Ed</span> Learnings
                  </h2>
                </div>
              </div>
            </Link>
          </div>
          <div className="lg:flex hidden flex-row items-center gap-8 ">
            {navLinks.map((link, index) => {
              if (index < 3) {
                return (
                  <div key={link.Route}>
                    {" "}
                    {/* Use link.Route as the unique key */}
                    <Link
                      onClick={() => handleUnderline(index)}
                      href={link.Route}
                      prefetch={true}
                      className={`relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:block after:w-0 after:h-1 after:bg-[#DD5D00] hover:after:w-full hover:after:bg-[#8B55CC] after:transition-all after:duration-300 pb-3 transition-all duration-300 ease-in-out
                      ${isUnderline[index] ? "after:w-full after:bg-[#DD5D00]" : ""}`}
                    >
                      {link.Name}
                    </Link>
                  </div>
                );
              }
            })}
          </div>
          <div className="lg:flex hidden flex-row items-center gap-8">
            <div>
              <Link
                href="/work-with-us"
                onClick={() => handleUnderline(-2)}
                prefetch={true}
              >
                <h2
                  className={`text-[#4A148C] hover:scale-105 transform transition duration-200 font-semibold
                  ${isbold ? "scale-105" : ""}`}
                >
                  Work with Us
                </h2>
              </Link>
            </div>
            <div>
              <Link
                className="bg-[#000000] text-white hover:scale-105 transform transition duration-200 px-7 py-1 rounded-full"
                href="/select-user-type"
                prefetch={true}
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
