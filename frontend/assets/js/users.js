const API = 'http://localhost:4000/api/users/';
const token = localStorage.getItem('token');
let userModal = null;
let confirmDeleteModal = null;
let userIdToDelete = null;

// Initialisation des modals au chargement du document
$(document).ready(function() {
  userModal = new bootstrap.Modal(document.getElementById('userModal'));
  confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
  
  // Gestionnaire d'événement pour la confirmation de suppression
  $('#confirmDeleteButton').click(function() {
    if (userIdToDelete) {
      performDelete(userIdToDelete);
    }
  });
  
  loadUsers();
});

// 🟢 Charger les utilisateurs
function loadUsers() {
  $.ajax({
    url: API,
    method: 'GET',
    headers: { Authorization: 'Bearer ' + token },
    success: function(users) {
      let rows = '';
      users.forEach(user => {
        rows += `
          <tr>
            <td>${user.id}</td>
            <td>${user.nom}</td>
            <td>${user.prenom}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${user.adresse}</td>
            <td>${user.age}</td>
            <td>
              <button class="btn btn-sm btn-primary" onclick='editUser(${JSON.stringify(user)})'>Modifier</button>
              <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">Supprimer</button>
            </td>
          </tr>
        `;
      });
      $('#usersTableBody').html(rows);
    },
    error: (xhr) => {
      showMessage('danger', xhr.responseJSON?.message || 'Erreur serveur');
    }
  });
}

// 🔃 Remplir le formulaire pour édition
function editUser(user) {
  $('#userId').val(user.id);
  $('#nom').val(user.nom);
  $('#prenom').val(user.prenom);
  $('#email').val(user.email);
  $('#mot_passe').val('');
  $('#role').val(user.role);
  $('#adress').val(user.adresse);
  $('#age').val(user.age);
  
  $('#userModalLabel').text('Modifier un utilisateur');
  userModal.show();
}

// ❌ Supprimer un utilisateur (ouvre le modal de confirmation)
function deleteUser(id) {
  userIdToDelete = id;
  confirmDeleteModal.show();
}

// ✅ Effectuer la suppression après confirmation
function performDelete(id) {
  $.ajax({
    url: API + id,
    method: 'DELETE',
    headers: { Authorization: 'Bearer ' + token },
    success: () => {
      showMessage('success', 'Utilisateur supprimé');
      loadUsers();
      confirmDeleteModal.hide();
    },
    error: (xhr) => {
      showMessage('danger', xhr.responseJSON?.message || 'Erreur serveur');
      confirmDeleteModal.hide();
    }
  });
}

// ✅ Enregistrer ou mettre à jour
function submitForm() {
  const id = $('#userId').val();
  const user = {
    nom: $('#nom').val(),
    prenom: $('#prenom').val(),
    email: $('#email').val(),
    mot_passe: $('#mot_passe').val(),
    role: $('#role').val(),
    adresse: $('#adress').val(),
    age: $('#age').val()
  };

  // Validation simple
  if (!user.nom || !user.prenom || !user.email) {
    showMessage('danger', 'Veuillez remplir tous les champs obligatoires');
    return;
  }

  const method = id ? 'PUT' : 'POST';
  const url = id ? API + id : API + 'register';

  $.ajax({
    url,
    method,
    headers: { Authorization: 'Bearer ' + token },
    contentType: 'application/json',
    data: JSON.stringify(user),
    success: (res) => {
      showMessage('success', id ? 'Utilisateur modifié' : 'Utilisateur ajouté');
      resetForm();
      userModal.hide();
      loadUsers();
    },
    error: (xhr) => {
      showMessage('danger', xhr.responseJSON?.message || 'Erreur serveur');
    }
  });
}

// 🔄 Réinitialiser le formulaire
function resetForm() {
  $('#userForm')[0].reset();
  $('#userId').val('');
  $('#userModalLabel').text('Ajouter un utilisateur');
}

// 💬 Afficher un message
function showMessage(type, text) {
  const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
  $('#message').html(`<div class="alert ${alertClass} alert-dismissible fade show" role="alert">
    ${text}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`);
  
  // Fermer automatiquement après 5 secondes
  setTimeout(() => {
    $('.alert').alert('close');
  }, 5000);
}