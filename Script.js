const LOCAL_STORAGE_KEY = 'todoAppData';
let data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {
  lists: [],
  selectedListId: null
};

// DOM Elements
const listsContainer = document.getElementById('lists');
const listTitle = document.getElementById('list-title');
const todoItems = document.getElementById('todo-items');
const newListForm = document.getElementById('new-list-form');
const newItemForm = document.getElementById('new-item-form');
const todoSection = document.getElementById('todo-section');
const newListInput = document.getElementById('new-list-input');
const newItemInput = document.getElementById('new-item-input');
const backButton = document.getElementById('back-to-lists');

// List creation
newListForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = newListInput.value.trim();
  if (name === '') return;
  const newList = { id: Date.now().toString(), name, items: [] };
  data.lists.push(newList);
  data.selectedListId = newList.id;
  newListInput.value = '';
  saveAndRender();
});

// Task creation
newItemForm.addEventListener('submit', e => {
  e.preventDefault();
  const text = newItemInput.value.trim();
  if (text === '') return;
  const selectedList = getSelectedList();
  if (!selectedList) return;
  selectedList.items.push({ id: Date.now().toString(), text, completed: false });
  newItemInput.value = '';
  saveAndRender();
});

// Save and render
function saveAndRender() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  render();
}

// Render everything
function render() {
  const selectedList = getSelectedList();

  if (selectedList) {
    // Show tasks, hide list selector
    document.getElementById('lists-section').style.display = 'none';
    todoSection.style.display = 'block';
    backButton.style.display = 'inline-block';
    renderTodos();
  } else {
    // Show list selector, hide tasks
    document.getElementById('lists-section').style.display = 'block';
    todoSection.style.display = 'none';
    backButton.style.display = 'none';
  }

  renderLists();
}


// Show/hide todo section
function toggleTodoVisibility() {
  const selectedList = getSelectedList();
  todoSection.style.display = selectedList ? 'block' : 'none';
}

// Render lists
function renderLists() {
  listsContainer.innerHTML = '';
  data.lists.forEach(list => {
    const li = document.createElement('li');

    const nameSpan = document.createElement('span');
    nameSpan.textContent = list.name;
    nameSpan.classList.add('list-name');
    li.appendChild(nameSpan);

    // Edit button with tooltip
    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️';
    editBtn.classList.add('edit-btn');
    editBtn.title = 'Rename List'; // <-- Tooltip for list edit
    editBtn.style.marginLeft = '8px';
    editBtn.addEventListener('click', e => {
      e.stopPropagation();
      const newName = prompt('Rename list:', list.name);
      if (newName) {
        list.name = newName.trim();
        saveAndRender();
      }
    });
    li.appendChild(editBtn);

    // Delete button with tooltip
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.title = 'Delete List'; // <-- Tooltip for list delete
    deleteBtn.style.marginLeft = '5px';
    deleteBtn.addEventListener('click', e => {
      e.stopPropagation();
      data.lists = data.lists.filter(l => l.id !== list.id);
      if (data.selectedListId === list.id) {
        data.selectedListId = null;
      }
      saveAndRender();
    });
    li.appendChild(deleteBtn);

    // Highlight selected
    if (list.id === data.selectedListId) {
      li.classList.add('active');
    }

    // Selecting a list
    li.addEventListener('click', () => {
      data.selectedListId = list.id;
      saveAndRender();
    });

    listsContainer.appendChild(li);
  });
}


// Render todos
function renderTodos() {
  const selectedList = getSelectedList();
  if (!selectedList) {
    listTitle.textContent = '';
    todoItems.innerHTML = '';
    return;
  }

  listTitle.textContent = selectedList.name;
  todoItems.innerHTML = '';

  selectedList.items.forEach(item => {
    const li = document.createElement('li');

    // Task text span
    const textSpan = document.createElement('span');
    textSpan.textContent = item.text;
    if (item.completed) textSpan.classList.add('completed');
    textSpan.addEventListener('click', () => {
      item.completed = !item.completed;
      saveAndRender();
    });
    li.appendChild(textSpan);

    // Edit task button
    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️';
    editBtn.classList.add('edit-btn');
    editBtn.title = 'Edit Item'; // Tooltip
    editBtn.style.marginLeft = '8px';
    editBtn.addEventListener('click', () => {
      const newText = prompt('Edit task:', item.text);
      if (newText) {
        item.text = newText.trim();
        saveAndRender();
      }
    });
    li.appendChild(editBtn);

    // Delete task button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.title = 'Delete Item'; // Tooltip
    deleteBtn.style.marginLeft = '5px';
    deleteBtn.addEventListener('click', () => {
      selectedList.items = selectedList.items.filter(i => i.id !== item.id);
      saveAndRender();
    });
    li.appendChild(deleteBtn);

    todoItems.appendChild(li);
  });
}



// Helper
function getSelectedList() {
  return data.lists.find(list => list.id === data.selectedListId);
}

// Initial render
render();

backButton.addEventListener('click', () => {
  data.selectedListId = null;
  saveAndRender();
});

