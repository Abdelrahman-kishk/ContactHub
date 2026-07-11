var contacts = [];
var currentView = 'all';
var myModal = new bootstrap.Modal(document.getElementById('contactModal'));

// Get all elements
var contactsGrid = document.getElementById('contactsGrid');
var emptyState = document.getElementById('emptyState');
var emptyStateText = document.getElementById('emptyStateText');
var totalCountBadge = document.getElementById('totalCountBadge');

var contactIdInput = document.getElementById('contactId');
var contactNameInput = document.getElementById('contactName');
var contactPhoneInput = document.getElementById('contactPhone');
var contactEmailInput = document.getElementById('contactEmail');
var contactCategoryInput = document.getElementById('contactCategory');
var contactFavoriteInput = document.getElementById('contactFavorite');
var modalTitleText = document.getElementById('modalTitleText');
var searchInput = document.getElementById('searchInput');

// Load contacts on startup
if (localStorage.getItem('my_contacts') !== null) {
  contacts = JSON.parse(localStorage.getItem('my_contacts'));
}
displayContacts();

function displayContacts() {
  var cartona = '';
  var searchValue = searchInput.value.toLowerCase().trim();
  var count = 0;

  for (var i = 0; i < contacts.length; i++) {
    var item = contacts[i];

    // Filter view (all vs favorites)
    if (currentView === 'favorites' && !item.favorite) {
      continue;
    }

    // Filter search
    var nameMatch = item.name.toLowerCase().includes(searchValue);
    var phoneMatch = item.phone.toLowerCase().includes(searchValue);
    var emailMatch = item.email.toLowerCase().includes(searchValue);

    if (searchValue !== '' && !nameMatch && !phoneMatch && !emailMatch) {
      continue;
    }

    count++;

    var firstChar = item.name.charAt(0).toUpperCase();
    var starIcon = item.favorite ? 'bi-star-fill' : 'bi-star';
    var starClass = item.favorite ? 'favorite-toggle is-favorite' : 'favorite-toggle';

    cartona += `
      <div class="col-12 col-md-6 col-lg-4 contact-card-wrap">
        <div class="contact-card">
          <div class="card-tab">${firstChar}</div>
          <div class="card-top-row">
            <button type="button" class="${starClass}" onclick="toggleFavorite(${i})">
              <i class="bi ${starIcon}"></i>
            </button>
          </div>
          <div class="contact-name">${item.name}</div>
          <span class="contact-category">${item.category}</span>
          <div class="contact-detail-line">
            <i class="bi bi-telephone-fill"></i>
            <a href="tel:${item.phone}">${item.phone}</a>
          </div>
          <div class="contact-detail-line">
            <i class="bi bi-envelope-fill"></i>
            <a href="mailto:${item.email}">${item.email}</a>
          </div>
          <div class="card-actions">
            <button type="button" class="btn btn-edit-contact" onclick="editContact(${i})">
              <i class="bi bi-pencil-fill"></i> Edit
            </button>
            <button type="button" class="btn btn-delete-contact" onclick="deleteContact(${i})">
              <i class="bi bi-trash-fill"></i> Delete
            </button>
          </div>
        </div>
      </div>
    `;
  }

  contactsGrid.innerHTML = cartona;
  totalCountBadge.textContent = contacts.length + ' contacts';

  // Empty state handling
  if (count === 0) {
    emptyState.classList.remove('d-none');
    if (contacts.length === 0) {
      emptyStateText.textContent = 'Add your first contact to get started.';
    } else if (currentView === 'favorites') {
      emptyStateText.textContent = 'No favorites yet.';
    } else {
      emptyStateText.textContent = 'No contacts match your search.';
    }
  } else {
    emptyState.classList.add('d-none');
  }
}

function openAddModal() {
  clearForm();
  modalTitleText.textContent = 'Add Contact';
  contactIdInput.value = '';
}

function clearForm() {
  contactNameInput.value = '';
  contactPhoneInput.value = '';
  contactEmailInput.value = '';
  contactCategoryInput.value = '';
  contactFavoriteInput.checked = false;
}

function saveContact() {
  var name = contactNameInput.value.trim();
  var phone = contactPhoneInput.value.trim();
  var email = contactEmailInput.value.trim();
  var category = contactCategoryInput.value;
  var favorite = contactFavoriteInput.checked;

  // Basic Validation
  if (name === '' || phone === '' || email === '' || category === '') {
    alert('Please fill all required fields!');
    return;
  }

  var index = contactIdInput.value;

  var newContact = {
    name: name,
    phone: phone,
    email: email,
    category: category,
    favorite: favorite
  };

  if (index === '') {
    // Add New
    contacts.push(newContact);
  } else {
    // Update
    contacts[index] = newContact;
  }

  localStorage.setItem('my_contacts', JSON.stringify(contacts));
  displayContacts();
  myModal.hide();
}

function deleteContact(index) {
  if (confirm('Are you sure you want to delete ' + contacts[index].name + '?')) {
    contacts.splice(index, 1);
    localStorage.setItem('my_contacts', JSON.stringify(contacts));
    displayContacts();
  }
}

function editContact(index) {
  var contact = contacts[index];

  contactIdInput.value = index;
  contactNameInput.value = contact.name;
  contactPhoneInput.value = contact.phone;
  contactEmailInput.value = contact.email;
  contactCategoryInput.value = contact.category;
  contactFavoriteInput.checked = contact.favorite;

  modalTitleText.textContent = 'Edit Contact';
  myModal.show();
}

function toggleFavorite(index) {
  contacts[index].favorite = !contacts[index].favorite;
  localStorage.setItem('my_contacts', JSON.stringify(contacts));
  displayContacts();
}

function searchContacts() {
  displayContacts();
}

function filterView(view) {
  currentView = view;
  displayContacts();
}