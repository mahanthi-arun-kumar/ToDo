export function ToDoHeader() {}

ToDoHeader.prototype.init = function() {
    let toDoAppTitle=document.createElement("h2");
   toDoAppTitle.innerText="ToDo Today"
  let headerWrapper = document.createElement("div");
  headerWrapper.className = "header";
  let taskInputWrapper=document.createElement("div");
  let taskInput = document.createElement("input");
  taskInput.className = "newTask";
  taskInput.type='text';
  taskInput.placeholder='Task To Do';
  let buttonWrapper=document.createElement("div");
  buttonWrapper.className="buttonWrapper";
  let addButton = document.createElement("button");
  addButton.innerText = "Add";
  let selectAllButton = document.createElement("button");
  selectAllButton.innerText = "CompleteAll";
  // let deSelectAllButton = document.createElement("button");
  // deSelectAllButton.innerText = "DeSelectAll";
  let inCompleteButton = document.createElement("button");
  inCompleteButton.innerText = "inComplete";
  let deleteTasksButton = document.createElement("button");
  deleteTasksButton.innerText = "Delete";
  let completeTasksButton = document.createElement("button");
  completeTasksButton.innerText = "Complete";
  taskInputWrapper.append(taskInput);
    buttonWrapper.append(addButton);
    buttonWrapper.append(selectAllButton);
   // buttonWrapper.append(deSelectAllButton);
   buttonWrapper.append(inCompleteButton);
    buttonWrapper.append(deleteTasksButton);
    buttonWrapper.append(completeTasksButton);
    headerWrapper.append(toDoAppTitle);
    headerWrapper.append(taskInputWrapper);
    headerWrapper.append(buttonWrapper);
//   headerWrapper.append(toDoAppTitle);
//   headerWrapper.append(taskInput);
//   headerWrapper.append(addButtonWrapper);
//   headerWrapper.append(selectAllButton);
//   headerWrapper.append(deSelectAllButton);
//   headerWrapper.append(deleteTasksButton);
//   headerWrapper.append(completeTasksButton);

  taskInput.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      module.publish("Add", taskInput.value);
      taskInput.value = "";
    }
  });
  addButton.addEventListener("click", function() {
    module.publish("Add", taskInput.value);
    taskInput.value = "";
  });
  selectAllButton.addEventListener("click", function() {
    module.publish("SelectAll", null);
  });
  // deSelectAllButton.addEventListener("click", function() {
  //   module.publish("DeSelectAll", null);
  // });
  inCompleteButton.addEventListener("click", function() {
    module.publish("inCompleteSelectedTasks", null);
  });
  deleteTasksButton.addEventListener("click", function() {
    module.publish("DeleteTasks", null);
  });

  completeTasksButton.addEventListener("click", function() {
    module.publish("CompleteTasks", null);
  });
  return headerWrapper;
};

function ToDoContainer(){};
ToDoContainer.prototype.init = function() {
    let containerWrapper = document.createElement("div");
    containerWrapper.className = "toDoContainer";
    this.inCompletedTasksList = document.createElement("div");
    this.inCompletedTasksList.className = "inCompletedTasks";
    this.completedTasksList = document.createElement("div");
    this.completedTasksList.className = "completedTasks";
    containerWrapper.append(this.inCompletedTasksList);
    containerWrapper.append(this.completedTasksList);
  
    return containerWrapper;
  };
  ToDoContainer.prototype.renderTasks = function(tasks) {
    localStorage.setItem("tasks",JSON.stringify(tasks));
   // let realTasks=JSON.parse(localStorage.getItem("tasks"));
   let realTasks=tasks;
    console.log(tasks,realTasks);
    this.inCompletedTasksList.innerHTML = "";
    this.completedTasksList.innerHTML = "";
    let toDoTask = new ToDoTask(); // see this
    for (let i = 0; i < realTasks.length; i++) {
      if (realTasks[i].checkBoxStatus) {
        this.completedTasksList.append(toDoTask.init(realTasks[i]));
      } else {
        this.inCompletedTasksList.append(toDoTask.init(realTasks[i]));
      }
    }
    
  };
  export function ToDoTask() {}
ToDoTask.prototype.init = function(task) {
  let listItem = document.createElement("li");
  listItem.className = "listItem";
  let checkBox = document.createElement("input");
  checkBox.className="checkBox";
  let label = document.createElement("div");
  label.className = "listItemLabel";
  let deleteButton = document.createElement("button");
  deleteButton.innerText = "Delete";
  deleteButton.className = "delete";
  let duplicateButton = document.createElement("button");
  duplicateButton.innerText = "Duplicate";
  duplicateButton.className = "duplicate";
  deleteButton.addEventListener("click", function() {
    module.publish("Delete", task);
  });

  label.innerText = task.taskInput;
  checkBox.type = "checkbox";
  checkBox.className = "checkBox";
  checkBox.checked = task.checkBoxStatus;
  checkBox.addEventListener("click", function(event) {
    if (event.target.className === "checkBox") {
      if (event.target.checked) {
        task.checkBoxStatus = true;
        //  updateTask(task, task.checkBoxStatus);
      } else {
        task.checkBoxStatus = false;
        // updateTask(task, task.checkBoxStatus);
      }
    }
  });
  duplicateButton.addEventListener("click", function() { //check this here cpuld i pass reference of a function too
    module.publish("Duplicate", task);
  });

  listItem.appendChild(checkBox);
  listItem.appendChild(label);
  listItem.appendChild(deleteButton);
  listItem.appendChild(duplicateButton);
  return listItem;
};
let subscribers={};
let module = {
    publish(event, data) {
      if (!subscribers[event]) return;
      subscribers[event].forEach(subscriberCallback => subscriberCallback(data));
    },
  
    subscribe(event, callback) {
      if (!subscribers[event]) {
        subscribers[event] = [];
      }
      subscribers[event].push(callback);
    }
  };
  export function ToDoManager() {
  //  console.log(JSON.parse(localStorage.getItem("tasks")));
   // this.tasks =JSON.parse(localStorage.getItem("tasks"));
   this.tasks=[];
    this.toDoWrapper = document.getElementById("app");
    this.toDoHeader = new ToDoHeader();
    const header = this.toDoHeader.init();
    module.subscribe("Add", this.addTask.bind(this));
    module.subscribe("SelectAll", this.selectAllTasks.bind(this));
    module.subscribe("DeSelectAll", this.deSelectAllTasks.bind(this));
    module.subscribe("inCompleteSelectedTasks", this.inCompleteTasks.bind(this));
    module.subscribe("DeleteTasks", this.deleteSelectedTasks.bind(this));
    module.subscribe("CompleteTasks", this.completeTasks.bind(this));
    module.subscribe("Delete", this.deleteTask.bind(this));
    module.subscribe("Duplicate", this.duplicateTask.bind(this));
    this.toDoContainer = new ToDoContainer();
    const container = this.toDoContainer.init();
    this.toDoWrapper.append(header);
    this.toDoWrapper.append(container);
  }
  
  ToDoManager.prototype.addTask = function(taskInput) {
    if (taskInput) {
      let task = {};
      task.taskInput = taskInput;
      task.checkBoxStatus = false;
      this.tasks.push(task);
      this.toDoContainer.renderTasks(this.tasks); //do not render whole list,make the use of functions,cyclic dependency ,garbage collection,memory leak,pubs hub pattern in js
    }
  };
  ToDoManager.prototype.deleteTask = function(task) {
    let taskIndex = this.tasks.indexOf(task);
    this.tasks.splice(taskIndex, 1);
    this.toDoContainer.renderTasks(this.tasks);
  };
  ToDoManager.prototype.duplicateTask = function(task) {
    let taskIndex = this.tasks.indexOf(task);
    let duplicateTask = {};
    duplicateTask.taskInput = task.taskInput;
    duplicateTask.checkBoxStatus = task.checkBoxStatus;
    this.tasks.splice(taskIndex + 1, 0, duplicateTask);
    this.toDoContainer.renderTasks(this.tasks);
  };
  ToDoManager.prototype.selectAllTasks = function() {
    for (let index = 0; index < this.tasks.length; index++) {
      this.tasks[index].checkBoxStatus = true;
    }
    this.toDoContainer.renderTasks(this.tasks);
  };
  ToDoManager.prototype.deleteSelectedTasks = function() {
    this.tasks = this.tasks.filter(task => task.checkBoxStatus !== true);
    console.log(this.tasks);
    this.toDoContainer.renderTasks(this.tasks);
  };
  ToDoManager.prototype.deSelectAllTasks = function() {
    for (let index = 0; index < this.tasks.length; index++) {
      this.tasks[index].checkBoxStatus = false;
    }
    this.toDoContainer.renderTasks(this.tasks);
  };
  ToDoManager.prototype.inCompleteTasks = function(){
    for (let index = 0; index < this.tasks.length; index++) {
      if(this.tasks[index].checkBoxStatus === true)
      this.tasks[index].checkBoxStatus = false;
    }
    this.toDoContainer.renderTasks(this.tasks);
  }
  ToDoManager.prototype.completeTasks = function() {
    this.toDoContainer.renderTasks(this.tasks);
  };


function toDoApp() {
    let toDoManager = new ToDoManager();
  }
  toDoApp();
