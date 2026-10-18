# AutoHub 🚗💬
`Connect, Chat, and Catch Up`

AutoHub is a dark, app-like web app for mechanics and automotive enthusiasts: live chat rooms, daily car news, a diagnostics bay and a VIN-powered garage, all in one place.

## Features
- **Accounts:** Sign up with your name, email and password (Firebase Authentication).
- **Live chat rooms:** General, Repair Help, EV & Hybrids and Classics & Builds. Real-time messages with avatars, grouping, quick emoji and deleting your own messages (Cloud Firestore).
- **Auto news:** Featured story, category filters, search, bookmarks and an in-app reader. Uses the GNews API, with built-in demo stories when no key is set.
- **Diagnostics bay:** An interactive instrument cluster that decodes 12 dashboard warning lights, and a symptom checker that ranks likely causes with difficulty and typical cost.
- **Garage:** Decode any 17-character VIN, check official safety recalls (NHTSA) and save your cars.
- **Home dashboard:** Greeting, quick tiles, top stories, mechanic tip of the day and a live chat preview.
- **Responsive:** Desktop top navigation, mobile bottom tab bar.

## Tech Stack
- **Frontend:** React 19 (Vite), React Router, Tailwind CSS v4, lucide-react
- **Backend/BaaS:** Firebase (Authentication, Cloud Firestore)
- **Data:** GNews API, NHTSA vPIC & Recalls APIs, Unsplash photos

## Getting Started
1. Clone the repository and run `npm install`.
2. Copy `.env.example` to `.env.local` and fill in your Firebase web app config (`VITE_FIREBASE_*`). `VITE_GNEWS_API_KEY` is optional.
3. In the Firebase console: enable Email/Password sign-in, create a Firestore database, and publish the rules from `firestore.rules`.
4. Run `npm run dev`.

Step-by-step setup: `docs/TODO.md`. How everything works: `docs/TUTOR.md`.
