# Recipe Book

A modern, responsive recipe book application built with React, TypeScript, and Vite. Store, search, and manage your favorite recipes with images.

## Features

- 📝 Add new recipes with ingredients, instructions, and images
- 🔍 Search recipes by name, ingredients, or instructions
- 📱 Responsive design that works on all devices
- 💾 Local storage for data persistence
- 🖼️ Image upload and preview functionality
- 🎨 Modern, clean UI with smooth animations

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS3 with modern design patterns
- **Deployment**: Vercel-ready configuration

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd recipe-book
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

This project is configured for easy deployment on Vercel:

### Deploy to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Connect your repository to Vercel
3. Vercel will automatically detect the Vite configuration and deploy your app

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. The built files will be in the `dist` directory
3. Deploy the `dist` directory to your hosting provider

### Environment Variables

No environment variables are required for this application as it uses local storage for data persistence.

## Project Structure

```
recipe-book/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   ├── App.tsx         # Main application component
│   ├── main.tsx        # Application entry point
│   ├── App.css         # Application styles
│   └── index.css       # Global styles
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── vite.config.ts      # Vite configuration
├── vercel.json         # Vercel deployment configuration
└── README.md           # This file
```

## Features in Detail

### Recipe Management
- Add new recipes with a form interface
- Upload and preview recipe images
- Store recipes locally in the browser
- View recipe details in a modal

### Search Functionality
- Real-time search across recipe names
- Search through ingredients and instructions
- Case-insensitive search

### User Interface
- Clean, modern design
- Responsive grid layout
- Smooth hover animations
- Modal dialogs for recipe details
- Mobile-friendly interface

## Browser Support

This application works in all modern browsers that support:
- ES6+ JavaScript features
- CSS Grid and Flexbox
- File API for image uploads
- Local Storage API

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.