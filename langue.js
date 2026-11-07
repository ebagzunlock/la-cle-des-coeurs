(() => {
  "use strict";

  const LANGUAGE_NAMES = new Intl.DisplayNames(["fr"], { type: "language" });

  function languageLabel(code, googleLabel) {
    try {
      const nativeName = new Intl.DisplayNames([code], { type: "language" }).of(code);
      const frenchName = LANGUAGE_NAMES.of(code);
      return nativeName && frenchName && nativeName.toLowerCase() !== frenchName.toLowerCase()
        ? nativeName + " — " + frenchName
        : (googleLabel || frenchName || code);
    } catch {
      return googleLabel || code;
    }
  }

  function currentLanguage() {
    const cookie = document.cookie.split(";").map(part => part.trim());
    const entry = cookie.find(part => part.startsWith("googtrans=/fr/"));
    return entry ? decodeURIComponent(entry.slice("googtrans=/fr/".length)) : "fr";
  }
  window.googleTranslateElementInit = function () {
    if (!window.google || !window.google.translate) return;
    new window.google.translate.TranslateElement({
      pageLanguage: "fr",
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
    function populateAllLanguages() {
      const googleSelect = document.querySelector(".goog-te-combo");
      if (!googleSelect || !googleSelect.options.length) return false;

      const selected = currentLanguage();
      select.replaceChildren();
      Array.from(googleSelect.options).forEach(option => {
        const code = option.value;
        if (!code) {
          select.add(new Option("Français", "fr"));
          return;
        }
        select.add(new Option(languageLabel(code, option.textContent.trim()), code));
      });
      select.value = selected;
      if (!select.value) select.value = "fr";
      return true;
    }

    select.addEventListener("change", () => changeLanguage(select.value));

    const translate = document.createElement("div");
    translate.id = "google_translate_element";
    document.body.append(box, translate);

    const refreshLanguages = () => {
      if (populateAllLanguages()) return;
      window.setTimeout(refreshLanguages, 400);
    };
    const previousInit = window.googleTranslateElementInit;
    window.googleTranslateElementInit = function () {
      if (typeof previousInit === "function") previousInit();
      refreshLanguages();
    };

    if (!document.querySelector('script[data-cdc-google-translate]')) {
      const script = document.createElement("script");
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.dataset.cdcGoogleTranslate = "true";
      document.head.appendChild(script);
    }
    refreshLanguages();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installSwitcher, { once: true });
  } else {
    installSwitcher();
  }
})();