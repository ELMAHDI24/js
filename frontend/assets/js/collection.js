const apiUrl = 'http://localhost:4000/api/collections';
const produitsApiUrl = 'http://localhost:4000/api/produits';
const collectionProduitsApiUrl = 'http://localhost:4000/api/collection_produits';

// Récupérer token JWT stocké dans localStorage
const token = localStorage.getItem('token');

// Fonction pour charger toutes les collections et leurs produits
function loadCollections() {
  $.ajax({
    url: apiUrl,
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
    success: function (collections) {
      renderCollections(collections);
    },
    error: function (xhr) {
      if (xhr.status === 401) {
        alert('Accès refusé. Veuillez vous connecter.');
        window.location.href = 'login.html';
      } else {
        alert('Erreur lors du chargement des collections');
      }
    }
  });
}

// Fonction pour afficher les collections dans le tableau (version unique fusionnée)
function renderCollections(collections) {
  const tbody = $('#collectionsTableBody');
  tbody.empty();

  collections.forEach(collection => {
    tbody.append(`
      <tr>
        <td>${collection.id}</td>
        <td>${collection.nom}</td>
        <td>${collection.description || ''}</td>
        <td>
          <button class="btn btn-sm btn-info me-1" onclick="showProduitsOffcanvas(${collection.id})">Produits</button>
          <button class="btn btn-sm btn-success me-1" onclick="showAddProduitModal(${collection.id})">Associer Produit</button>
          <button class="btn btn-sm btn-primary me-1" onclick="showEditModal(${collection.id}, '${escapeHtml(collection.nom)}', '${escapeHtml(collection.description)}')">Modifier</button>
          <button class="btn btn-sm btn-danger" onclick="showDeleteModal(${collection.id})">Supprimer</button>
        </td>
      </tr>
    `);
  });
}

// Échapper les apostrophes et caractères spéciaux pour éviter les erreurs JS
function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

// Ajouter une collection
$('#addCollectionForm').submit(function (e) {
  e.preventDefault();
  const nom = $('#nom').val().trim();
  const description = $('#description').val().trim();

  if (!nom) {
    alert('Le nom est requis');
    return;
  }

  $.ajax({
    url: apiUrl,
    method: 'POST',
    contentType: 'application/json',
    headers: { 'Authorization': `Bearer ${token}` },
    data: JSON.stringify({ nom, description }),
    success: function () {
      $('#addCollectionForm')[0].reset();
      loadCollections();
    },
    error: function () {
      alert('Erreur lors de l\'ajout de la collection');
    }
  });
});

// Afficher modal modification avec données préremplies
function showEditModal(id, nom, description) {
  $('#edit_id').val(id);
  $('#edit_nom').val(nom);
  $('#edit_description').val(description);
  const modal = new bootstrap.Modal(document.getElementById('editCollectionModal'));
  modal.show();
}

// Modifier une collection
$('#editCollectionForm').submit(function (e) {
  e.preventDefault();
  const id = $('#edit_id').val();
  const nom = $('#edit_nom').val().trim();
  const description = $('#edit_description').val().trim();

  if (!nom) {
    alert('Le nom est requis');
    return;
  }

  $.ajax({
    url: `${apiUrl}/${id}`,
    method: 'PUT',
    contentType: 'application/json',
    headers: { 'Authorization': `Bearer ${token}` },
    data: JSON.stringify({ nom, description }),
    success: function () {
      loadCollections();
      const modal = bootstrap.Modal.getInstance(document.getElementById('editCollectionModal'));
      modal.hide();
    },
    error: function () {
      alert('Erreur lors de la modification de la collection');
    }
  });
});

let collectionIdToDelete = null;

// Afficher modal suppression
function showDeleteModal(id) {
  collectionIdToDelete = id;
  const modal = new bootstrap.Modal(document.getElementById('confirmDeleteCollectionModal'));
  modal.show();
}

// Confirmer suppression
$('#confirmDeleteCollectionBtn').click(function () {
  if (!collectionIdToDelete) return;

  $.ajax({
    url: `${apiUrl}/${collectionIdToDelete}`,
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
    success: function () {
      loadCollections();
      collectionIdToDelete = null;
      const modal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteCollectionModal'));
      modal.hide();
    },
    error: function () {
      alert('Erreur lors de la suppression de la collection');
    }
  });
});

// Afficher produits dans offcanvas
// Variables globales pour garder la trace du produit à retirer
let currentCollectionId = null;
let currentProduitId = null;

// Modifier la fonction showProduitsOffcanvas pour utiliser le modal de confirmation
function showProduitsOffcanvas(collectionId) {
  $('#produitsOffcanvasBody').html('<p>Chargement...</p>');
  const offcanvas = new bootstrap.Offcanvas(document.getElementById('produitsOffcanvas'));
  offcanvas.show();

  $.ajax({
    url: `${collectionProduitsApiUrl}/${collectionId}`,
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
    success: function(produits) {
      if (produits.length === 0) {
        $('#produitsOffcanvasBody').html('<p>Aucun produit associé</p>');
      } else {
        const html = produits.map(p => `
          <div class="d-flex justify-content-between border-bottom py-2">
            <span>${p.nom}</span>
            <button class="btn btn-sm btn-outline-danger" 
                    onclick="prepareRemoveProduit(${collectionId}, ${p.id}, '${escapeHtml(p.nom)}')">
              Retirer
            </button>
          </div>
        `).join('');
        $('#produitsOffcanvasBody').html(html);
      }
    },
    error: function() {
      $('#produitsOffcanvasBody').html('<p>Erreur de chargement</p>');
    }
  });
}

// Préparer la suppression (afficher le modal)
function prepareRemoveProduit(collectionId, produitId, produitNom) {
  currentCollectionId = collectionId;
  currentProduitId = produitId;
  
  // Mettre à jour le message du modal avec le nom du produit
  $('#confirmRemoveProduitModal .modal-body').html(
    `Êtes-vous sûr de vouloir retirer le produit <strong>${produitNom}</strong> de la collection ?`
  );
  
  const modal = new bootstrap.Modal(document.getElementById('confirmRemoveProduitModal'));
  modal.show();
}

// Confirmer la suppression
$('#confirmRemoveProduitBtn').click(function() {
  if (!currentCollectionId || !currentProduitId) return;

  $.ajax({
    url: collectionProduitsApiUrl,
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
    contentType: 'application/json',
    data: JSON.stringify({ 
      collection_id: currentCollectionId, 
      produit_id: currentProduitId 
    }),
    success: function() {
      // Fermer le modal de confirmation
      const modal = bootstrap.Modal.getInstance(document.getElementById('confirmRemoveProduitModal'));
      modal.hide();
      
      // Recharger l'offcanvas
      showProduitsOffcanvas(currentCollectionId);
      
      // Recharger le tableau principal
      loadCollections();
      
      // Réinitialiser les variables
      currentCollectionId = null;
      currentProduitId = null;
    },
    error: function() {
      alert("Erreur lors de la suppression de l'association");
    }
  });
});

// Afficher modal d'ajout de produit à une collection
function showAddProduitModal(collectionId) {
  $('#assocCollectionId').val(collectionId);
  $('#produitSelect').empty();
  $.ajax({
    url: produitsApiUrl,
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
    success: function (produits) {
      produits.forEach(p => {
        $('#produitSelect').append(`<option value="${p.id}">${p.nom}</option>`);
      });
      const modal = new bootstrap.Modal(document.getElementById('addProduitModal'));
      modal.show();
    },
    error: function () {
      alert("Erreur lors du chargement des produits");
    }
  });
}

// Soumettre association produit/collection
$('#addProduitForm').submit(function (e) {
  e.preventDefault();
  const collection_id = $('#assocCollectionId').val();
  const produit_id = $('#produitSelect').val();

  $.ajax({
    url: collectionProduitsApiUrl,
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    contentType: 'application/json',
    data: JSON.stringify({ collection_id, produit_id }),
    success: function () {
      const modal = bootstrap.Modal.getInstance(document.getElementById('addProduitModal'));
      modal.hide();
      loadCollections();
    },
    error: function () {
      alert("Erreur lors de l'association du produit");
    }
  });
});

// Initialiser le chargement
$(document).ready(function () {
  if (!token) {
    window.location.href = 'login.html';
  }
  loadCollections();
});