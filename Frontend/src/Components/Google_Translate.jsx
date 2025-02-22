import React, { useEffect, useState } from "react";

const Google_Translate = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!window.googleTranslateLoaded) {
      const addScript = document.createElement("script");
      addScript.setAttribute(
        "src",
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      );
      document.body.appendChild(addScript);

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,hi,ta,te,ml,bn,mr,gu,pa,kn",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );
      };

      window.googleTranslateLoaded = true; // Set global flag
      setIsInitialized(true);
    }
  }, []);

  return (
    <div
  id="google_translate_element"
  className="fixed top-2 right-40 z-20 bg-white px-4 py-2 rounded-lg shadow-md text-xs w-32 text-center"
 />

  );
};

export default Google_Translate;
