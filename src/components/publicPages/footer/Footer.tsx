"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FooterDesktop from "./FooterDesktop"
import FooterMobile from "./FooterMobile";

const Footer = () => {

  const homePageFAQ = [
    {
      Question: "How does EmpowerEd Learnings work?",
      Answer:
        "EmpowerEd Learnings connects students with expert mentors in three categories: Academic Tutoring, Life Coaching, and Skill Development. You can choose a mentor in your desired area and schedule classes based on your availability. Our platform offers personalized learning with flexible scheduling options.",
    },
    {
      Question: "How do I get charged?",
      Answer:
        "All mentors on the platform offer three tiers of classes: once a week, twice a week, or three times a week. You can select the option that best fits your learning needs. Once you've made your choice, payments will be billed monthly on a recurring basis.",
    },
    {
      Question: "Why should I sign up for at least 4 classes?",
      Answer:
        "Consistent learning is the key to real progress! Research shows that committing to at least 4 classes helps you build momentum and achieve better results. Our flexible options—once, twice, or three times a week—make it easy to stay on track. Choose the option that fits your schedule and start making meaningful strides toward your goals",
    },
    {
      Question: "Are my payments secure?",
      Answer:
        "Yes, payments are processed securely on a monthly basis according to the class option you choose. You'll receive notifications about upcoming charges, so you always know what to expect.",
    },
    {
      Question: "Can I cancel my payments at any time?",
      Answer:
        "Yes, you can cancel your payments at any time. However, we recommend canceling at least 10 days prior to the next billing cycle to avoid being charged for the upcoming month",
    },
    {
      Question: "Can I try a free class before committing?",
      Answer:
        "Some mentors offer a free trial class. If available, you can take advantage of this opportunity to experience the mentor’s teaching style before making a commitment.",
    },

    {
      Question: "What features does my personal dashboard include?",
      Answer:
        "Once you sign up, your dashboard provides tools to enhance your learning experience, including: tracking your progress, accessing teacher notes, viewing purchased courses, scheduling and rescheduling classes, receiving reminders and notifications, and communicating with your mentor outside of class hours.",
    },
    {
      Question: "What if I need to reschedule a class?",
      Answer:
        "You can reschedule your classes through your dashboard. Simply check the mentor's availability and choose a new time that works for both of you.",
    },
    {
      Question: "How do I communicate with my mentor outside of class time?",
      Answer:
        "Your dashboard allows you to send messages to your mentor. This feature makes it easy to ask questions or get additional support as needed.",
    },
    {
      Question: "Are there any refunds available?",
      Answer:
        "EmpowerEd Learnings does not offer refunds. Please ensure to cancel your payment before the next billing cycle to avoid further charges.",
    },
    {
      Question: "Who should I contact for help and support?",
      Answer:
        "For any technical support or issues using the EmpowerEd Learnings platform, our team is here to assist you. However, if you have questions about scheduling, rescheduling, or payments, please reach out directly to your mentor. EmpowerEd Learnings does not take commissions or manage mentor earnings—we're dedicated to empowering both students and mentors by providing a seamless platform to connect. Your mentor is the best point of contact for addressing any concerns related to scheduling or payments. ",
    },
  ];

  const workWithUsFAQ = [
    {
      Question: "What happens after the 1-month free trial?",
      Answer:
        "After your free trial ends, the plan you selected will automatically charge you based on your subscription (monthly, bi-annually, or annually). If you wish to cancel, please do so before the trial ends to avoid charges.",
    },
    {
      Question: "How can I keep track of my payments?",
      Answer:
        "We use a secure Stripe payment system. You can track all your payments directly on your personal dashboard, where you’ll see real-time updates on payments received, upcoming transactions, and any payment issues, all clearly laid out for your convenience.",
    },
    {
      Question: "What is the demo call?",
      Answer:
        "Our admin team will walk you through the platform, explain the different subscription plans, and help you choose the best plan for your business needs during the demo call. It’s a great way to get an inside look at how everything works.",
    },
    {
      Question: "What’s included with onboarding and tech support?",
      Answer:
        "Once you subscribe, a dedicated team member will guide you through setting up your profile, showcasing your offers, and advising on effective marketing strategies. We also provide ongoing support for any technical issues related to the website, platform, or payment system. (The registration fee covers these services.)",
    },
    {
      Question: "How do you handle marketing for me?",
      Answer:
        "Once your marketing efforts are active, our dedicated marketing team takes care of everything. For Pro and Premium plans, we use a mix of strategies like online ads, community events, and more. You can also add video features to ad campaigns for extra visibility. We provide campaign performance reports upon request, detailing reach, engagement, and leads. Our efforts go beyond social media, including community events and flyers to attract students and clients to your profile.",
    },
    {
      Question:
        "What if I want to cancel my subscription? What’s the refund policy?",
      Answer:
        "We do not offer refunds. If you are unsatisfied with the service, please cancel before the next billing cycle to avoid charges. You can cancel your plan directly through your dashboard at any time. Requirements: Reliable computer with audio and video capabilities, Strong Wi-Fi connection, Ability to teach and coach students virtually, Consistent hours with recurring weekly sessions, Willingness to offer a 25-minute free trial class, Ability to educate students across different age groups and academic levels. Required Skills and Qualifications: Bachelor’s degree or equivalent (preferred), At least one year of teaching experience, Excellent organizational and communication skills, Creative, positive, and energetic demeanor.",
    },
    {
      Question: "Ready to Empower and Be Empowered?",
      Answer:
        "Join EmpowerEd Learnings today and start running your own independent online mentoring business with all the support and tools you need to succeed. Our mission is to empower mentors like you so that you can empower others.Take advantage of our special offer and see how we can help you grow your student base and maximize your earnings.",
    },
  ];



    const [isMobile, setIsMobile] = useState(false);
    const router = useRouter();

    useEffect(() => {
    const handleResize = () => {
        setIsMobile(window.innerWidth <= 700);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    }, []);
    return (
      <>
        {isMobile ? (
          <FooterMobile studentFaq={homePageFAQ} tutorFaq={workWithUsFAQ} />
        ) : (
          <FooterDesktop studentFaq={homePageFAQ} tutorFaq={workWithUsFAQ} />
        )}
      </>
    );
}

export default Footer
