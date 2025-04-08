const ChoosePlanMobile = ({
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
        "Personal Calendar for easy scheduling/rescheduling",
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
        "Sell Pre-Recorded Courses: Create multiple revenue streams",
        "1-Month Free Trial",
      ],
    },
  ];

  return (
    <div className="w-full overflow-x-auto py-5 hide-scrollbar">
      <div className="flex items-start gap-5 px-2.5">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`${
              index === 0 ? "bg-[#4A148C] text-white" : "bg-[#F4F4F5]"
            } min-w-[280px] p-5 rounded-xl shadow-md`}
          >
            <div className="leading-10">
              <div className="flex flex-row justify-between items-center">
                <div>
                  <h1 className="text-[18px] font-bold">
                    {plan.price}{" "}
                    <span
                      className={`${
                        index === 0 ? "" : "text-[#7E7A9F]"
                      } text-[14px] font-medium`}
                    >
                      /month
                    </span>
                  </h1>
                </div>
                <div>
                  <h3
                    className={`${
                      index === 0 ? "text-white" : "text-[#4A148C]"
                    } font-semibold text-[12px]`}
                  >
                    {`(${plan.billingCycle})`}
                  </h3>
                </div>
              </div>

              <h1 className="my-3 text-2xl">{plan.name}</h1>
              <p
                className={`${
                  index === 0 ? "" : "text-[#7A7A7A]"
                } text-lg mb-3`}
              >
                {plan.description}
              </p>

              {index === 2 ? (
                <p className="font-semibold leading-6 mb-5">
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
            {plan.feature.map((feature, featureIndex) => (
              <div
                key={featureIndex}
                className="flex items-start space-x-2 mb-1"
              >
                <div
                  className={`${
                    index !== 0 ? "bg-[#5243C226]" : "bg-[#989898]"
                  }  px-1 rounded-full`}
                >
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
                      fill={`${index === 0 ? "#FFFFFF" : "#4A148C"}`}
                    />
                  </svg>
                </div>

                <p className="text-[14px]">{feature}</p>
              </div>
            ))}
            <button
              onClick={async () => {
                onChoosePlan(plan.planId);
              }}
              className={`${
                index !== 0
                  ? "bg-[#4A148C] text-white"
                  : "bg-[#FFFFFF] text-[#4A148C]"
              } mt-4 py-2 px-8 rounded-full`}
            >
              Choose plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChoosePlanMobile;
