# AutoHub 🚗💬
`Connect, Chat, and Catch Up `

AutoHub is a fast, responsive web application designed for mechanics and automotive enthusiasts. Built as a rapid prototype, it provides a centralized platform for users to connect via real-time chat and stay updated with the latest automotive news and vehicle specifications.

## Features
- **User Authentication:** Secure sign-up and login powered by Firebase Authentication.
- **Real-Time Community Chat:** Instant messaging using Cloud Firestore real-time listeners.
- **Daily Automotive News:** Fetch and display the latest car news and specifications using the AutoTools API / CarAPI.
- **Responsive UI:** Built with React and styled with Tailwind CSS for a modern look on any device.

## Tech Stack
- **Frontend:** React (Vite), Tailwind CSS
- **Backend/BaaS:** Firebase (Authentication, Cloud Firestore)
- **Data Source:** AutoTools API (Free JSON endpoints) or CarAPI
- **Routing:** React Router DOM

## Getting Started
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Copy `.env.example` to `.env.local` and fill in your Firebase web app config (`VITE_FIREBASE_*`) and GNews key.
4. Run `npm run dev` to start the development server.
