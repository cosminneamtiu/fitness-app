import React from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import './HomePage.css';

// Import your images
import personalizedWorkoutImage from '../assets/personalised_workout.jpg';
import expertInstructorImage from '../assets/expert_instructor.jpg';
import nutritionImage from '../assets/nutrition.jpg';
import communityImage from '../assets/community.jpg';
import heroImage from '../assets/hero_image.jpg';

function HomePage() {
  // Settings for testimonial slider
  const testimonialSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  // New settings for stats horizontal slider
  const statsSliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <section className="hero-section">
      <img src={heroImage} alt="Fitness Hero" className="hero-image" />
        <div className="hero-content">
          <h1 className="homepage-title">Transform Your Fitness Journey</h1>
          <p className="homepage-description">
            Join thousands of members achieving their health goals with our personalized
            approach
          </p>
          <div className="hero-buttons">
            <Link to="/classes" className="button secondary-button">
              Browse Classes
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section as Horizontal Slider */}
      <section className="stats-section-slider">
        <h2 className="section-title">Our Impact</h2>
        <Slider {...statsSliderSettings}>
          <div className="stat-slide">
            <h3>10,000+</h3>
            <p>Active Members</p>
          </div>
          <div className="stat-slide">
            <h3>50+</h3>
            <p>Expert Trainers</p>
          </div>
          <div className="stat-slide">
            <h3>100+</h3>
            <p>Workout Classes</p>
          </div>
          <div className="stat-slide">
            <h3>24/7</h3>
            <p>Support Available</p>
          </div>
        </Slider>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose Us</h2>
        <p className="section-subtitle">We provide everything you need to reach your fitness goals</p>

        <div className="homepage-features">
          <div className="feature-card">
            <img
              src={personalizedWorkoutImage}
              alt="Person doing a personalized workout"
              className="feature-card-image"
            />
            <h2>Personalized Workouts</h2>
            <p>Access custom workout plans tailored to your goals and fitness level.</p>
          </div>
          <div className="feature-card">
            <img
              src={expertInstructorImage}
              alt="Expert fitness instructor"
              className="feature-card-image"
            />
            <h2>Expert Instructors</h2>
            <p>Train with certified professionals who guide you every step of the way.</p>
          </div>
          <div className="feature-card">
            <img src={nutritionImage} alt="Healthy nutrition" className="feature-card-image" />
            <h2>Nutrition Plans</h2>
            <p>Complement your workouts with customized meal plans from our nutritionists.</p>
          </div>
          <div className="feature-card">
            <img src={communityImage} alt="Fitness community" className="feature-card-image" />
            <h2>Supportive Community</h2>
            <p>Connect with like-minded people to stay motivated and accountable.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2 className="section-title">Success Stories</h2>
        <p className="section-subtitle">Hear from our members</p>

        <div className="testimonials-slider">
          <Slider {...testimonialSettings}>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p className="testimonial-text">
                  "I lost 20 pounds in 3 months thanks to the personalized training and nutrition
                  plans! The trainers were incredibly supportive throughout my journey."
                </p>
                <div className="testimonial-author">
                  <strong>Sarah J.</strong>
                  <span>Member since 2022</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p className="testimonial-text">
                  "The community support kept me motivated when I wanted to quit. Best fitness
                  decision ever! I've never felt better in my life."
                </p>
                <div className="testimonial-author">
                  <strong>Mike T.</strong>
                  <span>Member since 2021</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p className="testimonial-text">
                  "As a busy professional, the flexible class schedule and mobile app made it
                  possible for me to stay consistent with my workouts."
                </p>
                <div className="testimonial-author">
                  <strong>Alexandra K.</strong>
                  <span>Member since 2023</span>
                </div>
              </div>
            </div>
          </Slider>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
