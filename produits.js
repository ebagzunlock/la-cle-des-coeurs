/* =========================================
   LA CLÉ DES CŒURS
   CATALOGUE LOCAL — INDÉPENDANT DE WORDPRESS
   Les produits sont gérés directement dans ce fichier.
   Pour ajouter un produit, ajouter un objet dans le tableau.
   ========================================= */

"use strict";

/*
  Catalogue initial.
  L'article DETAILS à 2 € est conservé comme article de test
  déjà prévu dans le parcours de commande.
  Remplacer ses informations par celles du vrai article avant
  toute mise en vente réelle.
*/
window.produits = [
  {
    id: "987654321",
    nom: "DETAILS",
    marque: "LA CLÉ DES CŒURS",
    reference: "TEST-DETAILS",
    categorie: "accessoires",
    categories: ["accessoires"],
    prix: 2,
    ancienPrix: null,
    devise: "EUR",
    image: "",
    images: [],
    actif: true,
    enStock: true,
    enPromo: false,
    note: 0,
    nombreAvis: 0,
    description: "Article de démonstration à 2 € destiné aux essais de commande et de paiement. Aucun bijou physique n’est associé à cet article.",
    ficheSource: ""
  }
];

/* Compatibilité avec les pages qui attendent la fin du chargement. */
window.produitsReady = Promise.resolve(window.produits).then(function(produits) {
  window.dispatchEvent(new Event("produits:loaded"));
  return produits;
});
