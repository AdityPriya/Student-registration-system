const form = document.getElementById('studentForm');
const table = document.getElementById('studentTable');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');

// Correct input references
const nameInput = document.getElementById('name');
const studentIdInput = document.getElementById('studentId');
const emailInput = document.getElementById('email');
const contactInput = document.getElementById('contact');

let students = JSON.parse(localStorage.getItem('students')) || [];
let editIndex = null;

/* Save Data */
function saveData() {
  localStorage.setItem('students', JSON.stringify(students));
}

/* Toast */
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.innerText = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

/* Render Table */
function renderTable() {
  let filtered = [...students];

  // Search
  const search = searchInput.value.toLowerCase();
  filtered = filtered.filter(s => s.name.toLowerCase().includes(search));

  // Sort
  const sort = sortSelect.value;
  if (sort === 'nameAsc') filtered.sort((a,b)=>a.name.localeCompare(b.name));
  if (sort === 'nameDesc') filtered.sort((a,b)=>b.name.localeCompare(a.name));
  if (sort === 'idAsc') filtered.sort((a,b)=>a.id - b.id);
  if (sort === 'idDesc') filtered.sort((a,b)=>b.id - a.id);

  table.innerHTML = '';

  filtered.forEach((s, index) => {
    table.innerHTML += `
      <tr>
        <td>${s.name}</td>
        <td>${s.id}</td>
        <td>${s.email}</td>
        <td>${s.contact}</td>
        <td>
          <button onclick="editStudent(${index})">Edit</button>
          <button onclick="deleteStudent(${index})">Delete</button>
        </td>
      </tr>`;
  });
}

/* Validation */
function validate(name, id, email, contact) {
  if (!/^[A-Za-z ]+$/.test(name)) return showToast("Invalid Name");
  if (!/^[0-9]+$/.test(id)) return showToast("ID must be numbers");
  if (!/^[0-9]{10,}$/.test(contact)) return showToast("Contact must be at least 10 digits");
  if (!email.includes('@')) return showToast("Invalid Email");
  return true;
}

/* Add / Edit */
form.addEventListener('submit', function(e) {
  e.preventDefault();

  const name = nameInput.value.trim();
  const id = studentIdInput.value.trim();
  const email = emailInput.value.trim();
  const contact = contactInput.value.trim();

  if (!name || !id || !email || !contact) {
    showToast("All fields required");
    return;
  }

  if (!validate(name, id, email, contact)) return;

  const student = { name, id, email, contact };

  if (editIndex === null) {
    students.push(student);
    showToast("Student Added");
  } else {
    students[editIndex] = student;
    editIndex = null;
    showToast("Student Updated");
  }

  saveData();
  renderTable();
  form.reset();
});

/* Delete */
function deleteStudent(index) {
  students.splice(index, 1);
  saveData();
  renderTable();
  showToast("Student Deleted");
}

/* Edit */
function editStudent(index) {
  const s = students[index];

  nameInput.value = s.name;
  studentIdInput.value = s.id;
  emailInput.value = s.email;
  contactInput.value = s.contact;

  editIndex = index;
}

/* Search & Sort */
searchInput.addEventListener('input', renderTable);
sortSelect.addEventListener('change', renderTable);

/* CSV Export */
function downloadCSV() {
  let csv = "Name,ID,Email,Contact\n";

  students.forEach(s => {
    csv += `${s.name},${s.id},${s.email},${s.contact}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = "students.csv";
  a.click();

  showToast("CSV Downloaded");
}

/* Dark Mode */
function toggleDarkMode() {
  document.body.classList.toggle('dark');
}

/* Initial Load */
renderTable();
