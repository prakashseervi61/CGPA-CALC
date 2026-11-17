/**
 * Curriculum presets for the Semora academic tracker.
 * Contains pre-populated subjects and credits from the SKCET B.Tech Information Technology (2024-2028 Batch) Regulation 2022.
 */
export const CURRICULUM_PRESETS = {
  skcet_it_24_28: {
    name: "SKCET - B.Tech Information Technology (2024-2028)",
    description: "Curriculum Regulation 2022 for the 2024-2028 Batch of Sri Krishna College of Engineering & Technology.",
    semesters: [
      { id: 1, name: "Semester 1", included: true, courses: [
        { name: "Subject 1", credits: 4, grade: "" },
        { name: "Subject 2", credits: 3, grade: "" },
        { name: "Subject 3", credits: 4, grade: "" }
      ] },
      { id: 2, name: "Semester 2", included: false, courses: [
        { name: "Subject 1", credits: 4, grade: "" },
        { name: "Subject 2", credits: 3, grade: "" },
        { name: "Subject 3", credits: 4, grade: "" }
      ] },
      { id: 3, name: "Semester 3", included: false, courses: [
        { name: "Subject 1", credits: 3, grade: "" },
        { name: "Subject 2", credits: 4, grade: "" },
        { name: "Subject 3", credits: 3, grade: "" }
      ] },
      { id: 4, name: "Semester 4", included: false, courses: [
        { name: "Subject 1", credits: 2, grade: "" },
        { name: "Subject 2", credits: 3, grade: "" },
        { name: "Subject 3", credits: 3, grade: "" }
      ] },
      { id: 5, name: "Semester 5", included: false, courses: [
        { name: "Subject 1", credits: 4, grade: "" },
        { name: "Subject 2", credits: 3, grade: "" },
        { name: "Subject 3", credits: 3, grade: "" }
      ] },
      { id: 6, name: "Semester 6", included: false, courses: [
        { name: "Subject 1", credits: 4, grade: "" },
        { name: "Subject 2", credits: 3, grade: "" },
        { name: "Subject 3", credits: 3, grade: "" }
      ] },
      { id: 7, name: "Semester 7", included: false, courses: [
        { name: "Subject 1", credits: 3, grade: "" },
        { name: "Subject 2", credits: 3, grade: "" },
        { name: "Subject 3", credits: 3, grade: "" }
      ] },
      { id: 8, name: "Semester 8", included: false, courses: [
        { name: "Subject 1", credits: 6, grade: "" }
      ] }
    ]
  }
};
