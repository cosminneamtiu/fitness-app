// client/src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom'; // If you need links

function HomePage() {
  return (
    <div>
      <h1>Welcome to Your Fitness App!</h1>
      <p>Start your fitness journey today.</p>
      <p>
        Check out the available <Link to="/classes">Classes</Link>.
      </p>
      {/* Add more homepage content here */}
    </div>
  );
}

export default HomePage;