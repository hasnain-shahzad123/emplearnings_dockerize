import CustomButton from "../../shared/CustomButton/CustomButton";

const ChoosePlanDesktop = ({
  onChoosePlan,
}: {
  onChoosePlan: (planId: string) => Promise<void>;
}) => {
  const plans = [
    {
      planId: "1",
      price: "$85",
      billingCycle: "Billed Monthly",
      name: "Standard",
      description: "For those seeking a strong online presence",
      feature: [
        "Custom Profile Page to showcase your expertise and services",
        "Personal Dashboard with Built-in CRM",
        "Social Media Marketing for consistent student flow",
        "Personal Calendar for easy scheduling/ rescheduling",
        "Automated email reminders and notifications for students",
        "Student Portal for personalized learning",
        "Smooth integration for recurring payments",
        "SEO optimization",
        "Onboarding & Tech Support",
        "1-Month Free Trial",
      ],
    },
    {
      planId: "2",
      price: "$65",
      billingCycle: "Billed Every Six Months",
      name: "Pro",
      description: "For growing businesses ready to scale",
      feature: [
        "Upgraded custom profile to highlight your services, offers, and ratings for maximum visibility",
        "Advanced marketing strategies to drive more leads, including video promotions to spotlight your expertise",
        "1-Month Free Trial",
      ],
    },
    {
      planId: "3",
      price: "$50",
      billingCycle: "Billed Annually",
      name: "Premium",
      description: "For those looking to diversify and maximize revenue",
      feature: [
        "Option to list in more than one major category and add multiple subcategories to broaden reach and increase revenue.",
        "Sell Pre-Recorded Courses: Create multiple revenue streams",
        "1-Month Free Trial",
      ],
    },
  ];

  return (
    <>
      <div className="flex flex-col px-0 items-center text-center font-poppins">
        <h1 className="text-4xl font-bold mt-10">
          Find the Best Plan for You!
        </h1>
        <p className="mt-3 text-base">
          Choose a plan that fits your business needs
        </p>
        <h3 className="text-center md:block hidden md:px-0 text-2xl font-semibold">
          All plans include a one-time registration fee of{" "}
          <span className="text-[#4A148C]">$19.99</span>
        </h3>
      </div>

      <div className="max-w-7xl mx-auto my-10 md:bg-[#F4F4F5] py-5">
        <div className="flex flex-row items-start justify-center w-full mx-auto py-10 gap-5">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`w-[90%] mx-0 md:w-[350px] ${
                index % 3 === 2
                  ? "bg-[#4A148C] mt-[4%] text-white"
                  : "bg-[#F4F4F5]"
              } p-5 transition-all border-[2px] md:border-none border-[#D9D9D9] rounded-2xl duration-300`}
            >
              {index % 3 === 2 ? (
                <div className="flex justify-end">
                  <p className="text-black bg-white px-3 py-1 rounded-full text-sm font-poppins font-semibold mb-5">
                    MOST POPULAR
                  </p>
                </div>
              ) : (
                ""
              )}

              <div className="leading-10">
                <h1 className="text-4xl font-bold">
                  {plan.price}{" "}
                  <span
                    className={`${
                      index % 3 === 2 ? "" : "text-[#4a148c]"
                    } text-3xl font-medium`}
                  >
                    /month
                  </span>
                </h1>

                <h3
                  className={`${
                    index % 3 === 2 ? "text-white" : "text-black"
                  } font-semibold  mt-3 text-xl`}
                >
                  {`(${plan.billingCycle})`}
                </h3>
                <h1 className="my-3 text-3xl text-center md:text-left">
                  {plan.name}
                </h1>
                <p
                  className={`${
                    index % 3 === 2 ? "" : "text-[#4a148c] font-bold"
                  } text-lg mb-3`}
                >
                  {plan.description}
                </p>

                {index % 3 === 2 ? (
                  <p className="font-semibold">
                    All features from Pro Plan, plus:
                  </p>
                ) : (
                  ""
                )}
                {index % 3 === 1 ? (
                  <p className="font-semibold leading-6 mb-5">
                    Everything from the Standard Plan, plus:
                  </p>
                ) : (
                  ""
                )}
              </div>
              <div
                className={`${
                  index % 3 === 2 ? "" : "text-black"
                } font-poppins text-lg`}
              >
                {plan.feature.map((feature, featureIndex) => (
                  <div
                    key={featureIndex}
                    className="flex items-start space-x-2 mb-1"
                  >
                    <div className="bg-[#5243C226] px-1 rounded-full">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 13 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="inline"
                      >
                        <path
                          d="M12.5956 1.83337L6.50696 9.57421C6.36175 9.7547 6.14522 9.87296 5.90603 9.90242C5.66684 9.93188 5.42504 9.87007 5.23497 9.73087L0.88708 6.47421C0.503406 6.18656 0.44128 5.66199 0.748317 5.30254C1.05535 4.94309 1.61528 4.88489 1.99896 5.17254L5.62457 7.89004L11.1635 0.84754C11.3451 0.592198 11.6619 0.451025 11.9879 0.480071C12.314 0.509117 12.5966 0.703681 12.7236 0.986517C12.8506 1.26935 12.8014 1.59469 12.5956 1.83337Z"
                          fill={`${index % 3 === 2 ? "#FFFFFF" : "#4A148C"}`}
                        />
                      </svg>
                    </div>

                    <p className="">{feature}</p>
                  </div>
                ))}
              </div>
              <CustomButton
                onclickEvent={() => onChoosePlan(plan.planId)}
                className={`${
                  index % 3 === 2
                    ? "bg-white text-black"
                    : "bg-[#4A148C] text-white"
                } rounded-full  px-8 py-3 mt-5`}
                text="Choose plan"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ChoosePlanDesktop;
