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
    const entry = document.cookie.split(";").map(part => part.trim())
      .find(part => part.startsWith("googtrans=/fr/"));
    return entry ? decodeURIComponent(entry.slice("googtrans=/fr/".length)) : "fr";
  }

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

  window.googleTranslateElementInit = function () {
    if (!window.google || !window.google.translate) return;
    new window.google.translate.TranslateElement({
      pageLanguage: "fr",
      autoDisplay: false
    }, "google_translate_element");
  };

  function installSwitcher() {
    if (document.getElementById("cdc-language-switcher")) return;

    const actions = document.querySelector(".header-actions");
    if (!actions) return;

    const style = document.createElement("style");
    style.textContent = `
      .header-actions { position: relative; }
      #cdc-language-switcher { position: relative; display: flex; align-items: center; }
      #cdc-language-button {
        display: inline-flex; align-items: center; justify-content: center;
        width: 34px; height: 34px; padding: 6px; border: 0;
        background: transparent; color: inherit; cursor: pointer;
      }
      #cdc-language-button svg { width: 21px; height: 21px; display: block; }
      #cdc-language-menu {
        position: absolute; top: calc(100% + 12px); right: 0; z-index: 100001;
        width: min(260px, 78vw); padding: 12px; background: #fff;
        border: 1px solid #e9e1d6; box-shadow: 0 5px 18px rgba(45,35,25,.14);
      }
      #cdc-language-menu[hidden] { display: none; }
      #cdc-language-menu label {
        display: block; margin: 0 0 7px; color: #55483d;
        font: 11px Montserrat, Arial, sans-serif;
      }
      #cdc-language-select {
        box-sizing: border-box; width: 100%; padding: 10px;
        border: 1px solid #ded5c9; background: #fff; color: #40372f;
        font: 12px Montserrat, Arial, sans-serif;
      }
      #google_translate_element {
        position: absolute !important; left: -9999px !important;
        top: -9999px !important; width: 1px !important;
        height: 1px !important; overflow: hidden !important;
      }
      .goog-te-banner-frame, .skiptranslate iframe { display: none !important; }
      body { top: 0 !important; }
    `;
    document.head.appendChild(style);

    const box = document.createElement("div");
    box.id = "cdc-language-switcher";
    box.innerHTML = `
      <button id="cdc-language-button" type="button" aria-label="Changer la langue" title="Changer la langue" aria-expanded="false" aria-controls="cdc-language-menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9"></circle>
          <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"></path>
        </svg>
      </button>
      <div id="cdc-language-menu" hidden>
        <label for="cdc-language-select">Choisir une langue</label>
        <select id="cdc-language-select" aria-label="Choisir une langue"></select>
      </div>
    `;

    const button = box.querySelector("#cdc-language-button");
    const menu = box.querySelector("#cdc-language-menu");
    const select = box.querySelector("#cdc-language-select");

    button.addEventListener("click", () => {
      menu.hidden = !menu.hidden;
      button.setAttribute("aria-expanded", String(!menu.hidden));
    });

    document.addEventListener("click", event => {
      if (!box.contains(event.target)) {
        menu.hidden = true;
        button.setAttribute("aria-expanded", "false");
      }
    });

    function populateAllLanguages() {
      const googleSelect = document.querySelector(".goog-te-combo");
      if (!googleSelect || !googleSelect.options.length) return false;

      const selected = currentLanguage();
      select.replaceChildren();
      Array.from(googleSelect.options).forEach(option => {
        const code = option.value;
        if (!code) select.add(new Option("Français", "fr"));
        else select.add(new Option(languageLabel(code, option.textContent.trim()), code));
      });
      select.value = selected;
      if (!select.value) select.value = "fr";
      return true;
    }

    select.addEventListener("change", () => {
      changeLanguage(select.value);
      menu.hidden = true;
      button.setAttribute("aria-expanded", "false");
    });

    actions.appendChild(box);
    const translate = document.createElement("div");
    translate.id = "google_translate_element";
    document.body.appendChild(translate);

    let attempts = 0;
    const refreshLanguages = () => {
      if (populateAllLanguages() || attempts++ > 40) return;
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
