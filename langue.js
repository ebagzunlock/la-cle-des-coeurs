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


  function installGlobalNavigation() {
    const header = document.querySelector(".header");
    const nav = document.querySelector(".main-nav");
    if (!header || !nav) return;

    let button = document.getElementById("menuButton");
    if (!button) {
      button = document.createElement("button");
      button.className = "menu-button";
      button.id = "menuButton";
      button.type = "button";
      button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
      button.setAttribute("aria-label", "Ouvrir les catégories");
      const brand = header.querySelector(".brand");
      const emptySlot = header.firstElementChild;
      if (emptySlot && emptySlot.tagName === "DIV" && !emptySlot.textContent.trim()) {
        emptySlot.replaceWith(button);
      } else {
        header.insertBefore(button, brand || header.firstChild);
      }
    }

    nav.id = "mainNav";
    nav.setAttribute("aria-label", "Navigation principale");
    // Icônes vectorielles sobres pour le compte, les favoris et le panier.
    header.querySelectorAll(".header-actions a").forEach(link => {
      const href = link.getAttribute("href") || "";
      if (href.includes("compte")) link.setAttribute("aria-label", "Créer un compte ou se connecter");
      if (href.includes("favoris")) { link.setAttribute("aria-label", "Mes favoris"); link.setAttribute("title", "Mes favoris"); }
      if (href.includes("panier")) { link.setAttribute("aria-label", "Mon panier"); link.setAttribute("title", "Mon panier"); }
      let icon = "";
      if (href.includes("compte")) {
        icon = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.2"/><path d="M5.5 20c.7-3.4 3-5.2 6.5-5.2s5.8 1.8 6.5 5.2"/></svg>';
      } else if (href.includes("favoris")) {
        icon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.4 8.8c0 4.2-8.4 10-8.4 10S3.6 13 3.6 8.8A4.3 4.3 0 0 1 12 6.5a4.3 4.3 0 0 1 8.4 2.3Z"/></svg>';
      } else if (href.includes("panier")) {
        icon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 4.5h2l2.1 10.2a1.8 1.8 0 0 0 1.8 1.5h8.8a1.8 1.8 0 0 0 1.8-1.4L22 8H6"/><circle cx="10" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>';
      }
      if (icon) {
        const count = link.querySelector("#cartCount");
        link.innerHTML = icon + (count ? count.outerHTML : "");
      }
    });

    if (button && !button.querySelector("svg")) {
      button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
    }

    nav.innerHTML = `
      <a href="index.html">Accueil</a>
      <a href="catalogue.html?categorie=accessoires">Accessoires et bracelets</a>
      <a href="catalogue.html?categorie=ap-swatch">AP x Swatch</a>
      <a href="catalogue.html?categorie=femme">Montres femme</a>
      <a href="catalogue.html?categorie=homme">Montres homme</a>
      <a href="qui-sommes-nous.html">Qui sommes-nous</a>
      <a href="contact.html">Contact</a>
    `;

    // Repérer visuellement la rubrique et l'icône correspondant à la page ouverte.
    const currentFile = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    const params = new URLSearchParams(location.search);
    const currentCategory = (params.get("categorie") || "").toLowerCase();
    nav.querySelectorAll("a").forEach(link => {
      const url = new URL(link.href, location.href);
      const targetFile = (url.pathname.split("/").pop() || "index.html").toLowerCase();
      const targetCategory = (url.searchParams.get("categorie") || "").toLowerCase();
      const active = targetFile === currentFile &&
        (!targetCategory || !currentCategory || targetCategory === currentCategory);
      if (active) link.setAttribute("aria-current", "page");
    });
    header.querySelectorAll(".header-actions a").forEach(link => {
      const targetFile = (new URL(link.href, location.href).pathname.split("/").pop() || "").toLowerCase();
      if (targetFile && targetFile === currentFile) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    const searchForm = header.querySelector(".header-search-form");
    if (searchForm && (currentFile === "catalogue.html" && (params.has("recherche") || params.has("q")))) {
      searchForm.setAttribute("aria-current", "page");
    } else if (searchForm) searchForm.removeAttribute("aria-current");

    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", "mainNav");

    if (!document.getElementById("cdc-global-navigation-style")) {
      const style = document.createElement("style");
      style.id = "cdc-global-navigation-style";
      style.textContent = `
        /* En-tête commun : menu gauche, logo centré, actions droite. */
html body header.header{display:grid!important;grid-template-columns:minmax(0,1fr) max-content minmax(0,1fr)!important;align-items:center!important;justify-content:stretch!important;column-gap:8px!important;box-sizing:border-box!important;width:100%!important;padding-left:clamp(6px,2vw,24px)!important;padding-right:clamp(6px,2vw,24px)!important}
html body header.header>.menu-button,html body header.header>#menuButton{grid-column:1!important;justify-self:start!important;position:static!important;transform:none!important;z-index:4!important}
html body header.header>.brand,html body header.header>.brand-home-link{grid-column:2!important;justify-self:center!important;align-self:center!important;position:static!important;left:auto!important;right:auto!important;transform:none!important;margin:0!important;width:max-content!important;max-width:100%!important;min-width:0!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;text-align:center!important;white-space:nowrap!important;z-index:2!important}
html body header.header>.header-actions{grid-column:3!important;justify-self:end!important;align-self:center!important;position:static!important;transform:none!important;display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;align-items:center!important;justify-content:flex-end!important;gap:clamp(1px,.45vw,8px)!important;width:max-content!important;min-width:0!important;max-width:100%!important;margin:0!important;white-space:nowrap!important;z-index:5!important}
html body header.header>.header-actions>a,html body header.header #cdc-language-switcher,html body header.header #cdc-language-button{flex:0 0 22px!important;width:22px!important;min-width:22px!important;max-width:22px!important;box-sizing:border-box!important}
html body header.header>.header-actions svg,html body header.header #cdc-language-button svg{width:16px!important;height:16px!important}
@media(max-width:700px){html body header.header{grid-template-columns:minmax(0,1fr) max-content minmax(0,1fr)!important;min-height:88px!important;column-gap:3px!important;padding:6px 5px!important}html body header.header .brand-monogram{width:39px!important;height:39px!important;min-width:39px!important;min-height:39px!important;flex-basis:39px!important}html body header.header .brand-name{font-size:clamp(7px,2.35vw,10px)!important;letter-spacing:0!important}html body header.header .brand-tagline{font-size:4px!important;letter-spacing:.25px!important}html body header.header>.header-actions{gap:0!important}html body header.header>.header-actions>a,html body header.header #cdc-language-switcher,html body header.header #cdc-language-button{flex-basis:20px!important;width:20px!important;min-width:20px!important;max-width:20px!important}html body header.header>.menu-button,html body header.header>#menuButton{width:23px!important;min-width:23px!important}}
@media(max-width:360px){html body header.header{column-gap:1px!important;padding-left:3px!important;padding-right:3px!important}html body header.header>.header-actions>a,html body header.header #cdc-language-switcher,html body header.header #cdc-language-button{flex-basis:18px!important;width:18px!important;min-width:18px!important;max-width:18px!important}html body header.header .brand-name{font-size:7px!important}html body header.header .brand-tagline{font-size:3.6px!important}}
        .header { grid-template-columns: 1fr 2fr 1fr; }
        .menu-button {
          display: inline-flex !important; justify-self: start; align-items: center;
          justify-content: center; width: 42px; height: 42px; border: 0;
          background: rgba(239,232,221,.28); color: #493b31; font-size: 20px; cursor: pointer; border: 1px solid rgba(91,72,54,.22); border-radius: 50%;
        }
        .main-nav { display: none !important; }
        .main-nav.is-open {
          display: flex !important; flex-direction: row; justify-content: center;
          align-items: center; flex-wrap: wrap; gap: 22px; padding: 15px 3%;
        }
        @media (max-width: 700px) {
          .header {
            position: relative !important;
            display: grid !important;
            grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) !important;
            align-items: center !important;
            justify-content: initial !important;
            column-gap: 6px !important;
            min-height: 88px !important;
            padding: 6px 7px !important;
            box-sizing: border-box !important;
          }
          .header > .menu-button, .header > #menuButton {
            grid-column: 1 !important;
            justify-self: start !important;
            flex: none !important;
            width: 23px !important; min-width: 23px !important;
            height: 30px !important;
            z-index: 2 !important;
          }
          .header > .brand, .header > .brand-home-link {
            position: static !important;
            grid-column: 2 !important;
            justify-self: center !important;
            align-self: center !important;
            transform: none !important;
            width: max-content !important;
            max-width: 100% !important;
            min-width: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 0 !important;
            margin: 0 !important;
            text-align: center !important;
            white-space: nowrap !important;
            z-index: 1 !important;
          }
          .header > .brand .brand-monogram { display: flex !important; }
          .header > .brand .brand-tagline { display: block !important; }
          .header > .brand .brand-name {
            font-size: clamp(8px, 2.7vw, 11px) !important;
            letter-spacing: .15px !important;
            white-space: nowrap !important;
          }
          .header > .brand .brand-tagline {
            font-size: 5px !important;
            letter-spacing: .55px !important;
          }
          .header-actions {
            grid-column: 3 !important;
            justify-self: end !important;
            display: flex !important;
            flex: 0 0 auto !important;
            min-width: 0 !important;
            flex-wrap: nowrap !important;
            align-items: center !important;
            justify-content: flex-end !important;
            gap: 2px !important;
            margin: 0 !important;
            position: relative !important;
            z-index: 3 !important;
          }
          .header-actions a, #cdc-language-button, #cdc-language-switcher {
            flex: 0 0 22px !important;
            width: 22px !important; min-width: 22px !important;
            max-width: 22px !important;
            height: 28px !important; min-height: 22px !important;
            padding: 0 !important; box-sizing: border-box !important;
            display: inline-flex !important;
            align-items: center !important; justify-content: center !important;
          }
          .header-actions a svg, #cdc-language-button svg { width: 15px !important; height: 15px !important; }
          #cdc-language-switcher { flex: 0 0 28px !important; width: 28px !important; margin: 0 !important; }
          .main-nav.is-open {
            flex-direction: column; align-items: stretch; gap: 0; padding: 5px 20px;
          }
        }
      `;
      document.head.appendChild(style);
    }

    // La page d’accueil marque son gestionnaire dédié avec data-cdc-menu-ready.
    if (button.dataset.cdcMenuReady !== "true") {
      button.dataset.cdcMenuReady = "true";
      if (!/index\.html$/i.test(location.pathname)) {
        button.addEventListener("click", () => {
          const opened = nav.classList.toggle("is-open");
          button.setAttribute("aria-expanded", String(opened));
          button.setAttribute("aria-label", opened ? "Fermer les catégories" : "Ouvrir les catégories");
          button.innerHTML = opened ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>' : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
        });
      }
      nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-label", "Ouvrir les catégories");
        button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
      }));
    }
  }

  function installCartToast() {
    window.cdcToast = function(message) {
      let toast = document.getElementById("cdc-toast");
      if (!toast) {
        toast = document.createElement("div");
        toast.id = "cdc-toast";
        toast.setAttribute("role", "status");
        toast.setAttribute("aria-live", "polite");
        toast.innerHTML = '<span class="cdc-toast-check" aria-hidden="true">✓</span><span class="cdc-toast-message"></span>';
        document.body.appendChild(toast);
      }
      toast.querySelector(".cdc-toast-message").textContent = message || "Produit ajouté au panier";
      toast.classList.remove("is-visible");
      void toast.offsetWidth;
      toast.classList.add("is-visible");
      window.clearTimeout(window.__cdcToastTimer);
      window.__cdcToastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
    };

    const nativeAlert = window.alert.bind(window);
    window.alert = function(message) {
      if (/ajouté au panier/i.test(String(message))) {
        window.cdcToast("Produit ajouté au panier");
        return;
      }
      nativeAlert(message);
    };

    // Convertit aussi les éventuelles fenêtres de confirmation personnalisées du site.
    const observer = new MutationObserver(() => {
      document.querySelectorAll('[role="dialog"], .modal, .swal2-popup, .toast, .notification').forEach(el => {
        if (!/produit ajouté au panier/i.test(el.textContent || "")) return;
        const close = el.querySelector('button[aria-label*="fermer" i], button[title*="fermer" i], .close, .btn-close');
        if (close) close.remove();
        el.remove();
        window.cdcToast("Produit ajouté au panier");
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    if (!document.getElementById("cdc-toast-style")) {
      const style = document.createElement("style");
      style.id = "cdc-toast-style";
      style.textContent = `
        #cdc-toast {
          position: fixed; left: 50%; bottom: 28px; z-index: 100005;
          display: flex; align-items: center; gap: 11px;
          min-width: 230px; max-width: calc(100vw - 32px);
          box-sizing: border-box; padding: 14px 20px;
          border: 1px solid rgba(255,255,255,.16); border-radius: 9px;
          background: #25221f; color: #fff;
          box-shadow: 0 10px 32px rgba(0,0,0,.22);
          font: 500 13px Manrope, "Helvetica Neue", Arial, sans-serif; letter-spacing: .2px;
          opacity: 0; visibility: hidden; pointer-events: none;
          transform: translate(-50%, 14px);
          transition: opacity .24s ease, transform .24s ease, visibility .24s;
        }
        #cdc-toast.is-visible {
          opacity: 1; visibility: visible; transform: translate(-50%, 0);
        }
        #cdc-toast .cdc-toast-check {
          display: inline-flex; flex: 0 0 22px; width: 22px; height: 22px;
          align-items: center; justify-content: center; border-radius: 50%;
          background: #d8c3a0; color: #25221f; font-size: 13px; font-weight: 700;
        }
      `;
      document.head.appendChild(style);
    }
  }

  function installWhiteBackgroundCleanup() {
    const isNearWhite = value => {
      const match = String(value || "").match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
      return !!match && Number(match[1]) >= 238 && Number(match[2]) >= 238 && Number(match[3]) >= 238;
    };
    const paint = root => {
      if (!root || !root.querySelectorAll) return;
      const elements = [];
      if (root.nodeType === 1) elements.push(root);
      elements.push(...root.querySelectorAll("*"));
      elements.forEach(el => {
        if (/^(SCRIPT|STYLE|LINK|META|SVG|PATH|NOSCRIPT)$/.test(el.tagName)) return;
        const style = getComputedStyle(el);
        if (isNearWhite(style.backgroundColor)) {
          el.style.setProperty("background-color", "#ded6cb", "important");
          el.style.setProperty("border-color", "#c4b8a9", "important");
          el.setAttribute("data-cdc-no-white-bg", "true");
        }
        if (isNearWhite(style.color) && el.tagName !== "BUTTON" && !el.closest(".cdc-global-footer,.header,.announcement,.primary-button,.cart-checkout,.checkout-button")) {
          el.style.setProperty("color", "#403831", "important");
        }
      });
    };
    const run = () => paint(document.documentElement);
    run();
    window.addEventListener("load", run, { once: true });
    const observer = new MutationObserver(records => {
      records.forEach(record => record.addedNodes.forEach(node => {
        if (node.nodeType === 1) paint(node);
      }));
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function installGlobalCountBadges() {
    const readArray = key => { try { const value = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(value) ? value : []; } catch { return []; } };
    const refresh = () => {
      const favoriteCount = readArray('cdc_favorites').length;
      const cartCount = readArray('cdc_cart').reduce((sum,item) => sum + Math.max(0,Number(item.quantity)||1),0);
      document.querySelectorAll('.header-actions a').forEach(link => {
        const href=(link.getAttribute('href')||'').toLowerCase();
        const type=href.includes('favoris')?'favorites':href.includes('panier')?'cart':'';
        if(!type)return;
        let badge=link.querySelector('.cdc-count-badge');
        if(!badge){badge=document.createElement('span');badge.className='cdc-count-badge';link.appendChild(badge);}
        const count=type==='favorites'?favoriteCount:cartCount;
        badge.textContent=count>99?'99+':String(count);badge.hidden=count<1;
        link.setAttribute('data-count',String(count));
        link.setAttribute('aria-label',(type==='favorites'?'Mes favoris':'Mon panier')+' ('+count+')');
      });
    };
    if(!window.__cdcStorageCounterHook){
      window.__cdcStorageCounterHook=true;
      const originalSet=Storage.prototype.setItem;
      Storage.prototype.setItem=function(key,value){const result=originalSet.call(this,key,value);if(key==='cdc_cart'||key==='cdc_favorites')window.dispatchEvent(new Event('cdc:counts-changed'));return result;};
      const originalRemove=Storage.prototype.removeItem;
      Storage.prototype.removeItem=function(key){const result=originalRemove.call(this,key);if(key==='cdc_cart'||key==='cdc_favorites')window.dispatchEvent(new Event('cdc:counts-changed'));return result;};
    }
    window.addEventListener('cdc:counts-changed',refresh);window.addEventListener('storage',refresh);window.addEventListener('pageshow',refresh);window.addEventListener('focus',refresh);refresh();
  }
  function installGlobalFooter() {
    const oldFooters = Array.from(document.querySelectorAll("footer"));
    let footer = oldFooters.find(item => item.classList.contains("footer")) || oldFooters[0];
    if (!footer) { footer = document.createElement("footer"); document.body.appendChild(footer); }
    oldFooters.forEach(item => { if (item !== footer) item.remove(); });
    footer.className = "footer cdc-global-footer";
    footer.innerHTML = `
      <div class="footer-brand">
        <a class="cdc-footer-home" href="index.html" aria-label="LA CLÉ DES CŒURS — Retour à l’accueil">
          <span class="brand-monogram" aria-label="CDC"><span class="brand-initials">CDC</span></span>
          <h3>LA CLÉ DES CŒURS</h3>
          <p>BIJOUX FINS &amp; RAFFINÉS</p>
        </a>
      </div>
      <div class="footer-column">
        <h4>LA BOUTIQUE</h4>
        <a href="index.html">Accueil</a>
        <a href="catalogue.html">Tous les produits</a>
        <a href="favoris.html">Mes favoris</a>
        <a href="panier.html">Mon panier</a>
        <a href="qui-sommes-nous.html">Qui sommes-nous</a>
        <a href="contact.html">Contact</a>
      </div>
      <div class="footer-column">
        <h4>INFORMATIONS</h4>
        <a href="compte.html">Ma commande</a>
        <a href="livraison-retours.html">Livraison et retours</a>
        <a href="conditions-generales.html">Conditions générales de vente</a>
        <a href="mentions-legales.html">Mentions légales</a>
        <a href="confidentialite.html">Politique de confidentialité</a>
      </div>
      <div class="footer-bottom">
        © <span class="cdc-current-year"></span> LA CLÉ DES CŒURS. Tous droits réservés.
      </div>
    `;

    footer.querySelector(".cdc-current-year").textContent = new Date().getFullYear();

    if (!document.getElementById("cdc-global-footer-style")) {
      const style = document.createElement("style");
      style.id = "cdc-global-footer-style";
      style.textContent = `
        .cdc-global-footer { margin-top: 64px; }
        .cdc-global-footer .footer-brand a {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 0; color: inherit; text-decoration: none; text-align: center;
        }
        .cdc-global-footer .footer-brand a:hover { opacity: .82; }
        .cdc-global-footer .footer-brand .brand-monogram {
          display: inline-flex; align-items: center; justify-content: center;
          flex: 0 0 46px; width: 46px; height: 46px; min-width: 46px; min-height: 46px;
          margin: 0 auto 9px; border: 1px solid #c7aa7b; border-radius: 50%;
          outline: 1px solid rgba(199,170,123,.42); outline-offset: 3px;
          background: radial-gradient(circle at 35% 25%,#665344,#302820 78%);
          color: #ead7b5; box-shadow: 0 2px 9px rgba(48,40,32,.13),inset 0 0 0 2px rgba(199,170,123,.12);
        }
        .cdc-global-footer .footer-brand .brand-initials {
          display:block; color:#ead7b5; font:600 11px/1 Montserrat,Arial,sans-serif; letter-spacing:1px;
        }
        .cdc-global-footer .footer-brand h3 {
          margin: 0; color:#302820; font:600 17px/1.15 "Cormorant Garamond",Georgia,serif;
          letter-spacing:1.1px; text-align:center;
        }
        .cdc-global-footer .footer-brand p {
          margin: 4px 0 0; color:#514238; font:7px/1.3 Montserrat,Arial,sans-serif;
          letter-spacing:1.5px; text-align:center;
        }
        .cdc-global-footer .footer-column a { cursor: pointer; }
        .cdc-global-footer{position:relative!important;display:grid!important;grid-template-columns:1.4fr 1fr 1.5fr!important;gap:32px!important;padding:58px 7% 24px!important;background:linear-gradient(125deg,#29231f,#40352e)!important;color:#eee4d6!important;border-top:1px solid #b69a70!important}
        .cdc-global-footer .footer-brand{display:flex!important;align-items:flex-start!important;justify-content:center!important}
        .cdc-global-footer .footer-brand a{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;text-align:center!important;text-decoration:none!important}
        .cdc-global-footer .footer-brand .brand-monogram{width:48px!important;height:48px!important;min-width:48px!important;min-height:48px!important;flex:0 0 48px!important;margin:0 auto 8px!important;border:1px solid #c7aa7b!important;border-radius:50%!important;outline:1px solid rgba(199,170,123,.42)!important;outline-offset:3px!important;background:radial-gradient(circle at 35% 25%,#665344,#302820 78%)!important;color:#ead7b5!important}
        .cdc-global-footer .footer-brand .brand-initials{display:block!important;color:#ead7b5!important;font:600 11px/1 Montserrat,Arial,sans-serif!important;letter-spacing:1px!important}
        .cdc-global-footer .footer-brand h3{display:block!important;margin:0!important;color:#f0e5d2!important;font:600 17px/1.15 'Cormorant Garamond',Georgia,serif!important;letter-spacing:1.1px!important;text-align:center!important;white-space:nowrap!important}
        .cdc-global-footer .footer-brand p{display:block!important;margin:4px 0 0!important;color:#d2bd99!important;font:7px/1.3 Montserrat,Arial,sans-serif!important;letter-spacing:1.5px!important;text-align:center!important}
        .cdc-global-footer .footer-column h4{color:#ead9bc!important}.cdc-global-footer .footer-column a,.cdc-global-footer .footer-bottom{color:#e5dbce!important}.cdc-global-footer .footer-column a:hover{color:#d7b985!important}
        @media(max-width:700px){.cdc-global-footer{grid-template-columns:1fr 1fr!important;gap:24px 16px!important;padding:42px 6% 22px!important}.cdc-global-footer .footer-brand,.cdc-global-footer .footer-bottom{grid-column:1/-1!important}.cdc-global-footer .footer-bottom{text-align:center!important}}
        html,body{background:#e7e0d6!important;color:#403831!important}
        body{background:radial-gradient(ellipse at 15% 0%,rgba(250,245,235,.28),transparent 38%),linear-gradient(145deg,#e9e3da 0%,#ded6cb 52%,#e7e0d6 100%) fixed!important;color:#403831!important}
        .header,.main-nav,.utility-bar{background:#e2dbd0!important;border-color:rgba(104,86,68,.22)!important}
        main,.welcome-section,.featured-section,.contact-strip{background:transparent!important}
        .categories-section{background:linear-gradient(135deg,#d9d0c4,#e5ddd2)!important}
        .category-card,.featured-home-card,.featured-placeholder,.product-card,.product-item,.catalogue-card,.favorite-card,.checkout-card,.account-card,.delivery-section,.contact-form,.cart-item,.cart-summary,.cart-empty{background:#eee8df!important;color:#403831!important;border-color:#cfc4b6!important}
        .category-image,.category-product-item,.category-product-item img,.product-image,.favorite-image,.cart-item-image,.featured-home-card img{background:#ddd4c8!important}
        .category-card h3,.featured-home-card h3,.cart-item h2,.cart-page h1{color:#352d27!important}
        input,select,textarea{background:#f0ebe3!important;color:#352d27!important;border-color:#c5b8a7!important}
        input::placeholder,textarea::placeholder{color:#766b5f!important;opacity:1!important}
        .header-actions a{position:relative!important;overflow:visible!important}
        .cdc-count-badge{position:absolute!important;top:-5px!important;right:-5px!important;z-index:8!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;min-width:16px!important;height:16px!important;padding:0 4px!important;border:1px solid #f0e7d8!important;border-radius:999px!important;background:#9b7448!important;color:#fffaf1!important;font:700 9px/1 Arial,sans-serif!important;box-shadow:0 1px 4px rgba(0,0,0,.2)!important;pointer-events:none!important}
        .cdc-count-badge[hidden]{display:none!important}

        /* Pied de page : logo au centre de toute la largeur, cliquable vers l'accueil. */
        .cdc-global-footer{grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;column-gap:clamp(24px,7vw,90px)!important;row-gap:30px!important}
        .cdc-global-footer .footer-brand{grid-column:1/-1!important;display:flex!important;align-items:center!important;justify-content:center!important;width:100%!important;text-align:center!important}
        .cdc-global-footer .footer-brand .cdc-footer-home{width:max-content!important;max-width:100%!important;margin:0 auto!important;align-items:center!important;justify-content:center!important;text-align:center!important}
        .cdc-global-footer .footer-column{min-width:0!important}
        .cdc-global-footer .footer-bottom{grid-column:1/-1!important;width:100%!important;text-align:center!important}
        @media(max-width:700px){.cdc-global-footer{grid-template-columns:1fr 1fr!important;column-gap:16px!important;row-gap:26px!important}.cdc-global-footer .footer-brand,.cdc-global-footer .footer-bottom{grid-column:1/-1!important}}

        /* Harmonisation des zones qui conservaient un fond blanc et masquaient les textes. */
        html,body{background-color:#dcd4c9!important}
        body{color:#403831!important}
        main,main>section:not(.hero),.page-content,.page-container,.content-section,.legal-content,.about-content,.contact-page,.account-page,.catalogue-page,.favorites-page,.checkout-page,.cart-page,.product-page,.product-detail,.product-info,.product-details,.product-description,.delivery-section,.policy-section,.terms-section{background-color:transparent!important;color:#403831!important}
        .product-card,.product-item,.catalogue-card,.favorite-card,.favorite-item,.cart-item,.cart-summary,.cart-empty,.checkout-card,.account-card,.contact-form,.form-card,.product-info-card,.product-details-card,.info-card,.legal-card,.content-card,.faq-item,.accordion-item,.order-card{background:#e9e2d8!important;color:#403831!important;border-color:#c9beb0!important}
        .product-card *, .product-item *, .catalogue-card *, .favorite-card *, .favorite-item *, .cart-item *, .cart-summary *, .cart-empty *, .checkout-card *, .account-card *, .contact-form *, .form-card *, .product-info-card *, .product-details-card *, .info-card *, .legal-card *, .content-card *, .faq-item *, .accordion-item *, .order-card *{color:inherit}
        h1,h2,h3,h4,h5,h6,p,li,label,small,.description,.product-description,.price,.form-help,.empty-message{color:#403831}
        .footer,.cdc-global-footer{color:#e7ddce!important}
        .cdc-global-footer .footer-brand h3{color:#f0e5d2!important}
        .cdc-global-footer .footer-brand p{color:#d2bd99!important}
      `;
      document.head.appendChild(style);
    }
  }

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
        width: 36px; height: 36px; padding: 6px;
        border: 1px solid rgba(198,166,116,.42); border-radius: 50%;
        background: rgba(198,166,116,.08); color: inherit; cursor: pointer;
        -webkit-tap-highlight-color: transparent;
      }
      #cdc-language-button:hover, #cdc-language-button:focus-visible {
        color: #d7b985; border-color: #d7b985; outline: none;
      }
      #cdc-language-button svg { width: 21px; height: 21px; display: block; }
      #cdc-language-menu {
        position: absolute; top: calc(100% + 12px); right: 0; z-index: 100001;
        width: min(260px, 78vw); padding: 12px; background: #302923;
        border: 1px solid rgba(198,166,116,.45); box-shadow: 0 8px 24px rgba(0,0,0,.35);
      }
      #cdc-language-menu[hidden] { display: none; }
      #cdc-language-menu label {
        display: block; margin: 0 0 7px; color: #55483d;
        font: 11px Manrope, Arial, sans-serif;
      }
      #cdc-language-select {
        box-sizing: border-box; width: 100%; padding: 10px;
        border: 1px solid rgba(198,166,116,.45); background: #40382f; color: #f0e7da;
        font: 12px Manrope, Arial, sans-serif;
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

  function initializeCdcEnhancements() {
    installGlobalNavigation();
    installCartToast();
    installGlobalFooter();
    installGlobalCountBadges();
    installWhiteBackgroundCleanup();
    installSwitcher();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeCdcEnhancements, { once: true });
  } else {
    initializeCdcEnhancements();
  }
})();