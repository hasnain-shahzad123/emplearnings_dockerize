import Image from 'next/image';
import {stars,tick,Crown,three_lines} from '@/assets/index';
import {Testimonial_image1, Testimonial_image2, Testimonial_image3, Testimonial_image4} from '@/assets/index';
const ReviewsSection = () => {

    const comments = [
      {
        imageSrc: Testimonial_image1.src,
        name: "Oguz",
        title: "Amazing progress in 1 month",
        comment:
          " No more missing assignments, all grades in the 90s, and getting to school is super easy with the new morning routine. Can't recommend highly enough.",
        date: "Sep 06,2024",
      },
      {
        imageSrc: Testimonial_image2.src,
        name: "Ali",
        title: "Dean is an amazing coach!",
        comment:
          " We started with Dean a couple of months ago. He is supporting our very difficult 18-year-old son. Dean has been phenomenal and we are already seeing a difference. The updates he sends us are very informative and enlightening. He is supporting our very difficult 18-year-old son.",
        date: "Sep 06,2024",
      },
      {
        imageSrc: Testimonial_image1.src,
        name: "Oguz",
        title: "Amazing progress in 1 month",
        comment:
          " No more missing assignments, all grades in the 90s, and getting to school is super easy with the new morning routine. Can't recommend highly enough.",
        date: "Sep 06,2024",
      },
      {
        imageSrc: Testimonial_image2.src,
        name: "Brook",
        title: "Julie is an amazing coach!",
        comment:
          " We started with Julie a couple of months ago. He is supporting our very difficult 18-year-old son. Dean has been phenomenal and we are already seeing a difference. The updates he sends us are very informative and enlightening. He is supporting our very difficult 18-year-old son.",
        date: "Sep 06,2024",
      },
      {
        imageSrc: Testimonial_image3.src,
        name: "Usman",
        title: "Rob has been fantastic to work with",
        comment:
          " Rob has been fantastic to work with. Mack has challenges engaging for any length of time. After 3 months his grades have gone up and he keeps his room a bit tidier. The short sessions are so helpful for someone with ADHD. Rob sends regular updates and is very responsive.",
        date: "Sep 06,2024",
      },
      {
        imageSrc: Testimonial_image4.src,
        name: "Sara",
        title: "Rob has been fantastic to work with",
        comment:
          " We started with Julie a couple of months ago. He is supporting our very difficult 18-year-old son. Dean has been phenomenal and we are already seeing a difference. The updates he sends us are very informative and enlightening. He is supporting our very difficult 18-year-old son.",
        date: "Sep 06,2024",
      },
      {
        imageSrc: Testimonial_image2.src,
        name: "Brook",
        title: "Julie is an amazing coach!",
        comment:
          " We started with Julie a couple of months ago. He is supporting our very difficult 18-year-old son. Dean has been phenomenal and we are already seeing a difference. The updates he sends us are very informative and enlightening. He is supporting our very difficult 18-year-old son.",
        date: "Sep 06,2024",
      },
      {
        imageSrc: Testimonial_image3.src,
        name: "Usman",
        title: "Rob has been fantastic to work with",
        comment:
          " Rob has been fantastic to work with. Mack has challenges engaging for any length of time. After 3 months his grades have gone up and he keeps his room a bit tidier. The short sessions are so helpful for someone with ADHD. Rob sends regular updates and is very responsive.",
        date: "Sep 06,2024",
      },
      {
        imageSrc: Testimonial_image4.src,
        name: "Sara",
        title: "Rob has been fantastic to work with",
        comment:
          " We started with Julie a couple of months ago. He is supporting our very difficult 18-year-old son. Dean has been phenomenal and we are already seeing a difference. The updates he sends us are very informative and enlightening. He is supporting our very difficult 18-year-old son.",
        date: "Sep 06,2024",
      },
      {
        imageSrc: Testimonial_image2.src,
        name: "Brook",
        title: "Julie is an amazing coach!",
        comment:
          " We started with Julie a couple of months ago. He is supporting our very difficult 18-year-old son. Dean has been phenomenal and we are already seeing a difference. The updates he sends us are very informative and enlightening. He is supporting our very difficult 18-year-old son.",
        date: "Sep 06,2024",
      },
      {
        imageSrc: Testimonial_image3.src,
        name: "Usman",
        title: "Rob has been fantastic to work with",
        comment:
          " Rob has been fantastic to work with. Mack has challenges engaging for any length of time. After 3 months his grades have gone up and he keeps his room a bit tidier. The short sessions are so helpful for someone with ADHD. Rob sends regular updates and is very responsive.",
        date: "Sep 06,2024",
      },
      {
        imageSrc: Testimonial_image4.src,
        name: "Sara",
        title: "Rob has been fantastic to work with",
        comment:
          " We started with Julie a couple of months ago. He is supporting our very difficult 18-year-old son. Dean has been phenomenal and we are already seeing a difference. The updates he sends us are very informative and enlightening. He is supporting our very difficult 18-year-old son.",
        date: "Sep 06,2024",
      },
      {
        imageSrc: Testimonial_image2.src,
        name: "Brook",
        title: "Julie is an amazing coach!",
        comment:
          " We started with Julie a couple of months ago. He is supporting our very difficult 18-year-old son. Dean has been phenomenal and we are already seeing a difference. The updates he sends us are very informative and enlightening. He is supporting our very difficult 18-year-old son.",
        date: "Sep 06,2024",
      },
      {
        imageSrc: Testimonial_image3.src,
        name: "Usman",
        title: "Rob has been fantastic to work with",
        comment:
          " Rob has been fantastic to work with. Mack has challenges engaging for any length of time. After 3 months his grades have gone up and he keeps his room a bit tidier. The short sessions are so helpful for someone with ADHD. Rob sends regular updates and is very responsive.",
        date: "Sep 06,2024",
      },
      {
        imageSrc: Testimonial_image4.src,
        name: "Sara",
        title: "Rob has been fantastic to work with",
        comment:
          " We started with Julie a couple of months ago. He is supporting our very difficult 18-year-old son. Dean has been phenomenal and we are already seeing a difference. The updates he sends us are very informative and enlightening. He is supporting our very difficult 18-year-old son.",
        date: "Sep 06,2024",
      },
      {
        imageSrc: Testimonial_image2.src,
        name: "Brook",
        title: "Julie is an amazing coach!",
        comment:
          " We started with Julie a couple of months ago. He is supporting our very difficult 18-year-old son. Dean has been phenomenal and we are already seeing a difference. The updates he sends us are very informative and enlightening. He is supporting our very difficult 18-year-old son.",
        date: "Sep 06,2024",
      },
      {
        imageSrc: Testimonial_image3.src,
        name: "Usman",
        title: "Rob has been fantastic to work with",
        comment:
          " Rob has been fantastic to work with. Mack has challenges engaging for any length of time. After 3 months his grades have gone up and he keeps his room a bit tidier. The short sessions are so helpful for someone with ADHD. Rob sends regular updates and is very responsive.",
        date: "Sep 06,2024",
      },
      {
        imageSrc: Testimonial_image4.src,
        name: "Sara",
        title: "Rob has been fantastic to work with",
        comment:
          " We started with Julie a couple of months ago. He is supporting our very difficult 18-year-old son. Dean has been phenomenal and we are already seeing a difference. The updates he sends us are very informative and enlightening. He is supporting our very difficult 18-year-old son.",
        date: "Sep 06,2024",
      },
    ];

    return (
      <>
        <div className="max-w-7xl mx-auto mb-10">
          <div className="flex flex-col my-[5%] px-5 md:px-0 items-center font-poppins relative">
            <h1 className="text-4xl font-bold text-center relative">
              What our Customers say
              <Image
                src={three_lines.src}
                alt="lines"
                height={40}
                width={40}
                className="absolute -right-9 hidden md:block -top-0"
              />
              <Image
                src={Crown.src}
                alt="Crown"
                height={40}
                width={40}
                className="absolute -top-10 left-1/2 transform -translate-x-1/2 hidden md:block w-15  h-auto"
              />
            </h1>
            <p className="mt-5 text-center">
              These are all public reviews from our Trustpilot page.
            </p>
          </div>

          {/* Making the style for card here  */}

          <div className="flex justify-center items-start flex-wrap gap-3">
            {comments.map((comment, index) => (
              <div
                key={index}
                className="bg-[#F9F9F9] hover:bg-[#4A148C] hover:text-white cursor-pointer hover:scale-105 transform transition duration-200 w-[90%] mx-auto mb-5 md:mx-0 md:w-[40%] lg:w-[30%] h-auto font-poppins rounded-3xl border-[1px] border-[#D9D9D9] shadow-xl"
              >
                <div className="flex justify-between px-5 py-3">
                  <div className="flex">
                    <div>
                      <Image
                        src={comment.imageSrc}
                        height={200}
                        width={200}
                        alt="some image"
                        className="h-[40px] w-[40px]"
                      />
                    </div>
                    <h1 className="pl-3 pt-2 font-bold text-xl">
                      {comment.name}
                      <Image
                        src={tick.src}
                        alt="stars"
                        height={20}
                        width={100}
                        className="inline ml-2 w-8 h-8"
                      />
                    </h1>
                  </div>
                  <div className="mt-1">
                    <Image
                      src={stars.src}
                      alt="stars"
                      height={20}
                      width={100}
                      className="w-20 h-10"
                    />
                  </div>
                </div>
                <div className="p-5">
                  <h1 className="font-semibold">{comment.title}</h1>
                  <p className="text-sm mt-5">{comment.comment}</p>
                </div>
                <div className="px-5 pb-3 text-sm">
                  <p className="text-[#7A7A7A]">{comment.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
}
export default ReviewsSection;