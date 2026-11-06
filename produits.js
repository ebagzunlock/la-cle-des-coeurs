// Catalogue LA CLÉ DES CŒURS
// Premier lot : montres homme
// Les prix et disponibilités doivent être revérifiés avant publication.

const produits = [
  {
    id: "cartier-santos-carree-2961",
    nom: "Cartier Santos Carrée 2961 – Cadran Bordeaux",
    marque: "Cartier",
    categorie: "homme",
    prix: 4300,
    ancienPrix: 5100,
    devise: "EUR",
    reference: "2961",
    description:
      "Montre Cartier Santos Carrée de 1982 avec cadran bordeaux Swiss Only, boîte et papiers d’origine.",
    image: "",
    ficheSource:
      "https://bijouterielamalmaison.fr/product/cartier-santos-carree-2961-cadran-bordeaux-swiss-only-1982-boite-papiers-rare/",
    actif: true
  },
  {
    id: "cartier-santos-wssa0062",
    nom: "Cartier Santos de Cartier WSSA0062 – Cadran vert",
    marque: "Cartier",
    categorie: "homme",
    prix: 6000,
    ancienPrix: null,
    devise: "EUR",
    reference: "WSSA0062",
    description:
      "Montre automatique Cartier Santos en acier, cadran vert, boîte et papiers. Modèle indiqué comme neuf sur la fiche source.",
    image: "",
    ficheSource:
      "https://bijouterielamalmaison.fr/product/cartier-santos-de-cartierwssa0062-ensemble-complet-garantie/",
    actif: true
  }
];

// Export pour les autres fichiers JavaScript du site
if (typeof window !== "undefined") {
  window.produits = produits;
}
