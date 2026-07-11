// Main Variables
var contactsListArray = [];
var currentFilter = 'all';

// HTML Elements
var cardsContainer = document.getElementById('contactsList');
var noDataAlert = document.getElementById('noDataAlert');
var totalCounter = document.getElementById('totalCounter');

var editIndexInput = document.getElementById('editIndex');
var nameInput = document.getElementById('inputName');
var phoneInput = document.getElementById('inputPhone');
var emailInput = document.getElementById('inputEmail');
var groupInput = document.getElementById('inputGroup');
var favInput = document.getElementById('inputFav');
var searchBox = document.getElementById('searchBox');
var formTitle = document.getElementById('formTitle');

var btnShowAll = document.getElementById('btnShowAll');
var btnShowFav = document.getElementById('btnShowFav');

// Load Data from LocalStorage when page opens
if (localStorage.getItem('my_saved_contacts') !== null) {
  var savedData = localStorage.getItem('my_saved_contacts');
  contactsListArray = JSON.parse(savedData);
}

showContacts();

// Function to Render Data
function showContacts() {
  var htmlCards = '';
  var searchWord = searchBox.value.toLowerCase().trim();
  var visibleCount = 0;

  for (var i = 0; i < contactsListArray.length; i++) {
    var person = contactsListArray[i];

    // Filter by Favorites
    if (currentFilter === 'fav' && person.isFav === false) {
      continue;
    }

    // Filter by Search Word
    var nameMatch = person.name.toLowerCase().indexOf(searchWord) !== -1;
    var phoneMatch = person.phone.toLowerCase().indexOf(searchWord) !== -1;

    if (searchWord !== '' && !nameMatch && !phoneMatch) {
      continue;
    }

    visibleCount = visibleCount + 1;

    var starClass = 'fav-btn';
    if (person.isFav === true) {
      starClass = 'fav-btn is-active';
    }

    htmlCards = htmlCards + `
      <div class="col-12 col-md-6 col-lg-4">
        <div class="custom-card">
          <button class="${starClass}" onclick="toggleFav(${i})">
            <i class="bi bi-star-fill"></i>
          </button>
          
          <div class="card-title-name">${person.name}</div>
          <span class="category-tag">${person.group}</span>
          
          <div class="info-line">
            <i class="bi bi-telephone"></i> ${person.phone}
          </div>
          <div class="info-line">
            <i class="bi bi-envelope"></i> ${person.email}
          </div>

          <div class="card-btns d-flex gap-2">
            <button class="btn btn-sm btn-outline-info w-50" onclick="startEdit(${i})">
              <i class="bi bi-pencil"></i> Edit
            </button>
            <button class="btn btn-sm btn-outline-danger w-50" onclick="deleteContact(${i})">
              <i class="bi bi-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>
    `;
  }

  cardsContainer.innerHTML = htmlCards;
  totalCounter.textContent = contactsListArray.length + ' Contacts';

  // Empty message check
  if (visibleCount === 0) {
    noDataAlert.classList.remove('d-none');
  } else {
    noDataAlert.classList.add('d-none');
  }
}

// Reset Form fields
function prepareAddForm() {
  editIndexInput.value = '';
  nameInput.value = '';
  phoneInput.value = '';
  emailInput.value = '';
  groupInput.value = '';
  favInput.checked = false;
  formTitle.textContent = 'Add New Contact';
}

// Save or Update Contact
function saveData() {
  var nameValue = nameInput.value.trim();
  var phoneValue = phoneInput.value.trim();
  var emailValue = emailInput.value.trim();
  var groupValue = groupInput.value;
  var favValue = favInput.checked;

  // Simple Validation
  if (nameValue === '' || phoneValue === '' || groupValue === '') {
    alert('Please fill in Name, Phone, and Group fields!');
    return;
  }

  var contactObject = {
    name: nameValue,
    phone: phoneValue,
    email: emailValue,
    group: groupValue,
    isFav: favValue
  };

  var editIdx = editIndexInput.value;

  if (editIdx === '') {
    // Add new
    contactsListArray.push(contactObject);
  } else {
    // Update existing
    contactsListArray[editIdx] = contactObject;
  }

  // Save to LocalStorage
  localStorage.setItem('my_saved_contacts', JSON.stringify(contactsListArray));

  showContacts();

  // Close Bootstrap Modal
  var modalElement = document.getElementById('contactModal');
  var modalInstance = bootstrap.Modal.getInstance(modalElement);
  modalInstance.hide();
}

// Delete Contact
function deleteContact(index) {
  var confirmDelete = confirm('Are you sure you want to delete this contact?');
  if (confirmDelete === true) {
    contactsListArray.splice(index, 1);
    localStorage.setItem('my_saved_contacts', JSON.stringify(contactsListArray));
    showContacts();
  }
}

// Edit Contact Form Setup
function startEdit(index) {
  var selectedPerson = contactsListArray[index];

  editIndexInput.value = index;
  nameInput.value = selectedPerson.name;
  phoneInput.value = selectedPerson.phone;
  emailInput.value = selectedPerson.email;
  groupInput.value = selectedPerson.group;
  favInput.checked = selectedPerson.isFav;

  formTitle.textContent = 'Edit Contact';

  var modalElement = document.getElementById('contactModal');
  var modalInstance = new bootstrap.Modal(modalElement);
  modalInstance.show();
}

// Toggle Favorite Status
function toggleFav(index) {
  if (contactsListArray[index].isFav === true) {
    contactsListArray[index].isFav = false;
  } else {
    contactsListArray[index].isFav = true;
  }

  localStorage.setItem('my_saved_contacts', JSON.stringify(contactsListArray));
  showContacts();
}

// Search
function searchData() {
  showContacts();
}

// Change Filter (All / Favorites)
function changeFilter(type) {
  currentFilter = type;

  if (type === 'all') {
    btnShowAll.classList.add('active');
    btnShowFav.classList.remove('active');
  } else {
    btnShowAll.classList.remove('active');
    btnShowFav.classList.add('active');
  }

  showContacts();
}