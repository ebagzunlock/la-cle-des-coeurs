/* =========================================
   LA CLÉ DES CŒURS
   IMPORT AUTOMATIQUE DU CATALOGUE ORIGINAL
   CORRECTION CARTIER BAIGNOIRE 30716
   ARTICLE DETAILS À 2 €
   ========================================= */

const API_PRODUITS =
  "https://la-cle-des-coeurs-api.bagzful.workers.dev/wp-json/wc/store/v1/products";

const DETAILS_PRODUCT_ID = "987654321";
const DETAILS_IMAGE =
  "https://shop.pinetti.it/cdn/shop/products/prestigebox_zoom-Pinetti.png?v=1611572510";

// Les quatre vues du même modèle Cartier Baignoire WGBA0025,
// retrouvées dans l'historique du dépôt.
const IMAGES_CARTIER = [
  "https://bijouterielamalmaison.fr/wp-content/uploads/2026/05/CE1.jpeg",
  "https://bijouterielamalmaison.fr/wp-content/uploads/2026/05/CE2.jpeg",
  "https://bijouterielamalmaison.fr/wp-content/uploads/2026/05/CE3.jpeg",
  "https://bijouterielamalmaison.fr/wp-content/uploads/2026/05/CE5.jpeg",
  "https://bijouterielamalmaison.fr/wp-content/uploads/2026/05/CE6.jpeg",
  "https://bijouterielamalmaison.fr/wp-content/uploads/2026/05/CE7.jpeg",
  "https://bijouterielamalmaison.fr/wp-content/uploads/2026/05/CE9.jpeg"
];

const CATEGORIES = {
  "ap-x-swatch": "ap-swatch",
  "ap-swatch": "ap-swatch",
  "femme": "femme",
  "women": "femme",
  "homme": "homme",
  "men": "homme"
};

function convertirCategorie(categorie) {
  const slug = (categorie.slug || "").toLowerCase();
  const nom = (categorie.name || "").toLowerCase();

  if (CATEGORIES[slug]) return CATEGORIES[slug];
  if (CATEGORIES[nom]) return CATEGORIES[nom];

  if (slug.includes("femme") || slug.includes("women")) return "femme";
  if (slug.includes("homme") || slug.includes("men")) return "homme";
  if (slug.includes("ap-swatch")) return "ap-swatch";

  return "accessoires";
}

function nettoyerDescription(html) {
  const documentHTML = new DOMParser().parseFromString(
    html || "",
    "text/html"
  );

  documentHTML.querySelectorAll(
    "script, style, iframe, object, embed, form"
  ).forEach(element => element.remove());

  return documentHTML.body.innerHTML;
}

function convertirProduit(p) {
  const id = String(p.id);
  const estDetails = id === DETAILS_PRODUCT_ID;
  const estCartier = id === "30716";

  if (estDetails) {
    return {
      id: DETAILS_PRODUCT_ID,
      nom: "DETAILS",
      marque: "LA CLÉ DES CŒURS",
      reference: "TEST-DETAILS",
      categorie: "accessoires",
      categories: ["accessoires"],
      prix: 2,
      ancienPrix: null,
      devise: "EUR",
      image: DETAILS_IMAGE,
      images: [DETAILS_IMAGE],
      actif: true,
      enStock: true,
      enPromo: false,
      note: 0,
      nombreAvis: 0,
      description:
        "Article de démonstration à 2 € destiné aux essais de commande et de paiement. Aucun bijou physique n’est associé à cet article.",
      ficheSource: ""
    };
  }

  // WooCommerce Store API fournit les prix dans la plus petite unité
  // monétaire. On conserve le calcul actuel pour tous les autres produits.
  const minorUnit = Number.isInteger(Number(p.prices?.currency_minor_unit))
    ? Number(p.prices.currency_minor_unit)
    : 2;
  const diviseur = Math.pow(10, minorUnit);

  function convertirMontant(brut) {
    if (brut === undefined || brut === null || brut === "") return null;
    const valeur = Number(brut);
    return Number.isFinite(valeur) && valeur > 0 ? valeur / diviseur : null;
  }

  const prixAPI = convertirMontant(p.prices?.price);
  const prixVente = convertirMontant(p.prices?.sale_price);
  const prixNormal = convertirMontant(p.prices?.regular_price);

  const prixCatalogue = prixAPI
    || (p.is_on_sale && prixVente ? prixVente : null)
    || prixNormal
    || prixVente
    || null;

  const categories = [
    ...new Set((p.categories || []).map(convertirCategorie))
  ];

  const imagesSource = Array.isArray(p.images) ? p.images : [];

  const galerieOriginale = [
    ...new Set(
      imagesSource
        .map(img => img.src)
        .filter(Boolean)
    )
  ];

  const galerie = estCartier ? IMAGES_CARTIER : galerieOriginale;

  return {
    id,

    nom: estCartier
      ? "Cartier Baignoire Petit WGBA0025 « Femme » Quartz Or Jaune (2025) Taille 16 NEUF"
      : p.name || "",

    marque: estCartier ? "Cartier" : p.brands?.[0]?.name || "",

    reference: estCartier ? "WGBA0025" : p.sku || "",

    categorie: estCartier ? "femme" : categories[0] || "accessoires",

    categories: estCartier
      ? ["femme"]
      : categories.length ? categories : ["accessoires"],

    prix: estCartier ? 16000 : prixCatalogue,

    ancienPrix: estCartier
      ? null
      : Number.isFinite(prixNormal) && Number.isFinite(prixCatalogue) && prixNormal > prixCatalogue
        ? prixNormal
        : null,

    devise: "EUR",
    image: galerie[0] || "",
    images: galerie,
    actif: true,
    enStock: p.is_in_stock !== false,
    enPromo: Boolean(p.is_on_sale),
    note: Number(p.average_rating || 0),
    nombreAvis: Number(p.review_count || 0),

    description: estCartier
      ? "Montre Cartier Baignoire petit modèle, référence WGBA0025. Mouvement quartz, boîtier et bracelet rigide intégrés en or jaune 18 carats, cadran argenté avec chiffres romains et aiguilles bleuies. Taille 16."
      : nettoyerDescription(p.description),

    ficheSource: p.permalink || ""
  };
}

async function chargerTousLesProduits() {
  const produitsImportes = [];
  const dejaVus = new Set();

  let page = 1;
  const limite = 100;

  while (true) {
    const url =
      `${API_PRODUITS}?per_page=${limite}&page=${page}`;

    const reponse = await fetch(url);

    if (!reponse.ok) {
      throw new Error(
        `Erreur API : ${reponse.status} (page ${page})`
      );
    }

    const donnees = await reponse.json();

    if (!Array.isArray(donnees) || donnees.length === 0) {
      break;
    }

    for (const produit of donnees) {
      const id = String(produit.id);

      if (dejaVus.has(id)) continue;
      dejaVus.add(id);

      produitsImportes.push(convertirProduit(produit));
    }

    if (donnees.length < limite) break;

    page++;
  }

  return produitsImportes;
}

window.produits = [];

window.produitsReady = chargerTousLesProduits()
  .then(produitsImportes => {
    window.produits.splice(
      0,
      window.produits.length,
      ...produitsImportes
    );

    console.log(
      `${produitsImportes.length} produits importés depuis le catalogue d'origine, avec DETAILS à 2 €.`
    );

    window.dispatchEvent(new Event("produits:loaded"));

    return window.produits;
  })
  .catch(erreur => {
    console.error("Impossible de charger le catalogue :", erreur);
    window.dispatchEvent(new Event("produits:error"));
    throw erreur;
  });
