package com.prakash.semora.data

import com.prakash.semora.model.Course
import com.prakash.semora.model.SemesterData

object SemesterCurriculum {

    private val allSemesters = listOf(
        SemesterData(1, listOf(
            Course("23MA101", "Mathematics I", 4),
            Course("23SB101", "Engineering Biology", 3),
            Course("23AS101", "Applied Science", 4),
            Course("23EC111", "Digital Logic Design and Computer Architecture", 4),
            Course("23CS101", "Problem Solving using C++", 3),
            Course("23IT101", "Application Development Practices", 3),
            Course("23AS102", "Applied Science Laboratory", 2),
            Course("23TA101", "Heritage of Tamils", 1)
        )),
        SemesterData(2, listOf(
            Course("23MA201", "Mathematics II", 4),
            Course("23EN101", "Oral and Written Communication Skills", 3),
            Course("23CS202", "Object Oriented Analysis and Design", 4),
            Course("23CS201", "Data Structures and Algorithms", 3),
            Course("23IT201", "Database Management Systems", 3),
            Course("23CY203", "Programming in Java", 3),
            Course("23TA201", "Tamils and Technology", 1)
        )),
        SemesterData(3, listOf(
            Course("23GE301", "Universal Human Values", 3),
            Course("23CY202", "Operating Systems", 4),
            Course("23ADC01", "Artificial Intelligence and Its Applications", 3),
            Course("23ITC02", "Data Communication and Networks", 3),
            Course("23CS303", "Algorithm Design Techniques", 4),
            Course("23CY305", "Applied Statistics Using Python", 4),
            Course("23CS304", "Frontend Frameworks", 2)
        )),
        SemesterData(4, listOf(
            Course("23CS404", "Backend Frameworks", 2),
            Course("23CSC02", "Machine Learning Techniques", 3),
            Course("23CYC01", "Cybersecurity Essentials", 3),
            Course("23EC411", "Signals and Linear Systems", 4),
            Course("23GEC01", "Entrepreneurships and Startup", 3),
            Course("23IT401", "Formal Languages and Automata Theory", 4),
            Course("23MEC04", "Design Thinking and Idea Lab", 1),
            Course("23SLC01", "Multilingual Practices", 1)
        )),
        SemesterData(5, listOf(
            Course("23IT501", "Cryptography and Network Security", 4),
            Course("23ITC03", "Distributed Computing", 3),
            Course("23CS502", "Software Testing", 3),
            Course("23XXXX", "Professional Elective - I", 3),
            Course("23XXXX", "Professional Elective - II", 3),
            Course("23CS505", "Cloud Infrastructure & Services Management", 2),
            Course("23CS503", "Application Development (Mini Project)", 3)
        )),
        SemesterData(6, listOf(
            Course("23IT603", "Information Coding Techniques", 4),
            Course("23IT604", "Mobile Application Development", 3),
            Course("23ITC01", "Internet of Things", 3),
            Course("23CSC04", "Principles of Compiler Design", 4),
            Course("23XXXX", "Professional Elective - III", 3),
            Course("23XXXX", "Professional Elective - IV", 3),
            Course("23IT605", "Prototype Lab (Mini Project)", 1),
            Course("23XXXX", "Indian Constitution (Mandatory)", 0)
        )),
        SemesterData(7, listOf(
            Course("23XXXX", "Open / Emerging / Industrial Elective - I", 3),
            Course("23XXXX", "Open / Emerging / Industrial Elective - II", 3),
            Course("23XXXX", "Open / Emerging / Industrial Elective - III", 3),
            Course("23XXXX", "Professional Elective - V", 3),
            Course("23XXXX", "Professional Elective - VI", 3),
            Course("23IT701", "Project - I", 3),
            Course("23EES01", "Employability Enhancement Skills (Internship)", 2)
        )),
        SemesterData(8, listOf(
            Course("23IT801", "Project - II / Industrial Project", 12)
        ))
    )

    fun getSemester(number: Int): SemesterData =
        allSemesters.firstOrNull { it.number == number }
            ?: SemesterData(number, emptyList())

    fun getAllSemesters(): List<SemesterData> = allSemesters

    val totalCurriculumCredits: Int by lazy {
        allSemesters.sumOf { semester -> semester.courses.sumOf { it.credits } }
    }

    val grades = listOf("O", "A+", "A", "B+", "B", "C", "U")

    fun gradeToPoint(grade: String): Double = when (grade) {
        "O" -> 10.0
        "A+" -> 9.0
        "A" -> 8.0
        "B+" -> 7.0
        "B" -> 6.0
        "C" -> 5.0
        "U" -> 0.0
        else -> 0.0
    }
}
