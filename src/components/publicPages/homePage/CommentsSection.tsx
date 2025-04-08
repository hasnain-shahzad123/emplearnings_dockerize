"use client";
import Image from "next/image";
import CardComponent from "./CardComponent";
import { comment_1,comment_2,comment_3, comments_bg, comments_svg1 } from "@/assets/index";
import { trusted_families } from "@/assets/index";
import { useEffect, useRef,useMemo, useState } from "react";

const phrases = ["Goals", "Mentor", "Success Story"];

const CommentsSection = () => {
  const testimonials = useMemo(() => [
    {
      imgSrc: comment_2.src,
      name: "Alex Hales",
      title: "Knowledgeable and Passionate Teacher",
      testimonial:
        "Tapi is an outstanding math tutor who truly cares about his students' success. My daughter had fallen behind in algebra after transferring schools, but with Tapi's help, she caught up in no time. His approach is flexible, and he tailors his teaching to fit her needs. I couldn't ask for a better mentor!",
      by: "Alice Weiss",
      color: "#F2F9EE",
    },
    {
      imgSrc: comment_1.src,
      name: "John Doe",
      title: "Exceptional Learning Experience",
      testimonial:
        "I had the privilege of learning from Tapi, and I can confidently say he is one of the best mentors I've ever had. His enthusiasm for math is contagious, making each session enjoyable and engaging. He takes the time to explain complex concepts clearly, ensuring I fully understand before moving on. Highly recommend!",
      by: "Sarah Johnson",
      color: "#FFF3FF",
    },
    {
      imgSrc: comment_3.src,
      name: "Hsni",
      title: "Inspiring and Effective Tutor",
      testimonial:
        "Tapi has transformed my approach to learning math. His patience and dedication made all the difference in my studies. I appreciated how he was always willing to go the extra mile to ensure I grasped the material. With his guidance, I now feel confident tackling challenging problems. Thank you, Tapi!",
      by: "Michael Brown",
      color: "#FAD4B9",
    },
  ], []);


  const scrollRef = useRef<HTMLDivElement>(null);
  const [displayText, setDisplayText] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopIndex, setLoopIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false); // New state for pausing scroll

  useEffect(() => {
    const currentPhrase = phrases[loopIndex % phrases.length];
    const type = () => {
      setDisplayText((prev) => prev + currentPhrase.charAt(prev.length));
      if (displayText.length === currentPhrase.length) {
        setTimeout(() => setIsDeleting(true), 350);
      }
    };

    const erase = () => {
      setDisplayText((prev) => prev.slice(0, prev.length - 1));
      if (displayText.length === 0) {
        setIsDeleting(false);
        setLoopIndex((prev) => prev + 1);
      }
    };

    const timer = setTimeout(
      () => {
        if (!isDeleting) {
          type();
        } else {
          erase();
        }
      },
      isDeleting ? 150 : 100
    );

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopIndex]);

  useEffect(() => {
    const scroll = () => {
      if (!isPaused) {
        const container = scrollRef.current;
        if (container) {
          container.scrollLeft += 2;

         
          if (
            container.scrollLeft >=
            container.scrollWidth - container.clientWidth
          ) {
            container.scrollLeft = 0;
          }
        }
      }
    };

    const interval = setInterval(scroll, 15);
    return () => clearInterval(interval);
  }, [testimonials, isPaused]);

  return (
    <>
      <div className="max-w-7xl mx-auto font-poppins overflow-hidden">
        <div className="flex items-start justify-center mb-[6%] mt-[8%] gap-5 w-[80%] md:w-[60%] lg:w-[50%] mx-auto">
          <div>
            <h1 className="text-2xl md:text-4xl text-center font-semibold">
              Your <span className="text-[#4A148C]">{displayText}</span>
            </h1>
          </div>
          <div className="relative bottom-5 md:block hidden">
            <Image
              src={comments_svg1.src}
              alt="Comments Section"
              width={90}
              height={90}
              className="max-h-90 max-w-90 min-h-90 min-w-90 "
              // loading="lazy"
            />
          </div>
        </div>
      </div>
      <div
        className="bg-cover bg-center"
        style={{
          backgroundImage: `url(${comments_bg.src})`,
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="font-poppins flex flex-col items-center py-8">
            <h1 className="text-[#4A148C] text-center px-5 text-2xl md:text-3xl font-bold">
              What People Are Saying About Our Tutors
            </h1>
            <p className="pt-2 text-center px-5">
              Hear from learners who have experienced exceptional growth and
              support from our expert tutors
            </p>
          </div>

          {/* Horizontal Scroll Container */}
          <div
            className="flex overflow-hidden pb-5 relative"
            style={{ width: "100%" }}
            ref={scrollRef}
          >
            <div className="flex">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="inline-block w-[350px] mx-5 sm:w-[400px] md:w-[600px] lg:w-[800px]"
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                >
                  <CardComponent {...testimonial} />
                </div>
              ))}
              {testimonials.map((testimonial, index) => (
                <div
                  key={`duplicate-${index}`}
                  className="inline-block w-[350px] mx-5 sm:w-[400px] md:w-[600px] lg:w-[800px]"
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                >
                  <CardComponent {...testimonial} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 flex justify-center gap-1 font-poppins">
        <Image
          src={trusted_families.src}
          alt="Trusted Families"
          width={20}
          height={20}
          className="inline"
        />
        <p className="text-center inline">
          Trusted by <span className="font-semibold">100+</span> Families
        </p>
      </div>
    </>
  );
};

export default CommentsSection;
