const form = document.querySelector('.todo');
const list = document.querySelector('.list');
let li = document.querySelectorAll('li');

let items = [];


function addTodo(todo) {
    const item = {
        todo,
        id: Date.now(),
        complete: false
    };
    items.push(item);
    console.log(items);
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function displayTodos() {
    const html = items.
    map(
        item => `<li class="todo-item">
        <input 
            value="${item.id}" 
            type="checkbox"
            ${item.complete ? 'checked' : ''}>
        <span class="itemName" id="${item.id}">${item.todo}</span>
        <button
        class="delete"
        aria-label="Remove ${item.todo}"
        value="${item.id}">&times;</button>
        </li>`
    )
    .join('');
    list.innerHTML = html;
    
}

function handleSubmit(e) {
    e.preventDefault();
    const name = e.currentTarget.item.value;
    if (!name) return;
    addTodo(name);
    e.currentTarget.item.value = '';
}

function deleteItem(id) {
    console.log('deleting');
    items = items.filter(item => item.id !== id);
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function markAsComplete(id) {
    const itemRef = items.find(item => item.id === id);
    itemRef.complete =!itemRef.complete;    
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
    console.log(items);
}


function mirrorToLocalStorage() {
    console.info('Saving items to localstorage');
    localStorage.setItem('items', JSON.stringify(items));
}

function restoreFromLocalStorage() {
    console.info('restoring from ls');    
    const lsItems = JSON.parse(localStorage.getItem('items'));
    if (lsItems.length) {
        items.push(...lsItems);
        list.dispatchEvent(new CustomEvent('itemsUpdated'));
    }
}

form.addEventListener('submit', handleSubmit);
list.addEventListener('itemsUpdated', displayTodos);
list.addEventListener('itemsUpdated', mirrorToLocalStorage);
list.addEventListener('click', function(e) {
    const id = parseInt(e.target.value);
    if(e.target.matches('button')) {
        deleteItem(id);
    }
    if (event.target.matches('input[type="checkbox"]')) {
        markAsComplete(id);
      }
})


restoreFromLocalStorage();


