import WorkWithUS from '@/components/publicPages/work-with-us/HeroSection';
import ChoosePlan from '@/components/publicPages/work-with-us/ChoosePlan';
import SpecialOffer from '@/components/publicPages/work-with-us/SpecialOffer';
import Offered from '@/components/publicPages/work-with-us/Offered';
const WorkWithUs = () => {
  return (
    <>
      <div className="py-2 font-poppins hidden md:block text-white bg-[#4A148C] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h1
            className="text-md font-semibold whitespace-nowrap inline-block animate-scrollText"
            style={{
              animation: "scrollText 35s linear infinite",
            }}
          >
            <span>Special offer</span>
            <span className="ml-20 text-md font-normal">
              Enjoy 2 Month FREE – Absolutely Risk-Free, with No Registration
              Fees and No Subscription Costs. Limited Time Offer!
            </span>
          </h1>
        </div>
      </div>

      <WorkWithUS />
      <ChoosePlan />
      <SpecialOffer />
      <Offered />
    </>
  );
};

export default WorkWithUs;
