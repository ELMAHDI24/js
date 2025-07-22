$(function () {
    $('#loginForm').on('submit', function (e) {
        e.preventDefault();
        
        const $form = $(this);
        const $submitBtn = $('#submitBtn');
        const $btnText = $('#btnText');
        const $btnIcon = $('#btnIcon');
        const $messageDiv = $('#message');
        
        // Désactiver le bouton et montrer le chargement
        $submitBtn.prop('disabled', true);
        $btnText.text('Connexion en cours...');
        $btnIcon.removeClass('fa-arrow-right').addClass('fa-spinner fa-spin');
        
        // Effacer les messages précédents
        $messageDiv.html('').removeClass();
        
        // Récupérer les valeurs
        const email = $('#email').val().trim();
        const mot_passe = $('#mot_passe').val();
        
        // Validation simple
        if (!email || !mot_passe) {
            showMessage('Veuillez remplir tous les champs', 'error');
            resetButton();
            return;
        }
        
        // Animation de soumission
        $form.addClass('animate__animated animate__fadeOut');
        
        setTimeout(() => {
            // Requête AJAX
            $.ajax({
                url: 'http://localhost:4000/api/users/login',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ email, mot_passe }),
                success: function (res) {
                    showMessage('Connexion réussie ! Redirection en cours...', 'success');
                    
                    // Stocker le token
                    localStorage.setItem('token', res.token);
                    
                    // Animation de succès
                    $form.removeClass('animate__animated animate__fadeOut')
                         .addClass('animate__animated animate__fadeIn');
                    
                    // Redirection après délai
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1500);
                },
                error: function (xhr) {
                    const err = xhr.responseJSON ? xhr.responseJSON.message : 'Erreur de connexion au serveur';
                    showMessage(err, 'error');
                    
                    // Réafficher le formulaire avec animation
                    $form.removeClass('animate__animated animate__fadeOut')
                         .addClass('animate__animated animate__fadeIn');
                },
                complete: function () {
                    resetButton();
                }
            });
        }, 500);
    });
    
    // Fonction pour afficher les messages
    function showMessage(text, type) {
        const $messageDiv = $('#message');
        let icon, bgColor, textColor, borderColor;
        
        if (type === 'success') {
            icon = 'fa-check-circle';
            bgColor = 'bg-green-50';
            textColor = 'text-green-700';
            borderColor = 'border-green-500';
        } else {
            icon = 'fa-exclamation-circle';
            bgColor = 'bg-red-50';
            textColor = 'text-red-700';
            borderColor = 'border-red-500';
        }
        
        $messageDiv.html(`
            <div class="alert-message p-4 rounded-lg ${bgColor} ${textColor} border-l-4 ${borderColor} flex items-start show">
                <i class="fas ${icon} mt-1 mr-3"></i>
                <div>
                    <p class="font-medium">${type === 'success' ? 'Succès' : 'Erreur'}</p>
                    <p class="text-sm">${text}</p>
                </div>
            </div>
        `);
    }
    
    // Fonction pour réinitialiser le bouton
    function resetButton() {
        $('#submitBtn').prop('disabled', false);
        $('#btnText').text('Se connecter');
        $('#btnIcon').removeClass('fa-spinner fa-spin').addClass('fa-arrow-right');
    }
});