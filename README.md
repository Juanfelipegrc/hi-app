# Hi - Messaging App

Hi is a real-time messaging application that allows users to chat seamlessly using Firebase for message synchronization. The app is designed to provide a modern and efficient communication experience similar to popular messaging platforms.

## Features
- **Real-time Messaging**: Messages are instantly synchronized across devices using Firebase.
- **User Authentication**: Secure login and authentication.
- **Add Contacts**: Users can add and manage contacts using email and nickname.
- **Profile Management**: Users can edit their profile, including profile picture and description.
- **Smooth Animations**: Uses `animate.css` for a fluid user experience.

## Tech Stack
### Frontend
- **React** (`^18.3.1`)
- **React Router DOM** (`^7.0.2`)
- **Redux Toolkit** (`^2.5.0`)
- **Tailwind CSS** (`^4.0.2`)
- **Animate.css** (`^4.1.1`)
- **SweetAlert2** (`^11.15.2`)

### Backend & Database
- **Firebase** (`^11.0.2`)
- **JSON Web Token (JWT)** (`^9.0.2`)

### Development & Tooling
- **Vite** (`^6.0.11`) - Fast build tool
- **ESLint** (`^9.15.0`) - Code linting
- **PostCSS & Autoprefixer** - Styling utilities
- **Headless UI & Heroicons** - UI Components

## Installation
To run this project locally, follow these steps:

### Prerequisites
- Node.js installed
- Firebase project setup

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/whatsapp-replica.git
   cd whatsapp-replica
   ```
2. Install dependencies using Yarn:
   ```sh
   yarn install
   ```
3. Configure Firebase:
   - Create a `.env` file and add your Firebase credentials.
4. Start the development server:
   ```sh
   yarn dev
   ```

## Project Structure
```
whatsapp-replica/
│── src/
│   ├── components/   # Reusable components
│   ├── hooks/        # Custom hooks
│   ├── pages/        # Application pages
│   ├── redux/        # Redux store & slices
│   ├── styles/       # Tailwind styles
│── public/           # Static assets
│── .eslintrc.json    # ESLint config
│── package.json      # Project dependencies
│── vite.config.js    # Vite configuration
```

## Contributing
Contributions are welcome! Feel free to fork the project, create a new branch, and submit a pull request.

## License
This project is licensed under the MIT License.

---
Developed by **Juan Felipe García Rojas** 

