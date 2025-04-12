import { useEffect } from "react";

interface MetaTagOptions {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export const useMetaTags = (options: MetaTagOptions = {}) => {
  useEffect(() => {
    const defaultTitle = "EmployAbility.AI - Achieve your professional goals";
    const defaultDescription =
      "Be it learning a new skill or getting that dream job, we help accelerate your journey through the power of AI.";
    const defaultImage = "https://employability.ai/employabilityLogo.jpg";
    const defaultUrl = "https://employability.ai";

    const {
      title = defaultTitle,
      description = defaultDescription,
      image = defaultImage,
      url = defaultUrl,
      type = "website",
    } = options;

    document.title = title;

    const setMetaTag = (name: string, content: string) => {
      let tag = document.querySelector(`meta[${name}]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(name.split("=")[0], name.split("=")[1]);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    setMetaTag('property="og:title"', title);
    setMetaTag('property="og:description"', description);
    setMetaTag('property="og:image"', image);
    setMetaTag('property="og:url"', url);
    setMetaTag('property="og:type"', type);
    setMetaTag('property="og:site_name"', "EmployAbility.AI");

    setMetaTag('name="twitter:card"', "summary_large_image");
    setMetaTag('name="twitter:title"', title);
    setMetaTag('name="twitter:description"', description);
    setMetaTag('name="twitter:image"', image);

    setMetaTag('name="description"', description);
  }, [options]);
};
