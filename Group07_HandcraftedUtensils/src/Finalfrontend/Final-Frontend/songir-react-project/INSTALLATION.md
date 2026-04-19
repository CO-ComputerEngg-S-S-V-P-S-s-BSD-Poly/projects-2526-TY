# Songir Marketplace - Installation Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:
- **Node.js** (version 14.0 or higher)
- **npm** (comes with Node.js)

To check if you have these installed, run:
```bash
node --version
npm --version
```

## 🚀 Installation Steps

### Step 1: Extract the Project
Extract the `songir-react-project` folder to your desired location.

### Step 2: Navigate to Project Directory
```bash
cd songir-react-project
```

### Step 3: Install Dependencies
```bash
npm install
```

This will install all required packages:
- React
- React DOM
- React Router DOM
- React Scripts

### Step 4: Start the Development Server
```bash
npm start
```

The application will automatically open in your browser at `http://localhost:3000`

## 📁 Project Structure

```
songir-react-project/
├── public/
│   └── index.html           # Main HTML file
├── src/
│   ├── components/
│   │   ├── common/          # Reusable components (Navbar, Footer)
│   │   └── home/            # Home page sections
│   ├── pages/               # All page components
│   │   ├── HomePage.js
│   │   ├── AboutPage.js
│   │   ├── ShopsPage.js
│   │   ├── ProductsPage.js
│   │   ├── ComparePage.js
│   │   ├── QuotePage.js
│   │   ├── WishlistPage.js
│   │   ├── OrdersPage.js
│   │   └── ContactPage.js
│   ├── styles/              # CSS files
│   │   ├── App.css          # Main stylesheet
│   │   ├── Navbar.css
│   │   ├── Footer.css
│   │   └── HeroSection.css
│   ├── utils/               # Utility functions
│   │   └── Icons.js         # SVG Icons library
│   ├── data/                # Mock data
│   │   └── mockData.js      # Products, shops, testimonials
│   ├── App.js               # Main App component
│   └── index.js             # Entry point
├── package.json             # Project dependencies
└── README.md               # Project documentation
```

## 🎨 Color Theme

The project uses the traditional Copper-Brass theme:

| Color Name | Hex Code | Usage |
|-----------|----------|-------|
| Copper Brown | #B87333 | Primary buttons, highlights |
| Brass Gold | #C9A44C | Secondary elements, accents |
| Cream | #FFF6E5 | Background |
| Dark Brown | #3E2723 | Text, headings |

## 🛠️ Available Scripts

### `npm start`
Runs the app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm build`
Builds the app for production to the `build` folder.
The build is minified and optimized for best performance.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm eject`
**Note: this is a one-way operation. Once you `eject`, you can't go back!**
This command will copy all configuration files and dependencies into your project.

## 🌐 Routing

The application uses React Router for navigation:

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page with hero, features |
| `/about` | About Songir | Information about the village |
| `/shops` | Shops | List of all artisan shops |
| `/shops/:id` | Shop Detail | Individual shop details |
| `/products` | Products | All products catalog |
| `/products/:id` | Product Detail | Individual product page |
| `/compare` | Compare | Price comparison tool |
| `/quote` | Get Quote | Request custom quotes |
| `/wishlist` | Wishlist | Saved products |
| `/orders` | Orders | Order tracking |
| `/contact` | Contact | Contact form |

## 📝 Key Features

### Customer Features
✅ Browse multiple shopkeepers' products
✅ Detailed product information
✅ Shop and price comparison
✅ Custom quote requests
✅ Wishlist functionality
✅ Order tracking
✅ Review system

### Technical Features
✅ **Pure React** - No external frameworks
✅ **Pure CSS** - No CSS frameworks (no Tailwind, Bootstrap)
✅ **Responsive Design** - Mobile-first approach
✅ **React Router** - Client-side routing
✅ **Component-based** - Reusable components
✅ **Mock Data** - Ready-to-use sample data

## 🔧 Customization

### Adding New Products
Edit `src/data/mockData.js`:
```javascript
export const products = [
  {
    id: 9,
    name: "Your Product Name",
    category: "Category",
    material: "Brass/Copper",
    shopId: 1,
    price: 500,
    // ... other fields
  }
];
```

### Modifying Colors
Edit CSS variables in `src/styles/App.css`:
```css
:root {
  --color-copper: #B87333;
  --color-brass: #C9A44C;
  /* Modify as needed */
}
```

### Adding New Pages
1. Create component in `src/pages/`
2. Add route in `src/App.js`
3. Add navigation link in `src/components/common/Navbar.js`

## 🐛 Troubleshooting

### Port Already in Use
If port 3000 is already in use:
```bash
# Kill the process using port 3000
npx kill-port 3000

# Or run on a different port
PORT=3001 npm start
```

### Module Not Found
If you get module errors:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Build Errors
```bash
# Clear build cache
rm -rf build
npm run build
```

## 📦 Deployment

### Build for Production
```bash
npm run build
```

This creates a `build` folder with optimized production files.

### Deploy to Vercel/Netlify
1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set build command: `npm run build`
4. Set publish directory: `build`

## 📞 Support

For questions or issues:
- Check the README.md file
- Review the code comments
- Inspect the mock data in `src/data/mockData.js`

## 📜 License

This project is for educational purposes.

---

**Made with ❤️ for Songir Artisans**
