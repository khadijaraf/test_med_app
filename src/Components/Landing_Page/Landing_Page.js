import React, { useEffect } from "react"; // Importing the necessary modules from React library
import "./LandingPage.css"; // Importing the CSS styles for the Landing_Page component

// Defining the Function component Landing_Page
const Landing_Page = () => {
  useEffect(() => {
    // Initialize AOS or handle any animations here
    const heroElement = document.querySelector('.flex-hero');
    if (heroElement) {
      heroElement.style.opacity = '1';
      heroElement.style.transform = 'translateY(0)';
    }
  }, []);

  return (
    <section className="hero-section"> {/* Creating a section with class name 'hero-section' */}
      <div>
        <div className="flex-hero"> {/* Removed data-aos attribute for stability */}
            
            <h1>
              Your Health<br/>
              <span className="text-gradient">
                Our Responsibility
              </span>
            </h1>
              <div className="blob-cont"> {/* Creating a div with class name 'blob-cont' */}
                  <div className="blue blob"></div> {/* Creating a blue blob inside the 'blob-cont' div */}
              </div>
              <div className="blob-cont"> {/* Creating another div with class name 'blob-cont' */}
                  <div className="blue1 blob"></div> {/* Creating a different blue blob inside the second 'blob-cont' div */}
              </div>
            <h4>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eaque at quae ducimus. Suscipit omnis quibusdam non cum rem voluptatem!
            </h4>
            <a href="#services"> {/* Creating a hyperlink to jump to the 'services' section */}
              <button className="button">Get Started</button> {/* Creating a button with class name 'button' */}
            </a>
        </div>
      </div>
    </section>
  );
};

export default Landing_Page; // Exporting the Landing_Page component to be used in other parts of the application