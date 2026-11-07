
/* =========================================
   LA CLÉ DES CŒURS
   IMPORT AUTOMATIQUE DU CATALOGUE ORIGINAL
   CORRECTION CARTIER BAIGNOIRE 30716
   ========================================= */

const API_PRODUITS =
  "https://la-cle-des-coeurs-api.bagzful.workers.dev/wp-json/wc/store/v1/products";

const IMAGES_CARTIER = [
  "https://pisa1940.com/cdn/shop/files/SOLD_115_e13845bd-fce8-4eeb-8067-a5a86ae5bad8.png?v=1793283493",
  "https://pisa1940.com/cdn/shop/files/w1242_tpadding12_20_3__8_56539df2-8927-4022-9f58-d1892be7478d.webp?v=1793283493",
  "https://pisa1940.com/cdn/shop/files/w1242_tpadding12_20_1__8.webp?v=1793283492",
  "https://pisa1940.com/cdn/shop/files/w1242_tpadding12_20_2__7.webp?v=1793283492"
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
  const estCartier = String(p.id) === "30716";

  const prix = Number(p.prices?.price || 0) / 100;
  const prixNormal = Number(p.prices?.regular_price || 0) / 100;

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

  const galerie = estCartier
    ? IMAGES_CARTIER
    : galerieOriginale;

  return {
    id: String(p.id),

    nom: estCartier
      ? "Cartier Baignoire Petit WGBA0025 « Femme » Quartz Or Jaune (2025) Taille 16 NEUF"
      : p.name || "",

    marque: estCartier
      ? "Cartier"
      : p.brands?.[0]?.name || "",

    reference: estCartier
      ? "WGBA0025"
      : p.sku || "",

    categorie: estCartier
      ? "femme"
      : categories[0] || "accessoires",

    categories: estCartier
      ? ["femme"]
      : categories.length ? categories : ["accessoires"],

    prix: estCartier ? 16000 : prix,

    ancienPrix: estCartier
      ? null
      : prixNormal > prix ? prixNormal : null,

    devise: "EUR",
    image: galerie[0] || "",
    images: galerie,
    actif: true,
    enStock: estCartier ? true : p.is_in_stock !== false,
    enPromo: estCartier ? false : Boolean(p.is_on_sale),
    note: estCartier ? 0 : Number(p.average_rating || 0),
    nombreAvis: estCartier ? 0 : Number(p.review_count || 0),

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
      if (!dejaVus.has(produit.id)) {
        dejaVus.add(produit.id);
        produitsImportes.push(convertirProduit(produit));
      }
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
      `${produitsImportes.length} produits importés depuis le catalogue original.`
    );

    window.dispatchEvent(new Event("produits:loaded"));

    return window.produits;
  })
  .catch(erreur => {
    console.error("Impossible de charger le catalogue :", erreur);
    window.dispatchEvent(new Event("produits:error"));
    throw erreur;
  });
