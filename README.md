
# PetroManage Frontend

PetroManage is a modern asset, production, and compliance management platform for the oil & gas industry. This is the frontend (React + Vite) application.

## Features
- Role-based dashboards for Admin and Operational Manager
- Asset registration, lifecycle, and KPIs
- Production planning and tracking
- Maintenance management
- Compliance reporting
- Interactive charts and analytics
- Responsive, animated UI

## Tech Stack
- React 18
- Vite
- Redux Toolkit
- Framer Motion (animations)
- Axios (API requests)
- Tailwind CSS (utility-first styling)

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm

### Installation
1. Clone the repository:
	```sh
	git clone <repo-url>
	cd PetroManage
	```
2. Install dependencies:
	```sh
	npm install
	```

### Running the App
Start the development server:
```sh
npm run dev
```
The app will be available at `http://localhost:5173` by default.

### Build for Production
```sh
npm run build
```

### Linting
```sh
npm run lint
```

## Project Structure
```
PetroManage/
├── public/                # Static assets
├── src/
│   ├── components/        # Feature-based React components
│   ├── pages/             # Route-based pages
│   ├── store/             # Redux slices and store
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Entry point
├── package.json
├── vite.config.js
└── README.md
```

## API
- The frontend expects a backend running at `http://localhost:8080` (configurable in API calls).
- See API endpoints in the code (e.g., `/api/assets`, `/api/production-plans`).

## Authentication & Roles
- User info and role are managed via Redux.
- Conditional rendering and access control are enforced in the UI.

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

<!-- ## License
[MIT](LICENSE) -->
