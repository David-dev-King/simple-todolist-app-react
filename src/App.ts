export interface task {
    id : number;
    text : string;
    completed : boolean;
}
export interface todoList {
    id : number;
    name : string;
    pinned : boolean;
    completed : boolean;
    current : boolean;
    tasks : task[];
}



export var Lists : todoList[] = [];
export var curList : todoList | null;
export var deletedTasks : task[] = [];

export const eventBus = new EventTarget();

export const onLists = new CustomEvent("onLists");
export const onTasks = new CustomEvent("onTasks");



function firstCompletedTaskIndex(tasks : task[]) : number{
    for (let i = 0; i < tasks.length; i++){
        if (tasks[i].completed) return i;
    }
    return tasks.length;
}

export function moveTask(id: number, newIndex: number) {
    if(!curList) return;
    const taskIndex = curList.tasks.findIndex(t => t.id === id);
    if (taskIndex === -1 || newIndex < 0 || newIndex >= curList.tasks.length) return; // Invalid indices
    const [task] = curList.tasks.splice(taskIndex, 1);
    if (task.completed) newIndex = Math.max(newIndex, firstCompletedTaskIndex(curList.tasks));
    else newIndex = Math.min(newIndex, firstCompletedTaskIndex(curList.tasks));
    curList.tasks.splice(newIndex, 0, task);
    saveTasks();
}

export function addList(name : string){
    if (name.trim() == "") return;
    let tempList : todoList = {
        id : Date.now(),
        name : name.trim() == "/date" ? String(new Date().toLocaleDateString('en-UK', {day: 'numeric', month: 'numeric', year: 'numeric'})) : name.trim(),
        pinned : false,
        completed : false,
        current : true,
        tasks : []
    }
    Lists.forEach(list => {
        list.current = false;
    });
    curList = tempList;
    Lists.push(tempList);
    saveTasks();
}

export function editList(id : number, newText : string){
    const list = Lists.find(list => list.id === id);
    if (list) list.name = newText;
    saveTasks();
}

export function deleteList(id : number){
    const list = Lists.find(l => l.id === id);
    const index = Lists.findIndex(l => l.id === id);

    if (list?.current){
        list.current = false;
        if (Lists[index+1]) {
            Lists[index+1].current = true;
            curList = Lists[index+1];
        }
        else if (Lists[index-1]) {
            Lists[index-1].current = true;
            curList = Lists[index-1];
        }
        else curList = null;
    }

    Lists = Lists.filter(l => l.id !== id);
    saveTasks();
}

export function pinList(id : number){
    const list = Lists.find(list => list.id === id);
    if (list) list.pinned = !list.pinned;
    saveLists();
}


export function setCurrentList(id : number){
    const list = Lists.find(list => list.id === id);
    if (list) {
        Lists.forEach(l => l.current = false);
        list.current = true;
        curList = list;
    }
    saveTasks();
}





 export function addTask(text : string, completed? : boolean){
    if(!curList) return;
    if (text.trim() == "") return;
    let temptask : task = {
        id : Date.now(),
        text : text.trim(),
        completed : completed || false,
    };
    // Insert the new task before the first completed task
    let index = firstCompletedTaskIndex(curList.tasks);
    curList.tasks.splice(index, 0, temptask);
    saveTasks();
}




export function editTask(id : number, newText : string){
    if(!curList) return;
    const task = curList.tasks.find(task => task.id === id);
    if (task) task.text = newText;
    saveTasks();
}

export function deleteTask(id : number){
    if(!curList) return;
    deletedTasks.push(...curList.tasks.filter(task => task.id === id));
    curList.tasks = curList.tasks.filter(task => task.id !== id);
    saveTasks();
}

export function completeTask(id : number){
    if(!curList) return;
    const task = curList.tasks.find(task => task.id === id);
    const index = firstCompletedTaskIndex(curList.tasks);
    if (task) task.completed = !task.completed;
    if (task && task.completed){
        curList.tasks = curList.tasks.filter(t => t.id !== id).concat([task]);
    }
    else if (task && !task.completed){
        curList.tasks = curList.tasks.filter(t => t.id !== id);
        curList.tasks.splice(index, 0, task);
    }
    curList.completed = curList.tasks.length > 0 && curList.tasks.every(t => t.completed);
    saveTasks();
}


export function undoDeleteTask(){
    addTask(deletedTasks[deletedTasks.length - 1].text, deletedTasks[deletedTasks.length - 1].completed);
    deletedTasks.pop();
}



function saveLists(){
    console.log("Lists saved!!!");
    eventBus.dispatchEvent(onLists);
    localStorage.setItem("Lists", JSON.stringify(Lists));
    if (Lists.length == 0) return;
}

function loadLists(){
    const _listsJSON : string = String(localStorage.getItem("Lists"));
    const _tempLists : todoList[] = JSON.parse(_listsJSON);
    if (_tempLists != null) Lists = _tempLists;
}


function saveTasks(){
    for (let i = 0; i < Lists.length; i++){
        if (curList && curList.id == Lists[i].id) Lists[i] = curList;
    }
    eventBus.dispatchEvent(onTasks);
    saveLists();
}
export function loadTasks(){
    loadLists();
    for (let i = 0; i < Lists.length; i++){
        if (Lists[i].current == true) curList = Lists[i];
    }
}






loadTasks();
