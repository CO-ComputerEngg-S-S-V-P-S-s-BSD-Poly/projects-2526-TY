# Handcrafted Utensils Portal
🔶 **Songir Marketplace** - Traditional Brass & Copper Handicraft E-commerce Platform

## Description
Songir village in Dhule district is famous for its traditional handcrafted brass and copper utensils made by skilled local  artisans.These utensils are an important part of the region’s cultural and economic heritage.
However, most products are sold only through local markets, which limits their reach to nearby customers. To solve this problem,the Songir Handcrafted  Utensils Portal is developed. This platform allows multiple shopkeepers to showcase their utensils online, enabling customers to easily explore and compare products. The main objective of the system is to digitize the traditional utensil marketplace and connect local artisans with a wider customer base through a user-friendly online platform.

## Group Details
Group No: 07  
Members: 1. Kasar Jidnyasa Govind
         2. Pardeshi Nandini Jitendra
         3. Patil Jagruti Chandrakant 
         4. Sanyasi Tanu Kiran

## Tech Stack
    React.js
    Node.js/Express.js
    js/css
    Mongoose

## Project Structure

songir-react-project/
│
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
│
├── src/
│   │
│   ├── index.js
│   ├── App.js
│   ├── App.css
│   ├── index.css
│   │
│   ├── assets/
│   │   ├── images/
│   │   │   ├── artisans/
│   │   │   │   ├── artisan-crafting.png
│   │   │   │   └── artisans.jpg
│   │   │   ├── forts/
│   │   │   │   ├── Fort1.webp
│   │   │   │   ├── Fort2.jpg
│   │   │   │   └── Songirfort.jpeg
│   │   │   ├── products/
│   │   │   │   ├── bowls/
│   │   │   │   │   ├── bowl.webp.jpeg
│   │   │   │   │   └── bowl1.jpeg
│   │   │   │   ├── cookware/
│   │   │   │   │   ├── Cookware.jpeg
│   │   │   │   │   ├── Kadhai.jpeg
│   │   │   │   │   └── lota.jpeg
│   │   │   │   ├── puja/
│   │   │   │   │   ├── Pujathali.jpeg
│   │   │   │   │   ├── Ganesha.webp
│   │   │   │   │   ├── Kanha.webp
│   │   │   │   │   ├── Laxmi.webp
│   │   │   │   │   └── Saraswati.webp
│   │   │   │   ├── tea/
│   │   │   │   │   └── Teapan.jpeg
│   │   │   │   ├── designer/
│   │   │   │   │   └── designerglass.jpeg
│   │   │   │   ├── metal/
│   │   │   │   │   └── Coppertan.webp.jpeg
│   │   │   │   └── Bolebaba.webp
│   │   │   ├── shops/
│   │   │   │   ├── shop.jpg
│   │   │   │   └── Shopkeeper.jpeg
│   │   │   ├── icons/
│   │   │   │   └── (all icons)
│   │   │   └── barthcontainer.jpeg
│   │   │
│   │   ├── fonts/
│   │   └── videos/
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Layout.js
│   │   │   ├── Navbar.js
│   │   │   ├── Navbar.css
│   │   │   ├── Footer.js
│   │   │   ├── Footer.css
│   │   │   └── ProtectedRoute.js
│   │   │
│   │   ├── ui/
│   │   │   ├── ProductCard.js
│   │   │   ├── ShopCard.js
│   │   │   ├── ShopCard.css
│   │   │   ├── WishlistButton.js
│   │   │   ├── QuickViewModal.js
│   │   │   ├── FilterSidebar.js
│   │   │   ├── CartSidebar.js
│   │   │   ├── CartSidebar.css
│   │   │   ├── RecentlyViewedSection.js
│   │   │   ├── ShopProducts.css
│   │   │   └── ShopRating.js
│   │   │
│   │   ├── home/
│   │   │   ├── Home.js
│   │   │   ├── HeroSection.js
│   │   │   ├── HeroSection.css
│   │   │   ├── FeaturedShops.js
│   │   │   └── ExploreCategories.js
│   │   │
│   │   └── admin/
│   │       ├── AdminAllReviews.js
│   │       └── AddShop.js
│   │       └── AddShop.css
│   │
│   ├── pages/
│   │   ├── shop/
│   │   │   ├── ShopsPage.js
│   │   │   ├── Shops.js
│   │   │   ├── ShopDetailPage.js
│   │   │   ├── ShopPage.css
│   │   │   ├── shops.css
│   │   │   └── shopDetails.css
│   │   │
│   │   ├── product/
│   │   │   ├── ProductsPage.js
│   │   │   ├── Products.css
│   │   │   ├── ProductDetailPage.js
│   │   │   ├── ProductDetailPage.css
│   │   │   ├── ProductReviews.js
│   │   │   └── CategoryPage.js
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginPage.js
│   │   │   ├── Login.css
│   │   │   ├── Registration.js
│   │   │   ├── Registration.css
│   │   │   ├── Logout.js
│   │   │   └── Logout.css
│   │   │
│   │   ├── user/
│   │   │   ├── ProfilePage.js
│   │   │   ├── SettingsPage.js
│   │   │   ├── OrdersPage.js
│   │   │   └── WishlistPage.js
│   │   │   └── WishlistPage.css
│   │   │
│   │   ├── cart/
│   │   │   └── Cart.js
│   │   │   └── Cart.css
│   │   │
│   │   ├── static/
│   │   │   ├── AboutPage.js
│   │   │   ├── ContactPage.js
│   │   │   ├── contactus.css
│   │   │   ├── FAQPage.js
│   │   │   └── ComparePage.js
│   │   │   └── Comparison.css
│   │   │
│   │   ├── quote/
│   │   │   ├── QuotePage.js
│   │   │   ├── CustomQuote.css
│   │   │   └── Feedback.js
│   │   │   └── Feedback.css
│   │   │
│   │   └── feedback/
│   │       └── Feedback.js
│   │       └── Feedback.css
│   │
│   ├── context/
│   │   ├── AppContext.js
│   │   ├── AuthContext.js
│   │   ├── CartContext.js
│   │   └── WishlistContext.js
│   │
│   ├── data/
│   │   ├── mockData.js
│   │   ├── products.js
│   │   └── shopsData.js
│   │
│   ├── styles/
│   │   ├── global.css
│   │   ├── globalstyles.js
│   │   └── variables.css
│   │
│   ├── utils/
│   │   ├── Icons.js
│   │   ├── recentlyViewedUtils.js
│   │   ├── wishlistUtils.js
│   │   └── helpers.js
│   │
│   └── hooks/
│       ├── useAuth.js
│       ├── useCart.js
│       └── useWishlist.js
│
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
├── INSTALLATION.md
├── QUICKSTART.md
├── CONVERSION_NOTES.md
├── TODO.md
└── .env

## Features
### Customer Features
- Browse multiple Songir shopkeepers' products in one place
- Product details: photos, material, size, weight
- Shop-wise & price-wise comparison
- Get a Quote for custom or bulk orders
- Select best shopkeeper based on ratings
- Order confirmation & tracking
- Secure payment / order request
- Review & rating system

### Shopkeeper Features
- Shop profile creation
- Product upload with images & description
- Receive and respond to quote requests
- Set price & delivery time
- Accept/reject orders
- Update order status
- View customer feedback

### Admin Features
- Shopkeeper verification & approval
- User management
- Product & category management
- Order monitoring
- Review & complaint handling
- Website content control

## Color Theme
Traditional Copper–Brass Theme 🟤🟡

   copper:     '#B87333',
   copperDark: '#8B5A2B',
   copperLight:'#D4956A',
   brass:      '#C9A44C',
   cream:      '#FDF8F0',
   cream2:     '#FFF6E5',
   dark:       '#2A1408',
   text:       '#3E2723',
   muted:      '#8D6E63',  
   border:     '#EDE0D0',
   white:      '#FFFFFF',
   success:    '#2E7D32',
   danger:     '#C62828',
   soldout:    '#9E9E9E',

**Install Dependencies**

bash
npm install

**Run the Project**

bash
npm start

**commands**
cd songir-react-project
npm install
npm start