(() => {
  "use strict";

  const LANGUAGES = [
    ["fr", "Français"],
    ["en", "English"],
    ["es", "Español"],
    ["de", "Deutsch"],
    ["it", "Italiano"],
    ["pt", "Português"]
  ];

  function currentLanguage() {
    const match = document.cookie.match(/(?:^|;\\s*)googtrans=\\/fr\\/([^;]+)/);
    return match ? decodeURIComponent(match[1]) : "fr";
  }

  window.googleTranslateElementInit = function () {
    if (!window.google || !window.google.translate) return;
    new window.google.translate.TranslateElement({
      pageLanguage: "fr",
      includedLanguages: "en,es,de,it,pt",
      autoDisplay: false
    }, "google_translate_element");
  };

  function changeLanguage(language) {
    const combo = document.querySelector(".goog-te-combo");
    if (!combo) {
      const value = language === "fr" ? "/fr/fr" : "/fr/" + language;
      document.cookie = "googtrans=" + value + ";path=/";
      document.cookie = "googtrans=" + value + ";path=/;domain=" + location.hostname;
      location.reload();
      return;
    }
    combo.value = language === "fr" ? "" : language;
    combo.dispatchEvent(new Event("change"));
  }

  function installSwitcher() {
    if (document.getElementById("cdc-language-switcher")) return;

    const style = document.createElement("style");
    style.textContent = `
      #cdc-language-switcher {
        position: fixed;
        top: 10px;
        right: 12px;
        z-index: 100000;
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 9px;
        border: 1px solid #ded5c9;
        border-radius: 3px;
        background: rgba(255,255,255,.97);
        box-shadow: 0 2px 9px rgba(45,35,25,.08);
        color: #55483d;
        font: 11px Montserrat, Arial, sans-serif;
      }
      #cdc-language-switcher label { white-space: nowrap; }
      #cdc-language-switcher select {
        max-width: 112px;
        border: 0;
        outline: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        cursor: pointer;
      }
      #google_translate_element {
        position: absolute !important;
        left: -9999px !important;
        top: -9999px !important;
        width: 1px !important;
        height: 1px !important;
        overflow: hidden !important;
      }
      .goog-te-banner-frame, .skiptranslate iframe { display: none !important; }
      body { top: 0 !important; }
      @media (max-width: 600px) {
        #cdc-language-switcher { top: 7px; right: 7px; padding: 5px 7px; }
      }
    `;
    document.head.appendChild(style);

    const box = document.createElement("div");
    box.id = "cdc-language-switcher";
    box.innerHTML = '<label for="cdc-language-select">Langue</label><select id="cdc-language-select" aria-label="Changer la langue"></select>';

    const select = box.querySelector("select");
    LANGUAGES.forEach(([code, label]) => {
      const option = document.createElement("option");
      option.value = code;
      option.textContent = label;
      select.appendChild(option);
    });
    select.value = currentLanguage();
    select.addEventListener("change", () => changeLanguage(select.value));

    const translate = document.createElement("div");
    translate.id = "google_translate_element";
    document.body.append(box, translate);

    if (!document.querySelector('script[data-cdc-google-translate]')) {
      const script = document.createElement("script");
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.dataset.cdcGoogleTranslate = "true";
      document.head.appendChild(script);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installSwitcher, { once: true });
  } else {
    installSwitcher();
  }
})();