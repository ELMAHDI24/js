// Check authentication
const token = localStorage.getItem('token');
if (!token) {
  alert('Accès refusé. Veuillez vous connecter.');
  window.location.href = 'login.html';
}

// API Configuration
const API_BASE_URL = 'http://localhost:4000/api';
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};

// Colors for charts
const CHART_COLORS = [
  'rgba(255, 99, 132, 0.7)',
  'rgba(54, 162, 235, 0.7)',
  'rgba(255, 206, 86, 0.7)',
  'rgba(75, 192, 192, 0.7)',
  'rgba(153, 102, 255, 0.7)',
  'rgba(255, 159, 64, 0.7)',
  'rgba(199, 199, 199, 0.7)'
];

// DOM Ready
$(document).ready(function() {
  // Load all dashboard data
  loadDashboardData();
});

function loadDashboardData() {
  // Load stats
  fetchStats();
  
  // Load charts
  fetchProductsByCollection();
  fetchProductsByCatalogue();
  fetchCataloguesBySupplier();
  
  // Load recent items
  fetchRecentProducts();
  fetchRecentCatalogues();
  fetchRecentCollections();
}

// Fetch and display stats
function fetchStats() {
  $.ajax({
    url: `${API_BASE_URL}/dashboard/stats`,
    method: 'GET',
    headers: headers,
    success: function(data) {
      renderStatsCards(data);
    },
    error: function(error) {
      console.error('Error fetching stats:', error);
      showError('Failed to load statistics');
    }
  });
}

function renderStatsCards(stats) {
  const statsData = [
    { title: 'Produits', value: stats.total_produits, icon: 'fa-box', color: 'bg-blue-500' },
    { title: 'Catalogues', value: stats.total_catalogues, icon: 'fa-book', color: 'bg-green-500' },
    { title: 'Collections', value: stats.total_collections, icon: 'fa-layer-group', color: 'bg-purple-500' },
    { title: 'Fournisseurs', value: stats.total_fournisseurs, icon: 'fa-truck', color: 'bg-yellow-500' },
    { title: 'Utilisateurs', value: stats.total_utilisateurs, icon: 'fa-users', color: 'bg-red-500' }
  ];

  let cardsHTML = '';
  statsData.forEach(stat => {
    cardsHTML += `
      <div class="stat-card ${stat.color} text-white p-4 rounded-lg shadow">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-sm font-medium">${stat.title}</p>
            <p class="text-2xl font-bold">${stat.value}</p>
          </div>
          <i class="fas ${stat.icon} text-2xl opacity-70"></i>
        </div>
      </div>
    `;
  });

  $('#statsContainer').html(cardsHTML);
}

// Fetch and render products by collection chart
function fetchProductsByCollection() {
  $.ajax({
    url: `${API_BASE_URL}/dashboard/chart/produits-par-collection`,
    method: 'GET',
    headers: headers,
    success: function(data) {
      renderProductsByCollectionChart(data);
    },
    error: function(error) {
      console.error('Error fetching products by collection:', error);
      showError('Failed to load products by collection data');
    }
  });
}

function renderProductsByCollectionChart(data) {
  const ctx = document.getElementById('productsByCollectionChart').getContext('2d');
  const labels = data.map(item => item.collection);
  const values = data.map(item => item.total);
  
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: CHART_COLORS,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right'
        }
      }
    }
  });
}

// Fetch and render products by catalogue chart
function fetchProductsByCatalogue() {
  $.ajax({
    url: `${API_BASE_URL}/dashboard/chart/produits-par-catalogue`,
    method: 'GET',
    headers: headers,
    success: function(data) {
      renderProductsByCatalogueChart(data);
    },
    error: function(error) {
      console.error('Error fetching products by catalogue:', error);
      showError('Failed to load products by catalogue data');
    }
  });
}

function renderProductsByCatalogueChart(data) {
  const ctx = document.getElementById('productsByCatalogueChart').getContext('2d');
  const labels = data.map(item => item.catalogue);
  const values = data.map(item => item.total);
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Nombre de produits',
        data: values,
        backgroundColor: CHART_COLORS,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        },
        x: {
          ticks: {
            autoSkip: false,
            maxRotation: 45,
            minRotation: 45
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

// Fetch and render catalogues by supplier chart
function fetchCataloguesBySupplier() {
  $.ajax({
    url: `${API_BASE_URL}/dashboard/chart/catalogues-par-fournisseur`,
    method: 'GET',
    headers: headers,
    success: function(data) {
      renderCataloguesBySupplierChart(data);
    },
    error: function(error) {
      console.error('Error fetching catalogues by supplier:', error);
      showError('Failed to load catalogues by supplier data');
    }
  });
}

function renderCataloguesBySupplierChart(data) {
  const ctx = document.getElementById('cataloguesBySupplierChart').getContext('2d');
  const labels = data.map(item => item.fournisseur);
  const values = data.map(item => item.total_catalogues);
  
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: CHART_COLORS,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right'
        }
      }
    }
  });
}

// Fetch and render recent products
function fetchRecentProducts() {
  $.ajax({
    url: `${API_BASE_URL}/dashboard/recent/produits`,
    method: 'GET',
    headers: headers,
    success: function(data) {
      renderRecentProducts(data);
    },
    error: function(error) {
      console.error('Error fetching recent products:', error);
      showError('Failed to load recent products');
    }
  });
}

function renderRecentProducts(products) {
  let html = '';
  products.forEach(product => {
    html += `
      <div class="recent-item p-3 border rounded-lg flex items-center space-x-3">
        <img src="../../backend/public/${product.image_url}" alt="${product.nom}" 
             class="w-12 h-12 object-cover rounded">
        <div>
          <p class="font-medium">${product.nom}</p>
          <p class="text-sm text-gray-600">${product.prix} €</p>
        </div>
      </div>
    `;
  });
  $('#recentProducts').html(html);
}

// Fetch and render recent catalogues
function fetchRecentCatalogues() {
  $.ajax({
    url: `${API_BASE_URL}/dashboard/recent/catalogues`,
    method: 'GET',
    headers: headers,
    success: function(data) {
      renderRecentCatalogues(data);
    },
    error: function(error) {
      console.error('Error fetching recent catalogues:', error);
      showError('Failed to load recent catalogues');
    }
  });
}

function renderRecentCatalogues(catalogues) {
  let html = '';
  catalogues.forEach(catalogue => {
    const date = new Date(catalogue.date_creation).toLocaleDateString('fr-FR');
    html += `
      <div class="recent-item p-3 border rounded-lg">
        <p class="font-medium">${catalogue.titre}</p>
        <p class="text-sm text-gray-600">Créé le ${date}</p>
      </div>
    `;
  });
  $('#recentCatalogues').html(html);
}

// Fetch and render recent collections
function fetchRecentCollections() {
  $.ajax({
    url: `${API_BASE_URL}/dashboard/recent/collections`,
    method: 'GET',
    headers: headers,
    success: function(data) {
      renderRecentCollections(data);
    },
    error: function(error) {
      console.error('Error fetching recent collections:', error);
      showError('Failed to load recent collections');
    }
  });
}

function renderRecentCollections(collections) {
  let html = '';
  collections.forEach(collection => {
    html += `
      <div class="recent-item p-3 border rounded-lg">
        <p class="font-medium">${collection.nom}</p>
      </div>
    `;
  });
  $('#recentCollections').html(html);
}

// Utility function to show error messages
function showError(message) {
  const alertHTML = `
    <div class="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg">
      ${message}
    </div>
  `;
  $('body').append(alertHTML);
  setTimeout(() => $('.fixed').remove(), 5000);
}