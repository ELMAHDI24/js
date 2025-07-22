$(document).ready(function () {
  const API = 'http://localhost:4000/api';
  const token = localStorage.getItem('token');
  let deleteId = null;

  function fetchFournisseurs() {
    $.ajax({
      url: `${API}/frss`,
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      success: function (data) {
        let rows = '';
        data.forEach(f => {
          rows += `
            <tr>
              <td>${f.id}</td>
              <td>${f.nom}</td>
              <td>${f.adresse}</td>
              <td>${f.telephone}</td>
              <td>${f.email}</td>
              <td>
                <button class="btn btn-sm btn-info editBtn" data-id="${f.id}">Modifier</button>
                <button class="btn btn-sm btn-danger deleteBtn" data-id="${f.id}">Supprimer</button>
              </td>
            </tr>`;
        });
        $('#frsTableBody').html(rows);
      }
    });
  }

  $('#addFrsForm').on('submit', function (e) {
    e.preventDefault();
    const fournisseur = {
      nom: $('#nom').val(),
      adresse: $('#adresse').val(),
      lelephone: $('#lelephone').val(),
      email: $('#email').val()
    };

    $.ajax({
      url: `${API}/frss`,
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      contentType: 'application/json',
      data: JSON.stringify(fournisseur),
      success: function () {
        $('#addFrsForm')[0].reset();
        fetchFournisseurs();
      }
    });
  });

  $(document).on('click', '.editBtn', function () {
    const id = $(this).data('id');
    $.ajax({
      url: `${API}/frss/${id}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      success: function (data) {
        $('#edit_id').val(data.id);
        $('#edit_nom').val(data.nom);
        $('#edit_adresse').val(data.adresse);
        $('#edit_lelephone').val(data.telephone);
        $('#edit_email').val(data.email);
        $('#editFrsModal').modal('show');
      }
    });
  });

  $('#editFrsForm').on('submit', function (e) {
    e.preventDefault();
    const id = $('#edit_id').val();
    const fournisseur = {
      nom: $('#edit_nom').val(),
      adresse: $('#edit_adresse').val(),
      lelephone: $('#edit_lelephone').val(),
      email: $('#edit_email').val()
    };

    $.ajax({
      url: `${API}/frss/${id}`,
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      contentType: 'application/json',
      data: JSON.stringify(fournisseur),
      success: function () {
        $('#editFrsModal').modal('hide');
        fetchFournisseurs();
      }
    });
  });

  $(document).on('click', '.deleteBtn', function () {
    deleteId = $(this).data('id');
    $('#confirmDeleteFrsModal').modal('show');
  });

  $('#confirmDeleteFrsBtn').on('click', function () {
    if (deleteId) {
      $.ajax({
        url: `${API}/frss/${deleteId}`,
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
        success: function () {
          $('#confirmDeleteFrsModal').modal('hide');
          fetchFournisseurs();
          deleteId = null;
        }
      });
    }
  });

  fetchFournisseurs();
});
