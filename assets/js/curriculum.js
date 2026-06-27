/**
 * Curriculum presets for the GPA/CGPA Calculator.
 * Contains pre-populated subjects and credits from the SKCET B.Tech Information Technology (2024-2028 Batch) Regulation 2022.
 */
const CURRICULUM_PRESETS = {
  skcet_it_24_28: {
    name: "SKCET - B.Tech Information Technology (2024-2028)",
    description: "Curriculum Regulation 2022 for the 2024-2028 Batch of Sri Krishna College of Engineering & Technology.",
    semesters: [
      {
        id: 1,
        name: "Semester 1",
        included: true,
        courses: [
          { code: "23MA101", name: "Mathematics I", credits: 4, grade: "" },
          { code: "23SB101", name: "Engineering Biology", credits: 3, grade: "" },
          { code: "23AS101", name: "Applied Science", credits: 4, grade: "" },
          { code: "23EC111", name: "Digital Logic Design and Computer Architecture", credits: 4, grade: "" },
          { code: "23CS101", name: "Problem Solving using C++", credits: 3, grade: "" },
          { code: "23IT101", name: "Application Development Practices", credits: 3, grade: "" },
          { code: "23AS102", name: "Applied Science Laboratory", credits: 1, grade: "" },
          { code: "23TA101", name: "Heritage of Tamils", credits: 1, grade: "" }
        ]
      },
      {
        id: 2,
        name: "Semester 2",
        included: false,
        courses: [
          { code: "23MA201", name: "Mathematics II", credits: 4, grade: "" },
          { code: "23EN101", name: "Oral and Written Communication Skills", credits: 3, grade: "" },
          { code: "23CS202", name: "Object Oriented Analysis and Design", credits: 4, grade: "" },
          { code: "23CS201", name: "Data Structures and Algorithms", credits: 3, grade: "" },
          { code: "23IT201", name: "Database Management Systems", credits: 3, grade: "" },
          { code: "23CY203", name: "Programming in Java", credits: 3, grade: "" },
          { code: "23TA201", name: "Tamils and Technology", credits: 1, grade: "" },
          { code: "23MC102", name: "Environmental Sciences (Mandatory)", credits: 0, grade: "" }
        ]
      },
      {
        id: 3,
        name: "Semester 3",
        included: false,
        courses: [
          { code: "23GE301", name: "Universal Human Values", credits: 3, grade: "" },
          { code: "23CY202", name: "Operating Systems", credits: 4, grade: "" },
          { code: "23ADC01", name: "Artificial Intelligence and Its Applications", credits: 3, grade: "" },
          { code: "23ITC02", name: "Data Communication and Networks", credits: 3, grade: "" },
          { code: "23CS303", name: "Algorithm Design Techniques", credits: 4, grade: "" },
          { code: "23CY305", name: "Applied Statistics Using Python", credits: 4, grade: "" },
          { code: "23CS304", name: "Frontend Frameworks", credits: 2, grade: "" }
        ]
      },
      {
        id: 4,
        name: "Semester 4",
        included: false,
        courses: [
          { code: "23CS404", name: "Backend Frameworks", credits: 2, grade: "" },
          { code: "23CSC02", name: "Machine Learning Techniques", credits: 3, grade: "" },
          { code: "23CYC01", name: "Cybersecurity Essentials", credits: 3, grade: "" },
          { code: "23EC411", name: "Signals and Linear Systems", credits: 4, grade: "" },
          { code: "23GEC01", name: "Entrepreneurships and Startup", credits: 3, grade: "" },
          { code: "23IT401", name: "Formal Languages and Automata Theory", credits: 4, grade: "" },
          { code: "23MCC11", name: "Disaster Management and Preparedness (Mandatory)", credits: 0, grade: "" },
          { code: "23MEC04", name: "Design Thinking and Idea Lab", credits: 1, grade: "" },
          { code: "23SLC01", name: "Multilingual Practices", credits: 1, grade: "" }
        ]
      },
      {
        id: 5,
        name: "Semester 5",
        included: false,
        courses: [
          { code: "23IT501", name: "Cryptography and Network Security", credits: 4, grade: "" },
          { code: "23ITC03", name: "Distributed Computing", credits: 3, grade: "" },
          { code: "23CS502", name: "Software Testing", credits: 3, grade: "" },
          { code: "23XXXX", name: "Professional Elective - I", credits: 3, grade: "" },
          { code: "23XXXX", name: "Professional Elective - II", credits: 3, grade: "" },
          { code: "23CS505", name: "Cloud Infrastructure & Services Management", credits: 2, grade: "" },
          { code: "23CS503", name: "Application Development (Mini Project)", credits: 3, grade: "" }
        ]
      },
      {
        id: 6,
        name: "Semester 6",
        included: false,
        courses: [
          { code: "23IT603", name: "Information Coding Techniques", credits: 4, grade: "" },
          { code: "23IT604", name: "Mobile Application Development", credits: 3, grade: "" },
          { code: "23ITC01", name: "Internet of Things", credits: 3, grade: "" },
          { code: "23CSC04", name: "Principles of Compiler Design", credits: 4, grade: "" },
          { code: "23XXXX", name: "Professional Elective - III", credits: 3, grade: "" },
          { code: "23XXXX", name: "Professional Elective - IV", credits: 3, grade: "" },
          { code: "23IT605", name: "Prototype Lab (Mini Project)", credits: 1, grade: "" },
          { code: "23xxxx", name: "Indian Constitution (Mandatory)", credits: 0, grade: "" }
        ]
      },
      {
        id: 7,
        name: "Semester 7",
        included: false,
        courses: [
          { code: "23XXXX", name: "Open / Emerging / Industrial Elective - I", credits: 3, grade: "" },
          { code: "23XXXX", name: "Open / Emerging / Industrial Elective - II", credits: 3, grade: "" },
          { code: "23XXXX", name: "Open / Emerging / Industrial Elective - III", credits: 3, grade: "" },
          { code: "23XXXX", name: "Professional Elective - V", credits: 3, grade: "" },
          { code: "23XXXX", name: "Professional Elective - VI", credits: 3, grade: "" },
          { code: "23IT701", name: "Project - I", credits: 3, grade: "" },
          { code: "23EES01", name: "Employability Enhancement Skills (Internship)", credits: 2, grade: "" }
        ]
      },
      {
        id: 8,
        name: "Semester 8",
        included: false,
        courses: [
          { code: "23IT801", name: "Project - II", credits: 12, grade: "" }
        ]
      }
    ]
  }
};
