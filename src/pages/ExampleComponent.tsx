import React from 'react';

const ExampleComponent = () => {
  return (
    <div className="bg-background-grey p-6">
      {/* Typography */}
      <h1 className="text-title text-button mb-4">Welcome to Our Platform</h1>
      <h2 className="text-h1 text-grey-7 mb-3">About Us</h2>
      <p className="text-body1 text-grey-6 mb-6">
        We provide innovative solutions for your business needs.
      </p>

      {/* Buttons with different styles */}
      <div className="space-x-4">
        <button className="bg-primary-green text-button text-white px-4 py-2 rounded">
          Primary Action
        </button>
        <button className="bg-secondary-green text-button text-grey-7 px-4 py-2 rounded">
          Secondary Action
        </button>
      </div>

      {/* Card example */}
      <div className="mt-6 bg-white p-4 rounded shadow">
        <h3 className="text-sub-header text-grey-8 mb-2">Feature Highlight</h3>
        <p className="text-body2 text-grey-5">
          Explore our amazing features designed to help you succeed.
        </p>
      </div>

      {/* Responsive layout example */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-grey-1 p-4 rounded">
            <h4 className="text-sub-header text-grey-7">Card {item}</h4>
            <p className="text-body2 text-grey-5">Some content here</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExampleComponent;