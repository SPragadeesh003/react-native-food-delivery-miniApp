# React-native-food-delivery-miniApp
A simple, clean food delivery application built with React Native, Expo, and Firebase. This app provides core functionalities like user authentication, a list of food items fetched from a backend, and a shopping cart with quantity management.

![App Screenshot](https://github.com/SPragadeesh003/react-native-food-delivery-miniApp/blob/main/Home_screen.jpg)

---

## Features

-   **User Authentication:** Secure login and signup powered by Firebase Authentication.
-   **Real-time Food Listing:** Food items are fetched in real-time from a Cloud Firestore database.
-   **Shopping Cart:** Add items to the cart, update quantities, and see the total price update instantly.
-   **Clean, Modern UI:** A user-friendly interface inspired by modern design patterns.

---

## Tech Stack

-   **Frontend:** React Native with Expo
-   **Backend:** Google Firebase
    -   **Authentication:** For user management.
    -   **Cloud Firestore:** As the real-time NoSQL database.
-   **Navigation:** React Navigation
-   **State Management:** React Hooks (`useState`, `useEffect`)

---

## Installation and Setup Guide

To get the project running on a local machine for development and testing purposes, please follow the steps outlined below.

### 1. Prerequisites

Before proceeding, ensure that your development environment meets the following requirements:

-   **Node.js:** The Long Term Support (LTS) version of Node.js is required. It can be downloaded from the official [nodejs.org](https://nodejs.org/) website.
-   **Expo CLI:** The Expo Command Line Interface must be installed globally on your system. This can be accomplished by executing the following command in your terminal:
    ```bash
    npm install -g expo-cli
    ```
-   **Expo Go Application:** The Expo Go application must be installed on your target mobile device (iOS or Android). It is available on the App Store and Google Play Store.

### 2. Clone the Repository

First, obtain a local copy of the project by cloning the repository.

```bash
git clone https://github.com/SPragadeesh003/react-native-food-delivery-miniApp
cd react-native-food-delivery-miniApp
```

### 3. Install Dependencies
Once the repository is cloned, navigate to the project directory and install the required npm packages.
```bash
npm install
```
### 4. Firebase Configuration
This application requires a Firebase project to serve as its backend for authentication and data storage.

-  **Create a Firebase Project:** Navigate to the Firebase Console and create a new project.
-  **Create a Web Application:** Within the project dashboard, add a new Web Application by clicking the </> icon. Upon registration, Firebase will provide the necessary configuration credentials.
-  **Enable Authentication Provider:** In the console's "Authentication" section, proceed to the "Sign-in method" tab and enable the Email/Password provider.
-  **Create Firestore Database:** Navigate to the "Firestore Database" section and select "Create database." For development purposes, it is permissible to initialize the database in Test Mode.

## Create products Collection:

-  Within the Firestore data view, initiate a new collection by clicking "+ Start collection".
-  Specify products as the Collection ID.
-  Add a new document to represent the first food item, ensuring it contains the fields: name (string), price (number), and description (string).

## Configure the Application:

-  In the root directory of your local project, create a new file named firebase.js.
-  Copy the firebaseConfig object provided in your Firebase project settings and paste it into this new file. The resulting file should conform to the following structure:
```
// file: firebase.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  // PASTE YOUR FIREBASE CONFIGURATION HERE
  apiKey: "AIza...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getFirestore(app);

export { auth, db };
```
---

### 5. Running the Application
-  **Start the Metro Server:** Execute the following command from the project's root directory. The -c flag is recommended for the initial launch to clear any cached data.
```bash
npx expo start -c
```
-  **Launch on a Mobile Device:** A QR code will be generated in the terminal. Launch the Expo Go application on your mobile device and scan the QR code. The application will then build and load onto your device.

---

## Project Structure
```
FoodDeliveryApp/
├── assets/
│   ├── burger.png
│   └── ...
├── screens/
│   ├── LoginScreen.js
│   ├── SignUpScreen.js
│   ├── HomeScreen.js
│   └── CartScreen.js
├── App.js
├── firebase.js
├── package.json
└── ...
```
=======
