# 🧩 Maze-Master – The Ultimate Maze Challenge

**Maze-Master** is a thrilling and brain-teasing **maze puzzle game** built with **React Native**.  
Challenge yourself through ever-twisting mazes, unlock progressive levels, and take on daily challenges that test your memory, speed, and wit — all with a touch of fun and addictive design!

---

## 🎮 Game Features

- 🔓 **Multiple Levels**
  - Increasing difficulty with each level: easy, medium, hard, extreme
- 📆 **Daily Challenges**
  - Fresh, procedurally generated maze every day
- 🕹️ **Interactive UI**
  - Swipe to move, tap to interact, and animations that make it feel alive
- 🌟 **Stars & Rewards**
  - Earn stars based on completion speed and path efficiency
- 🔥 **Progress Tracker**
  - See your stats: levels completed, best times, challenge streaks
- 🧠 **Hints & Powerups**
  - Get assistance with tricky mazes or reveal partial paths
- 🏆 **Leaderboard**
  - Compare your maze-solving prowess with friends and global players
- 🎨 **Colorful Themes**
  - Light/dark mode and fun custom themes

---

## 🧰 Tech Stack

| Tech              | Usage                                  |
|-------------------|-----------------------------------------|
| **React Native**  | Game UI & logic                         |
| **TypeScript**    | Type-safe development                   |
| **Firebase**      | Auth, Firestore DB, Daily Maze Sync     |
| **React Navigation** | Screen and level transitions         |
| **Expo**          | Development & Deployment                |
| **Lottie Animations** | Fun win/lose animations   |

---

## 🔥 Firebase Features

- 🔐 **Authentication**
  - Sign up, login, and sync progress securely
- ☁️ **Cloud Firestore**
  - Store user data, daily mazes, leaderboard
- 🗓️ **Scheduled Maze Updates**
  - Backend functions (or manual admin update) for daily mazes

---

## 📱 Installation

### Prerequisites

- Node.js v18+
- Expo CLI installed (`npm install -g expo-cli`)
- Firebase project & credentials

### Clone and Run

```
git clone https://github.com/yourusername/maze-master.git
cd maze-master
npm install
npx expo start
```
Scan the QR code with Expo Go or run on simulator.

🔐 Environment Variables
Create a .env file in the root directory:

env
```
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```
Then import it into your Firebase config file using expo-constants or react-native-dotenv.

🗂️ Project Structure (Simplified)
bash
```
maze-master/
├── assets/             # Images, icons, sounds
├── components/         # Reusable UI components
├── screens/            # Game screens: Home, Level, Win, etc
├── utils/              # Maze generation, timer logic
├── firebase/           # Firebase config and helpers
├── App.tsx             # Main entry point
└── .env
```

## 🧪 Features To Expand
Here are more fun ideas for you to build in:

- 🧩 Maze editor (design your own)

- 👨‍👩‍👧‍👦 Multiplayer races

- 🧙 Powerups like teleport, freeze, and maze rotation

- 🧬 AI auto-solver for hints

- 💬 In-game chat for daily challenges

## 💡 Inspiration
Maze-Master was created to blend fun gameplay with cognitive challenge, giving players a new twist on classic mazes every single day. Whether you're a casual puzzle lover or a speedrunner, there’s a challenge for everyone.

## 👨‍💻 Author
Brendan Mebuge Kamsiyochukwu
📬 brendanmebson@gmail.com

## 🙌 Shoutouts
To every puzzle nerd, gamer, and dev who believes fun and brainpower can go hand-in-hand — Maze-Master was made for you. 🔥🧠🎉

Enter the Maze. Escape the Ordinary. 🚪✨
