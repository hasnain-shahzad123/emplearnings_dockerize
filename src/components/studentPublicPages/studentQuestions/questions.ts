
const academic_tutoring_questions = [
  {
    question: "Which grade is the student currently in?",
    pleaseSpecify: false,
    SelectMultiple: false,
    answers: [
      "Kindergarten",
      "Elementary (1-5)",
      "Middle School (6-8)",
      "High School (9-12)",
      "College/University",
    ],
  },
  {
    question: "What is the age of the student?",
    pleaseSpecify: false,
    SelectMultiple: false,
    answers: [
      "Under 6 years",
      "6-10 years",
      "11-14 years",
      "15-18 years",
      "19+ years",
    ],
  },
  {
    question: "Which subject(s) do you need help with?",
    pleaseSpecify: false,
    SelectMultiple: true,
    answers: [
      "Mathematics",
      "Science",
      "English",
      "History",
      "Foreign Language",
      "All of the above",
    ],
  },
  {
    question: "What is your main goal for hiring a tutor?",
    pleaseSpecify: false,
    SelectMultiple: false,
    answers: [
      "Improve grades",
      "Prepare for exams",
      "Standardized tests",
      "Understand difficult concepts",
    ],
  },
  {
    question: "How often would you like to meet with your tutor?",
    pleaseSpecify: false,
    SelectMultiple: false,
    answers: [
      "Once a week (4 lessons)",
      "Twice a week (8 lessons)",
      "Three times a week (12 lessons)",
    ],
  },
];
  
  const life_coaching_questions = [
    {
      question: "What is the age of the student?",
      pleaseSpecify: false,
      SelectMultiple: false,
      answers: ["Under 10 years", "10-15 years", "16-20 years", "21+ years"],
    },
    {
      question: "Please indicate the areas where improvement is needed:",
      pleaseSpecify: true,
      SelectMultiple: true,
      answers: [
        "Time Management",
        "Communication Skills",
        "Emotional Intelligence",
        "Self-Motivation",
        "Resilience",
        "All of the above",
      ],
    },
    {
      question: "What is your main goal for hiring a coach?",
      pleaseSpecify: false,
      SelectMultiple: false,
      answers: [
        "Develop leadership skills",
        "Improve self-confidence",
        "Manage stress",
        "Personal growth",
      ],
    },
    {
      question: "How often would you like to meet with your coach?",
      pleaseSpecify: false,
      SelectMultiple: false,
      answers: ["Once a week", "Twice a week", "Three times a week"],
    },
  ];
  
  const skill_development_questions = [
    {
      question: "What is the age of the student?",
      pleaseSpecify: false,
      SelectMultiple: false,
      answers: ["Under 10 years", "10-15 years", "16-20 years", "21+ years"],
    },
    {
      question: "Which skill would you like to develop or improve?",
      pleaseSpecify: false,
      SelectMultiple: false,
      answers: [
        "Coding (e.g., Python, JavaScript, HTML/CSS)",
        "Public Speaking",
        "Essay Writing",
        "Financial Literacy",
        "Content Writing",
        "Digital Marketing",
        "Music (e.g., guitar, piano, vocals)",
        "Art (e.g., painting, drawing, digital art)",
      ],
    },
    {
      question: "What is your current proficiency level in this skill?",
      pleaseSpecify: false,
      SelectMultiple: false,
      answers: ["Beginner", "Intermediate", "Advanced"],
    },
    {
      question: "What is your main goal for developing this skill?",
      pleaseSpecify: false,
      SelectMultiple: false,
      answers: [
        "Career Advancement",
        "Academic Improvement",
        "Personal Development",
        "Hobby or leisure",
      ],
    },
    {
      question: "How often would you like to meet with your instructor?",
      pleaseSpecify: false,
      SelectMultiple: false,
      answers: ["Once a week", "Twice a week", "Three times a week"],
    },
  ];
  
  export { academic_tutoring_questions, life_coaching_questions, skill_development_questions };
  