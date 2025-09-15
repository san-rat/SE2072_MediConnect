# MediConnect Frontend

## 🚀 Quick Start

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation & Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   - The app will automatically open at `http://localhost:3000`
   - Or manually navigate to the URL shown in the terminal

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## 🎨 Design System

### Technologies Used
- **React 19.1.1** with **Vite 7.1.2**
- **JavaScript (JSX)** - No TypeScript
- **CSS3** with modern features (Grid, Flexbox, CSS Variables)
- **ESLint** for code quality

### Medical Theme
- **Primary Color:** `#0c8fad` (Medical blue)
- **Secondary Color:** `#7bc1b7` (Light teal)
- **Background:** Linear gradient with medical theme
- **Typography:** Inter font family
- **Glass Morphism:** Backdrop blur effects with transparency

### Responsive Design
- Mobile-first approach
- Breakpoints: 1024px, 768px, 480px, 360px
- Flexible layouts using CSS Grid and Flexbox

## 📁 Project Structure

```
frontend/
├── public/
│   └── vite.svg          # Favicon
├── src/
│   ├── components/
│   │   └── BookingPage.jsx  # Main booking component
│   ├── App.jsx           # Main app component
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles & design system
├── index.html           # HTML template
├── package.json         # Dependencies & scripts
├── vite.config.js      # Vite configuration
└── eslint.config.js    # ESLint configuration
```

## 🔧 Current Features

### Stage 1: Foundation ✅
- ✅ Blank booking page with header
- ✅ Styled container with glass morphism
- ✅ Medical theme design system
- ✅ Responsive layout
- ✅ No functionality yet (placeholder content)

### Next Stages (Coming Soon)
- 🔄 Booking form implementation
- 🔄 Doctor selection
- 🔄 Date/time picker
- 🔄 Form validation
- 🔄 API integration
