import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col p-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#0AD472]">EmployAbility AI Privacy Policy</h1>
        <p className="text-sm text-gray-600 mt-1">Last Updated: February 28, 2025</p>
      </header>

      <main className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Introduction</h2>
          <p className="text-gray-700">
            Welcome to EmployAbility Ai (“we”, “our”, “us”). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application. By accessing or using EmployAbility Ai, you agree to this policy.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Information We Collect</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>
              <strong>Personal Information:</strong> We collect data such as your name, email address, government IDs, and educational and work experience documents when you sign up or use our services.
            </li>
            <li>
              <strong>Usage Data:</strong> We automatically gather information about your interactions with our platform, including IP addresses, browser type, and pages visited.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">How We Use Your Information</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>To provide and maintain our service.</li>
            <li>To personalize and improve our platform.</li>
            <li>To process transactions and send related information.</li>
            <li>To communicate updates, offers, and service-related announcements.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Disclosure of Your Information</h2>
          <p className="text-gray-700">
            We may share your information with trusted third-party service providers who help us operate our platform or process data on our behalf. These providers are contractually obligated to keep your information confidential and secure.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Cookies and Tracking Technologies</h2>
          <p className="text-gray-700">
            EmployAbility Ai uses cookies and similar tracking technologies to track activity on our platform and store certain information. You can instruct your browser to refuse cookies or notify you when a cookie is being sent.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Data Security</h2>
          <p className="text-gray-700">
            We implement administrative, technical, and physical security measures to safeguard your personal information. However, no method of transmission over the internet or electronic storage is 100% secure.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your Rights</h2>
          <p className="text-gray-700">
            You have the right to access, update, or delete your personal information. You may also object to or request the restriction of processing your data. To exercise these rights, please contact our support team.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Changes to This Privacy Policy</h2>
          <p className="text-gray-700">
            We may update this Privacy Policy from time to time. All changes will be posted on this page with an updated revision date. Please review this policy periodically for any updates.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Contact Us</h2>
          <p className="text-gray-700 mb-2">
            If you have any questions or concerns regarding this Privacy Policy or our data practices, please reach out to us:
          </p>
          <address className="not-italic text-gray-700">
            EmployAbility Ai<br />
            Central Revenue Layout, No 26, 6th Main Road,<br />
            Post, S R K Nagar, RK Hegde Nagar,<br />
            Bengaluru, Karnataka 560077<br />
            Email: support@employabilityai.com
          </address>
        </section>

        <div className="text-center mt-8">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-[#0AD472] text-white font-medium rounded-lg hover:bg-[#089c59] transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </main>

      <footer className="text-center mt-8">
        <p className="text-gray-600">&copy; 2025 EmployAbility Ai. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
