$(document).ready(function () {
  const API = 'http://localhost:4000/api';
  const token = localStorage.getItem('token');

  function fetchFournisseurs(selectId) {
    $.ajax({
      url: `${API}/frss`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'GET',
      success: function (data) {
        let options = '<option value="">-- Sélectionnez un fournisseur --</option>';
        data.forEach(frss => {
          options += `<option value="${frss.id}">${frss.nom}</option>`;
        });
        $(`#${selectId}`).html(options);
      }
    });
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const jour = String(date.getDate()).padStart(2, '0');
    const mois = String(date.getMonth() + 1).padStart(2, '0');
    const annee = date.getFullYear();
    return `${jour}/${mois}/${annee}`;
  }

  function fetchCatalogues() {
    $.ajax({
      url: `${API}/catalogue`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'GET',
      success: function (data) {
        let rows = '';
        data.forEach(c => {
          rows += `
            <tr>
              <td>${c.id}</td>
              <td>${c.titre}</td>
              <td>${c.description}</td>
              <td>${formatDate(c.date_creation)}</td>
              <td>${c.fournisseur_nom || ''}</td>
              <td>
                <button class="btn btn-sm btn-info editBtn" data-id="${c.id}">Modifier</button>
                <button class="btn btn-sm btn-danger deleteBtn" data-id="${c.id}">Supprimer</button>
              </td>
            </tr>`;
        });
        $('#catalogueTableBody').html(rows);
      }
    });
  }

  // Ajouter un catalogue
  $('#addCatalogueForm').on('submit', function (e) {
    e.preventDefault();
    const data = {
      titre: $('#titre').val(),
      description: $('#description').val(),
      date_creation: $('#date_creation').val(),
      frss_id: $('#frss_id').val()
    };

    $.ajax({
      url: `${API}/catalogue`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function () {
        $('#addCatalogueForm')[0].reset();
        fetchCatalogues();
      }
    });
  });

  // Gestion du bouton Modifier
  $(document).on('click', '.editBtn', function () {
    const id = $(this).data('id');
    $.ajax({
      url: `${API}/catalogue/${id}`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'GET',
      success: function (data) {
        $('#edit_id').val(data.id);
        $('#edit_titre').val(data.titre);
        $('#edit_description').val(data.description);
        $('#edit_date_creation').val(data.date_creation);
        $('#edit_frss_id').val(data.frss_id);
        $('#editModal').modal('show');
      }
    });
  });

  // Sauvegarde des modifications
  $('#editCatalogueForm').on('submit', function (e) {
    e.preventDefault();
    const id = $('#edit_id').val();
    const data = {
      titre: $('#edit_titre').val(),
      description: $('#edit_description').val(),
      date_creation: $('#edit_date_creation').val(),
      frss_id: $('#edit_frss_id').val()
    };

    $.ajax({
      url: `${API}/catalogue/${id}`,
      headers: { Authorization: `Bearer ${token}` },
      method: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function () {
        $('#editModal').modal('hide');
        fetchCatalogues();
      }
    });
  });

  // Supprimer un catalogue avec confirmation via modal
  let deleteId = null;

  $(document).on('click', '.deleteBtn', function () {
    deleteId = $(this).data('id');
    $('#confirmDeleteModal').modal('show');
  });

  $('#confirmDeleteBtn').on('click', function () {
    if (deleteId) {
      $.ajax({
        url: `${API}/catalogue/${deleteId}`,
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
        success: function () {
          $('#confirmDeleteModal').modal('hide');
          fetchCatalogues();
          deleteId = null;
        }
      });
    }
  });

  // Initialisation
  fetchFournisseurs('frss_id');
  fetchFournisseurs('edit_frss_id');
  fetchCatalogues();
});
