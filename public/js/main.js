const taskInput = document.querySelectorAll('.task');
const plusButton = document.querySelectorAll('.addTask');
const tasksLists = document.querySelectorAll('.list-group');
const boards = document.querySelectorAll('.row');

boards.forEach(function(board) {board.addEventListener('click', (e) => {
  if (event.target.className.includes("removeBoard")) {
    deleteBoard(event.target.getAttribute("data-id"))   
  }
  else if (event.target.className.includes("addCoworker")) {
    addCoworker(event.target.getAttribute("data-id"))
  }
  else if (event.target.className.includes("completeTask")) {
    completeTask(event);
  }
})
});

async function completeTask(event) {
  let listItem = event.target.parentNode;
  let ul = listItem.parentNode;
  let value = {
    id: listItem.dataset.id,
    boardId: ul.dataset.id
  }
  console.log(value);
  const response = await fetch('/tasks/complete/', {
    method: "put",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(value)
  });
  location.reload(true);
}


async function addCoworker(boardId) {
  const user = prompt("Yours co-worker nick:");
  const addUserToBoard = {
    boardId: boardId,
    user: user
  }
  const response = await fetch('/boards/coworker/', {
    method: "put",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(addUserToBoard)
  });
  location.reload(true);
}

async function deleteBoard(boardId) {
  const boardToDelete = {
    boardId: boardId
  }
  const response = await fetch('/boards/' + boardId, {
    method: "delete",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(boardToDelete)
  });
  console.log(response);
  location.reload(true);
}

// Listeners for add Task
taskInput.forEach(function (input) {
  input.addEventListener('input', () => {
    input.style.border = '';
  });
});

plusButton.forEach(function (button, index) {
  button.addEventListener('click', () => {
    let value = {
      name: taskInput[index].value,
      boardId: taskInput[index].dataset.id
    }
    if (value.name) {
      taskInput[index].value = '';
      addTask(value);
    } else {
      taskInput[index].style.border = '2px solid red';
    }

  });
})

async function addTask(value) {

  const response = await fetch('/tasks/add', {
    method: "post",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(value)
  });
  const data = await response.json();
  console.log(data);
  if (data) {
    location.reload(true);
    //updateList(data)
  }
}

function updateList(data) {
  let list = document.querySelector(`.list-group[data-id="${data.boardId}"]`);
  console.log(list);
  let li = document.createElement("li");
  let button = document.createElement("button");
  button.className = 'btn btn-danger removeTask';
  button.textContent = '-';
  const checkbox = document.createElement("checkbox");
  checkbox.className = 'form-check-input position-static complete-task';
  li.dataset.id = data.taskId;
  li.classList.add('list-group-item');
  li.textContent = data.taskText;
  li.appendChild(checkbox);
  li.appendChild(button);
  list.appendChild(li);

}

// Listeners for remove Task
tasksLists.forEach(function(list) {
  list.addEventListener('click', function(el) {
    if (el.target.classList.contains('removeTask')) {
      let listItem = el.target.parentNode;
      let ul = listItem.parentNode;
      let value = {
        id: listItem.dataset.id,
        boardId: ul.dataset.id
      }
      removeTask(value, listItem, ul);
    }
  });
});


// minusButton.forEach(function(button){
//   button.addEventListener('click', ()=> {
//     let listItem = button.parentNode;
//     let ul = listItem.parentNode;
//     let value = {
//       id: listItem.dataset.id,
//       boardId: ul.dataset.id
//   }
//   removeTask(value, listItem, ul);

//   });
// });

async function removeTask(value, listItem, ul) {
  const response = await fetch('/tasks/' + value.id, {
    method: "delete",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(value)
  });
  const res = await response.json();
  console.log(res);
  if (res.message === 'Removed') {
    ul.removeChild(listItem);
  }
}

