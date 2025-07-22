$(document).ready(function () {
  const API_URL = 'http://localhost:4000/api/produits';
  const CATALOGUE_URL = 'http://localhost:4000/api/catalogue';
  const token = localStorage.getItem('token');
  
  // Variables pour la pagination et le filtrage
  let currentPage = 1;
  const itemsPerPage = 5;
  let totalItems = 0;
  let allProduits = [];
  let filteredProduits = [];

  if (!token) {
    alert("Vous devez être connecté.");
    window.location.href = "/login.html";
    return;
  }

  // Charger les catalogues pour les dropdowns
  function loadCatalogues() {
    $.ajax({
      url: CATALOGUE_URL,
      headers: { Authorization: `Bearer ${token}` },
      method: 'GET',
      success: function (data) {
        let options = '<option value="">Sélectionner un catalogue</option>';
        let filterOptions = '<option value="">Tous les catalogues</option>';
        
        data.forEach(cat => {
          options += `<option value="${cat.id}">${cat.titre}</option>`;
          filterOptions += `<option value="${cat.id}">${cat.titre}</option>`;
        });
        
        $('#cataloge_id').html(options);
        $('#edit_cataloge_id').html(options);
        $('#filterCatalogue').html(filterOptions);
      },
      error: function(xhr, status, error) {
        console.error("Erreur lors du chargement des catalogues:", error);
      }
    });
  }

  // Récupérer tous les produits
  function fetchProduits() {
    $.ajax({
      url: API_URL,
      headers: { Authorization: `Bearer ${token}` },
      method: 'GET',
      success: function (data) {
        allProduits = data;
        totalItems = data.length;
        applyFilters();
      },
      error: function(xhr, status, error) {
        console.error("Erreur lors du chargement des produits:", error);
      }
    });
  }

  // Appliquer les filtres et tris
  function applyFilters() {
    let results = [...allProduits];
    
    // Filtre par recherche
    const searchTerm = $('#searchInput').val().toLowerCase();
    if (searchTerm) {
      results = results.filter(p => p.nom.toLowerCase().includes(searchTerm));
    }
    
    // Filtre par catalogue
    const catalogueFilter = $('#filterCatalogue').val();
    if (catalogueFilter) {
      results = results.filter(p => p.cataloge_id == catalogueFilter);
    }
    
    // Tri par prix
    const priceSort = $('#priceSort').val();
    if (priceSort === 'asc') {
      results.sort((a, b) => a.prix - b.prix);
    } else if (priceSort === 'desc') {
      results.sort((a, b) => b.prix - a.prix);
    }
    
    filteredProduits = results;
    totalItems = results.length;
    renderTable();
    renderPagination();
  }

  // Afficher le tableau avec les produits paginés
  function renderTable() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = filteredProduits.slice(startIndex, startIndex + itemsPerPage);
    
    let rows = '';
    paginatedItems.forEach(p => {
      rows += `
        <tr>
          <td>${p.id}</td>
          <td>${p.nom}</td>
          <td>${p.description}</td>
          <td>${p.prix} DH</td>
          <td><img src="../../backend/public/${p.image_url}" style="max-width:60px" /></td>
          <td>${p.catalogue_titre || ''}</td>
          <td>
            <button class="btn btn-sm btn-info editBtn" data-id="${p.id}">Modifier</button>
            <button class="btn btn-sm btn-danger deleteBtn" data-id="${p.id}">Supprimer</button>
          </td>
        </tr>`;
    });
    
    $('#produitsTableBody').html(rows);
    
    // Afficher un message si aucun résultat
    if (filteredProduits.length === 0) {
      $('#produitsTableBody').html('<tr><td colspan="7" class="text-center">Aucun produit trouvé</td></tr>');
    }
  }

  // Générer la pagination
  function renderPagination() {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    let paginationHtml = '';
    
    if (totalPages > 1) {
      // Bouton Précédent
      paginationHtml += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${currentPage - 1}">Précédent</a>
      </li>`;
      
      // Pages
      const maxVisiblePages = 5;
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      if (startPage > 1) {
        paginationHtml += `<li class="page-item">
          <a class="page-link" href="#" data-page="1">1</a>
        </li>`;
        if (startPage > 2) {
          paginationHtml += `<li class="page-item disabled">
            <span class="page-link">...</span>
          </li>`;
        }
      }
      
      for (let i = startPage; i <= endPage; i++) {
        paginationHtml += `<li class="page-item ${currentPage === i ? 'active' : ''}">
          <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>`;
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          paginationHtml += `<li class="page-item disabled">
            <span class="page-link">...</span>
          </li>`;
        }
        paginationHtml += `<li class="page-item">
          <a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a>
        </li>`;
      }
      
      // Bouton Suivant
      paginationHtml += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${currentPage + 1}">Suivant</a>
      </li>`;
    }
    
    $('#pagination').html(paginationHtml);
  }

  // Gestion de la pagination
  $(document).on('click', '.page-link', function(e) {
    e.preventDefault();
    const page = parseInt($(this).data('page'));
    if (!isNaN(page) && page !== currentPage) {
      currentPage = page;
      renderTable();
      // Scroll vers le haut du tableau
      $('html, body').animate({
        scrollTop: $("#produitsTableBody").offset().top - 100
      }, 200);
    }
  });

  // Gestion des filtres
  $('#searchInput, #filterCatalogue, #priceSort').on('change keyup', function() {
    currentPage = 1;
    applyFilters();
  });

  // Réinitialisation des filtres
  $('#resetFilters').on('click', function() {
    $('#searchInput').val('');
    $('#filterCatalogue').val('');
    $('#priceSort').val('');
    currentPage = 1;
    applyFilters();
  });

  // Ajout d'un produit
  $('#addProductForm').on('submit', function (e) {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('nom', $('#nom').val());
    formData.append('description', $('#description').val());
    formData.append('prix', $('#prix').val());
    formData.append('cataloge_id', $('#cataloge_id').val());
    
    const imageFile = $('#image_file')[0].files[0];
    if (imageFile) {
      formData.append('image', imageFile);
    }

    $.ajax({
      url: API_URL,
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${token}` 
      },
      contentType: false,
      processData: false,
      data: formData,
      success: function () {
        $('#addProductForm')[0].reset();
        fetchProduits();
        $('#addProductModal').modal('hide');
      },
      error: function(xhr, status, error) {
        console.error("Erreur:", error);
        alert("Erreur lors de l'ajout du produit: " + (xhr.responseJSON?.message || error));
      }
    });
  });

    // Variables pour la suppression
  let productToDeleteId = null;
  let productToDeleteName = null;

  // Gestion du clic sur le bouton Supprimer
  $(document).on('click', '.deleteBtn', function () {
    const id = $(this).data('id');
    const name = $(this).closest('tr').find('td:nth-child(2)').text();
    
    productToDeleteId = id;
    productToDeleteName = name;
    
    $('#productToDeleteName').text(name);
    $('#deleteConfirmModal').modal('show');
  });

  // Confirmation de suppression
  $('#confirmDeleteBtn').on('click', function() {
    if (productToDeleteId) {
      $.ajax({
        url: `${API_URL}/${productToDeleteId}`,
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
        beforeSend: function() {
          $('#confirmDeleteBtn').prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Suppression...');
        },
        success: function () {
          $('#deleteConfirmModal').modal('hide');
          fetchProduits();
          showAlert('success', 'Produit supprimé avec succès');
        },
        error: function(xhr, status, error) {
          showAlert('danger', "Erreur lors de la suppression: " + (xhr.responseJSON?.message || error));
        },
        complete: function() {
          $('#confirmDeleteBtn').prop('disabled', false).text('Supprimer');
          productToDeleteId = null;
          productToDeleteName = null;
        }
      });
    }
  });

  // Fonction pour afficher des alertes (optionnelle mais recommandée)
  function showAlert(type, message) {
    const alertHtml = `
      <div class="alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3" role="alert" style="z-index: 1100;">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
    $('body').append(alertHtml);
    setTimeout(() => $('.alert').alert('close'), 5000);
  }

  // Pré-remplir le formulaire de modification
  $(document).on('click', '.editBtn', function () {
    const id = $(this).data('id');
    $.ajax({
      url: `${API_URL}/${id}`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'GET',
      success: function (data) {
        $('#edit_id').val(data.id);
        $('#edit_nom').val(data.nom);
        $('#edit_description').val(data.description);
        $('#edit_prix').val(data.prix);
        $('#edit_cataloge_id').val(data.cataloge_id);
        $('#current_image').text(data.image_url);
        $('#editModal').modal('show');
      },
      error: function(xhr, status, error) {
        console.error("Erreur lors du chargement du produit:", error);
      }
    });
  });

  // Modification d'un produit
  $('#editProductForm').on('submit', function (e) {
    e.preventDefault();
    const id = $('#edit_id').val();
    
    const formData = new FormData();
    formData.append('nom', $('#edit_nom').val());
    formData.append('description', $('#edit_description').val());
    formData.append('prix', $('#edit_prix').val());
    formData.append('cataloge_id', $('#edit_cataloge_id').val());
    
    const imageFile = $('#edit_image_file')[0].files[0];
    if (imageFile) {
      formData.append('image', imageFile);
    }

    $.ajax({
      url: `${API_URL}/${id}`,
      method: 'PUT',
      headers: { 
        Authorization: `Bearer ${token}` 
      },
      contentType: false,
      processData: false,
      data: formData,
      success: function () {
        $('#editModal').modal('hide');
        fetchProduits();
      },
      error: function(xhr, status, error) {
        console.error("Erreur:", error);
        alert("Erreur lors de la modification: " + (xhr.responseJSON?.message || error));
      }
    });
  });

  // Initialisation
  loadCatalogues();
  fetchProduits();
});