# Requirement Document for Exam Booking System

## User (Admin)
Admins should be able to:
- **Authenticate** on the system using email and password
- **Create courses** on the dashboard with details:
    >-course title
    >-course code
    >-level
- **View dashboard** showing upcoming exams, number of students registered for each upcoming exam, total number of reschedule requests
- **Reschedule** a course for a different date and time slot
- **Accept/Reject** a student's reschedule request

## The System
The system should be able to:
- **Create admins** where necessary
- **Seed Db** with admin login details and courses
- **Calculate number of students** for a given exam batch
- **Process student payments** for rescheduling and allow students to reschedule when payment is confirmed (post mvp implementation)

## User (Student)
Students should be able to:
- **Complete** onboarding on the platform which includes
    >-*fill in basic details* such as their babcock email, name, level, course of study, faculty, matric number and password 
    >-*selecting* the courses they would be offering from a list of predefined courses
    >-*authenticating* with their details
- **Log in** to the platform
- **View a dashboard** containing their name, an their schedule including:
    >-Past exams
    >-Incoming exams
    >-Missed exams
- **Choose a time slot** for a particular exam
- **Reschedule the time** for their exam at least 24 hours before the exam is slated to happen
- **Submit a reschedule request** if they miss their timeslot by submitting *a valid reason* for missing their exams. This *reason* would be approved by an *admin*. If reason was *rejected, student is prompted to pay before rescheduling*