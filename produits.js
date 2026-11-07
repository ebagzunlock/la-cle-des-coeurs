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

// Image dédiée au modèle Cartier Baignoire Petit WGBA0025.
const IMAGES_CARTIER = [
  "https://cartier.vtexassets.com/arquivos/ids/240053-800-auto?aspect=true&height=auto&v=638675391038230000&width=800",
  "https://cartier.vtexassets.com/arquivos/ids/240054-800-auto?aspect=true&height=auto&v=638675391042800000&width=800",
  "https://cartier.vtexassets.com/arquivos/ids/240055-800-auto?aspect=true&height=auto&v=638675391047770000&width=800",
  "https://cartier.vtexassets.com/arquivos/ids/240056-800-auto?aspect=true&height=auto&v=638675391052900000&width=800",
  "https://cartier.vtexassets.com/arquivos/ids/240057-800-auto?aspect=true&height=auto&v=638675391057600000&width=800",
  "https://cartier.vtexassets.com/arquivos/ids/240058-800-auto?aspect=true&height=auto&v=638675391063370000&width=800",
  "https://cartier.vtexassets.com/arquivos/ids/240059-800-auto?aspect=true&height=auto&v=638675391069000000&width=800"
];

function normaliserTexteCategorie(valeur) {
  return String(valeur || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\\u0300-\\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function convertirCategorie(categorie) {
  const slug = normaliserTexteCategorie(categorie && categorie.slug);
  const nom = normaliserTexteCategorie(categorie && categorie.name);
  const valeur = slug + "-" + nom;

  if (/ap.*swatch|swatch.*ap/.test(valeur)) return "ap-swatch";
  if (/femme|women|woman|ladies/.test(valeur)) return "femme";
  if (/homme|men|man|gentlemen/.test(valeur)) return "homme";
  if (/accessoir|bracelet|bijou|jewel|accessor/.test(valeur)) return "accessoires";

  return null;
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
    ...new Set((Array.isArray(p.categories) ? p.categories : [])
      .map(convertirCategorie)
      .filter(Boolean))
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

    categorie: estCartier ? "femme" : categories[0] || "",

    categories: estCartier ? ["femme"] : categories,

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

    let reponse;

    try {
      reponse = await fetch(url, { cache: "no-store" });
    } catch (erreur) {
      if (page === 1) throw erreur;
      console.warn("Fin du chargement paginé après la page", page - 1, erreur);
      break;
    }

    if (!reponse.ok) {
      if (page === 1) {
        throw new Error(`Erreur API : ${reponse.status} (page ${page})`);
      }
      console.warn("La page catalogue suivante n'est pas disponible :", page);
      break;
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
