# **App Name**: VolleyManager

## Core Features:

- User Authentication: Local user registration, login, and logout system with session persistence using localStorage.
- Session Management: Create, view, and manage volleyball sessions with date, time, and player capacity. Administrators can add, modify, or remove sessions.
- Player Enrollment: Allow logged-in users to enroll/unenroll from sessions, automatically adding their username to the session roster. Maintain a waiting list and automatically promote users when spots open.
- Session Display: Show a clear listing of sessions including date, time, capacity, and enrolled players.
- Session Filtering: Sort the list of sessions to display future or past sessions.
- Automated Waiting List: Upon unenrollment, automatically adds the first waiting-listed player to the list of active players
- Admin Session Control: Administrators can add, modify, or remove sessions, including their date and time.

## Style Guidelines:

- Primary color: Deep purple (#6A1B9A) to align with the user's request for purple theming and to convey energy and vibrancy.
- Background color: Dark gray (#262A2B) for a modern, dark-themed aesthetic as requested.
- Accent color: Bright orange (#FF8F00) to provide contrast and highlight interactive elements such as buttons.
- Body and headline font: 'Inter', a sans-serif, to ensure excellent readability.
- Employ smooth animations via framer-motion to create sessions appearing and disappearing, which helps to enhance user experience. These subtle motions make UI transitions feel fluid, dynamic, and visually appealing.
- Use a tab-based layout for navigation between 'Upcoming Sessions' and 'Past Sessions', enhancing the user experience with clear sectioning and easy access.