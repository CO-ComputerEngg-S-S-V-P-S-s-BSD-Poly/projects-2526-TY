import { createGlobalStyle } from 'styled-components';

const globalstyles = createGlobalStyle`
  :root {
    /* Enhanced Color Palette */
    --copper-brown: #8B4513;
    --brass-gold: #DAA520;
    --cream: #FFF8DC;
    --dark-brown: #2F1B14;
    --off-white: #FFFACD;
    --warm-orange: #FF8C00;
    --golden-yellow: #FFD700;
    --rich-brown: #8B4513;
    --light-cream: #F5F5DC;
    --accent-gold: #B8860B;
    --deep-brown: #654321;

    /* Interactive Colors */
    --hover-gold: #FFD700;
    --active-brown: #A0522D;
    --shadow-light: rgba(218, 165, 32, 0.1);
    --shadow-medium: rgba(139, 69, 19, 0.15);
    --shadow-dark: rgba(139, 69, 19, 0.25);

    /* Gradients */
    --gradient-primary: linear-gradient(135deg, var(--brass-gold) 0%, var(--warm-orange) 100%);
    --gradient-secondary: linear-gradient(135deg, var(--copper-brown) 0%, var(--rich-brown) 100%);
    --gradient-background: linear-gradient(180deg, var(--cream) 0%, var(--light-cream) 100%);
    --gradient-card: linear-gradient(145deg, var(--off-white) 0%, var(--cream) 100%);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', sans-serif;
    background: var(--gradient-background);
    color: var(--dark-brown);
    line-height: 1.6;
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Playfair Display', serif;
    font-weight: 600;
    line-height: 1.2;
  }

  a {
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease;
  }

  button {
    cursor: pointer;
    border: none;
    font-family: inherit;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  button:hover::before {
    left: 100%;
  }

  .container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  /* Enhanced Animations */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: calc(200px + 100%) 0;
    }
  }

  /* Utility Classes */
  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out;
  }

  .animate-fade-in {
    animation: fadeIn 0.8s ease-out;
  }

  .animate-slide-in-left {
    animation: slideInLeft 0.6s ease-out;
  }

  .animate-slide-in-right {
    animation: slideInRight 0.6s ease-out;
  }

  .animate-pulse {
    animation: pulse 2s infinite;
  }

  .shimmer {
    background: linear-gradient(90deg, transparent, rgba(218, 165, 32, 0.1), transparent);
    background-size: 200px 100%;
    animation: shimmer 2s infinite;
  }

  /* Enhanced Hover Effects */
  .hover-lift {
    transition: all 0.3s ease;
  }

  .hover-lift:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px var(--shadow-medium);
  }

  .hover-glow {
    transition: all 0.3s ease;
  }

  .hover-glow:hover {
    box-shadow: 0 0 30px var(--shadow-light);
  }

  /* Scrollbar Styling */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--light-cream);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--brass-gold);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--accent-gold);
  }

  /* Selection Styling */
  ::selection {
    background: var(--brass-gold);
    color: var(--dark-brown);
  }

  /* Focus Styles */
  *:focus {
    outline: 2px solid var(--brass-gold);
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    .container {
      padding: 0 1rem;
    }

    h1 {
      font-size: 2rem;
    }

    h2 {
      font-size: 1.8rem;
    }

    h3 {
      font-size: 1.5rem;
    }
  }
`;

export default globalstyles;

