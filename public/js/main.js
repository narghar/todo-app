const taskInput  = document.querySelectorAll('.task');
const plusButton = document.querySelectorAll('.addTask');
const minusButton = document.querySelectorAll('.removeTask');

// Listeners for add Task
taskInput.forEach(function (input){
    input.addEventListener('input', ()=>{
    input.style.border = '';
    });
});

plusButton.forEach(function(button, index){
    button.addEventListener('click', ()=> {
        let value = {
            name: taskInput[index].value,
            boardId: taskInput[index].dataset.id
        }
        if(value.name){
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
    if(data) {updateList(data)}
  }

  function updateList(data) {
    let list = document.querySelector(`.list-group[data-id="${data.boardId}"]`);
    console.log(list);
    let li = document.createElement("li");
    let button = document.createElement("button");
    button.className = 'btn btn-danger removeTask';
    button.textContent = '-';
    li.dataset.id = data.taskId;
    li.classList.add('list-group-item');
    li.textContent = data.taskText;

    li.appendChild(button);
    list.appendChild(li);

  }

  // Listeners for remove Task
minusButton.forEach(function(button){
  button.addEventListener('click', ()=> {
    let listItem = button.parentNode;
    let ul = listItem.parentNode;
    let value = {
      id: listItem.dataset.id,
      boardId: ul.dataset.id
  }
  removeTask(value, listItem, ul);

  });
})

async function removeTask(value, listItem, ul) {
  console.log(value, listItem, ul);
  const response = await fetch('/tasks/' + value.id, {
    method: "delete",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(value)
  });
  await response.result;
  console.log(response.result);
  if(data) {
    ul.removeChild(listItem);
  }
}


// $(document).ready(function(){
//     $('.delete-task').on('click', function(e){
//         $target = $(e.target);
//         const id = $target.attr('data-id');
//         $.ajax({
//             type:'DELETE',
//             url: '/tasks/'+id,
//             success: function(response){
//                 alert('Deleting Task');
//                 window.location.href='/';
//             },
//             error: function(err){
//                 console.log(err);
//             }
//         });
//     });
// });
