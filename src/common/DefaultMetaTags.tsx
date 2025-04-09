import React from "react";
import { Helmet } from "react-helmet-async";

// Default Meta Tags Component
export const DefaultMetaTags: React.FC = () => {
  const defaultOgTitle = "EmployAbility.AI - Achieve your professional goals";
  const defaultOgDescription =
    "Be it learning a new skill or getting that dream job, we help accelerate your journey through the power of AI.";
  const defaultImage = "https://employability.ai/employabilityLogo.jpg";
  const defaultUrl = "https://employability.ai";

  return (
    <Helmet
      defaultTitle="EmployAbility.AI"
      titleTemplate="%s | EmployAbility.AI"
    >
      {/* Open Graph / WhatsApp meta tags */}
      <meta
        property="og:title"
        content={defaultOgTitle}
        data-react-helmet="true"
      />
      <meta
        property="og:description"
        content={defaultOgDescription}
        data-react-helmet="true"
      />
      <meta
        property="og:image"
        content={defaultImage}
        data-react-helmet="true"
      />
      <meta property="og:url" content={defaultUrl} data-react-helmet="true" />
      <meta property="og:type" content="website" data-react-helmet="true" />
      <meta
        property="og:site_name"
        content="EmployAbility.AI"
        data-react-helmet="true"
      />

      {/* Twitter Card tags */}
      <meta
        name="twitter:card"
        content="summary_large_image"
        data-react-helmet="true"
      />
      <meta
        name="twitter:title"
        content={defaultOgTitle}
        data-react-helmet="true"
      />
      <meta
        name="twitter:description"
        content={defaultOgDescription}
        data-react-helmet="true"
      />
      <meta
        name="twitter:image"
        content={defaultImage}
        data-react-helmet="true"
      />
    </Helmet>
  );
};
