
/* =========================================
   LA CLÉ DES CŒURS
   IMPORT AUTOMATIQUE DU CATALOGUE ORIGINAL
   ========================================= */

const API_PRODUITS =
"https://la-cle-des-coeurs-api.bagzful.workers.dev/wp-json/wc/store/v1/products";

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
  const prix = Number(p.prices?.price || 0) / 100;
  const prixNormal = Number(p.prices?.regular_price || 0) / 100;

  const categories = [
    ...new Set((p.categories || []).map(convertirCategorie))
  ];

  const imagesSource = Array.isArray(p.images) ? p.images : [];

  // Photos vérifiées sur la fiche originale de la Cartier.
  const imagesCartier = [
    "https://bijouterielamalmaison.fr/wp-content/uploads/2026/05/CE1-150x135.jpeg",
    "https://bijouterielamalmaison.fr/wp-content/uploads/2026/05/CE2-150x144.jpeg",
    "https://bijouterielamalmaison.fr/wp-content/uploads/2026/05/CE3-150x147.jpeg",
    "https://bijouterielamalmaison.fr/wp-content/uploads/2026/05/CE4-150x144.jpeg",
    "https://bijouterielamalmaison.fr/wp-content/uploads/2026/05/CE5-150x141.jpeg",
    "https://bijouterielamalmaison.fr/wp-content/uploads/2026/05/CE6-150x145.jpeg",
    "https://bijouterielamalmaison.fr/wp-content/uploads/2026/05/CE7-150x147.jpeg",
    "https://bijouterielamalmaison.fr/wp-content/uploads/2026/05/CE8-150x135.jpeg",
    "https://bijouterielamalmaison.fr/wp-content/uploads/2026/05/CE9-150x146.jpeg"
  ];

  const galerie = String(p.id) === "30716"
    ? imagesCartier
    : imagesSource.map(img => img.src).filter(Boolean);

  return {
    id: String(p.id),
    nom: p.name || "",
    marque: p.brands?.[0]?.name || "",
    reference: p.sku || "",
    categorie: categories[0] || "accessoires",
    categories: categories.length ? categories : ["accessoires"],
    prix: prix,
    ancienPrix: prixNormal > prix ? prixNormal : null,
    devise: "EUR",
    image: galerie[0] || "",
    images: galerie,
    actif: true,
    description: nettoyerDescription(p.description),
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
