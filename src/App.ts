/**
 * @typedef {object} task
 * @description Represents a single to-do task.
 * @property {number} id A unique identifier for the task.
 * @property {string} text The text content of the task.
 * @property {boolean} completed The completion status of the task.
 */
export interface task {
    id: number;
    text: string;
    completed: boolean;
}

/**
 * @typedef {object} todoList
 * @description Represents a to-do list, which contains a collection of tasks.
 * @property {number} id A unique identifier for the list.
 * @property {string} name The name of the list.
 * @property {boolean} pinned Indicates whether the list is pinned to the top.
 * @property {boolean} completed Indicates whether all tasks in the list are completed.
 * @property {boolean} current Indicates if this is the currently selected list.
 * @property {task[]} tasks An array of task objects within the list.
 */
export interface todoList {
    id: number;
    name: string;
    pinned: boolean;
    completed: boolean;
    current: boolean;
    tasks: task[];
}




/**
 * @type {todoList[]}
 * @description An array containing all the to-do lists in the application.
 */
export var Lists: todoList[] = [];

/**
 * @type {todoList | null}
 * @description The currently selected to-do list.
 */
export var curList: todoList | null;

/**
 * @type {task[]}
 * @description A temporary array to store recently deleted tasks for the undo functionality.
 */
export var deletedTasks: task[] = [];

/**
 * @type {EventTarget}
 * @description A global event bus for communication between components.
 */
export const eventBus = new EventTarget();

/**
 * @type {CustomEvent}
 * @description A custom event dispatched when the list of to-do lists changes.
 */
export const onLists = new CustomEvent("onLists");

/**
 * @type {CustomEvent}
 * @description A custom event dispatched when the tasks in the current list change.
 */
export const onTasks = new CustomEvent("onTasks");

/**
 * @type {CustomEvent}
 * @description A custom event dispatched when the user's authentication token expires.
 */
export const onTokenExpire = new CustomEvent("onTokenExpire");

/**
 * @type {string}
 * @description The ID of the currently logged-in user.
 */
let userID : string = "";

/**
 * @function getUserID
 * @description Retrieves the ID of the currently logged-in user.
 * @returns {string} The user ID.
 */
export function getUserID(): string {
    return userID;
}

/**
 * @function setUserID
 * @description Sets the ID of the currently logged-in user.
 * @param {string} id The user ID to set.
 * @returns {void}
 */
export function setUserID(id: string): void {
    userID = id;
}



// Helpers for moving tasks while maintaining completed task order

/**
 * @function firstCompletedTaskIndex
 * @description Finds the index of the first completed task in an array.
 * @param {task[]} tasks The array of tasks to search.
 * @returns {number} The index of the first completed task, or the length of the array if no completed tasks are found.
 */
function firstCompletedTaskIndex(tasks: task[]): number {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].completed) return i;
    }
    return tasks.length;
}

/**
 * @function moveTask
 * @description Moves a task to a new index within the current list, maintaining the order of completed tasks.
 * @param {number} id The ID of the task to move.
 * @param {number} newIndex The target index for the task.
 * @returns {void}
 */
export function moveTask(id: number, newIndex: number) {
    if (!curList) return;
    const taskIndex = curList.tasks.findIndex(t => t.id === id);
    if (taskIndex === -1 || newIndex < 0 || newIndex >= curList.tasks.length) return;
    const [task] = curList.tasks.splice(taskIndex, 1);
    if (task.completed) newIndex = Math.max(newIndex, firstCompletedTaskIndex(curList.tasks));
    else newIndex = Math.min(newIndex, firstCompletedTaskIndex(curList.tasks));
    curList.tasks.splice(newIndex, 0, task);
    saveTasks();
}





// List Management

/**
 * @function addList
 * @description Creates and adds a new to-do list to the collection.
 * @param {string} name The name for the new list.
 * @returns {void}
 */
export function addList(name: string) {
    if (name.trim() == "") return;
    let tempList: todoList = {
        id: Date.now(),
        name: name.trim() == "/date" ? String(new Date().toLocaleDateString('en-UK', { day: 'numeric', month: 'numeric', year: 'numeric' })) : name.trim(),
        pinned: false,
        completed: false,
        current: true,
        tasks: []
    }
    Lists.forEach(list => {
        list.current = false;
    });
    curList = tempList;
    Lists.push(tempList);
    deletedTasks = [];
    saveTasks();
}



/**
 * @function editList
 * @description Edits the name of a specified list.
 * @param {number} id The ID of the list to edit.
 * @param {string} newText The new name for the list.
 * @returns {void}
 */
export function editList(id: number, newText: string) {
    const list = Lists.find(list => list.id === id);
    if (list) list.name = newText;
    saveTasks();
}



/**
 * @function deleteList
 * @description Deletes a list by its ID and handles updating the current list selection.
 * @param {number} id The ID of the list to delete.
 * @returns {void}
 */
export function deleteList(id: number) {
    const list = Lists.find(l => l.id === id);
    const index = Lists.findIndex(l => l.id === id);

    if (list?.current) {
        list.current = false;
        if (Lists[index + 1]) {
            Lists[index + 1].current = true;
            curList = Lists[index + 1];
        } else if (Lists[index - 1]) {
            Lists[index - 1].current = true;
            curList = Lists[index - 1];
        } else curList = null;
    }

    Lists = Lists.filter(l => l.id !== id);
    saveTasks();
}



/**
 * @function pinList
 * @description Toggles the pinned status of a list.
 * @param {number} id The ID of the list to pin or unpin.
 * @returns {void}
 */
export function pinList(id: number) {
    const list = Lists.find(list => list.id === id);
    if (list) list.pinned = !list.pinned;
    saveLists();
}



/**
 * @function setCurrentList
 * @description Sets a list as the current selected list.
 * @param {number} id The ID of the list to set as current.
 * @returns {void}
 */
export function setCurrentList(id: number) {
    const list = Lists.find(list => list.id === id);
    if (list) {
        Lists.forEach(l => l.current = false);
        list.current = true;
        curList = list;
    }
    deletedTasks = [];
    saveTasks();
}







// Task Management

/**
 * @function addTask
 * @description Adds a new task to the current to-do list.
 * @param {string} text The text content for the new task.
 * @param {boolean} [completed] An optional boolean to set the initial completion status.
 * @returns {void}
 */
export function addTask(text: string, completed?: boolean) {
    if (!curList) return;
    if (text.trim() == "") return;
    let temptask: task = {
        id: Date.now(),
        text: text.trim(),
        completed: completed || false,
    };
    let index = firstCompletedTaskIndex(curList.tasks);
    curList.tasks.splice(index, 0, temptask);
    saveTasks();
}



/**
 * @function editTask
 * @description Edits the text of a task within the current list.
 * @param {number} id The ID of the task to edit.
 * @param {string} newText The new text content for the task.
 * @returns {void}
 */
export function editTask(id: number, newText: string) {
    if (!curList) return;
    const task = curList.tasks.find(task => task.id === id);
    if (task) task.text = newText;
    saveTasks();
}



/**
 * @function deleteTask
 * @description Deletes a task from the current list and adds it to a temporary deleted tasks list for undo functionality.
 * @param {number} id The ID of the task to delete.
 * @returns {void}
 */
export function deleteTask(id: number) {
    if (!curList) return;
    deletedTasks.push(...curList.tasks.filter(task => task.id === id));
    curList.tasks = curList.tasks.filter(task => task.id !== id);
    saveTasks();
}




/**
 * @function completeTask
 * @description Toggles the completion status of a task and reorders the list to group completed tasks at the end.
 * @param {number} id The ID of the task to complete or un-complete.
 * @returns {void}
 */
export function completeTask(id: number) {
    if (!curList) return;
    const task = curList.tasks.find(task => task.id === id);
    const index = firstCompletedTaskIndex(curList.tasks);
    if (task) task.completed = !task.completed;
    if (task && task.completed) {
        curList.tasks = curList.tasks.filter(t => t.id !== id).concat([task]);
    } else if (task && !task.completed) {
        curList.tasks = curList.tasks.filter(t => t.id !== id);
        curList.tasks.splice(index, 0, task);
    }
    curList.completed = curList.tasks.length > 0 && curList.tasks.every(t => t.completed);
    saveTasks();
}




/**
 * @function undoDeleteTask
 * @description Undoes the last task deletion by restoring the most recently deleted task.
 * @returns {void}
 */
export function undoDeleteTask() {
    addTask(deletedTasks[deletedTasks.length - 1].text, deletedTasks[deletedTasks.length - 1].completed);
    deletedTasks.pop();
}


/**
 * @function helperSaveLists
 * @description Helper function to save lists with a given access token.
 * @param {string} accessToken The access token for authentication.
 * @returns {Response} The fetch response object.
 */
async function helperSaveLists(accessToken: string) {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/users/` + userID +'/lists', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + accessToken,
        },
        body: JSON.stringify({ lists: Lists }),
    });
    return response;
}



/**
 * @function saveLists
 * @description Saves all to-do lists to local storage and dispatches an update event.
 * @returns {void}
 */
async function saveLists() {
    eventBus.dispatchEvent(onLists);
    try {
        const apiUrl = import.meta.env.VITE_API_URL;
        let accessToken = localStorage.getItem('accessToken') || "";
        const response = await helperSaveLists(accessToken);
        if (response.ok){
            console.log("Lists saved!!!");
        }
        else if (response.status === 401 || response.status === 403) {
            const refreshToken = localStorage.getItem('refreshToken') || "";
            const refreshResponse = await fetch(`${apiUrl}/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken: refreshToken }),
            });
            if (refreshResponse.ok) {
                const data = await refreshResponse.json();
                accessToken = data.accessToken;
                localStorage.setItem('accessToken', accessToken);
                const retryResponse = await helperSaveLists(accessToken);
                if (retryResponse.ok) {
                    console.log("Lists saved after token refresh!!!");
                } else {
                    console.error('Failed to save lists after token refresh:', retryResponse.statusText);
                    eventBus.dispatchEvent(onTokenExpire);
                }
            } else {
                console.error('Failed to refresh token:', refreshResponse.statusText);
                eventBus.dispatchEvent(onTokenExpire);
            }
        }
    } catch (error) {
        console.error('Error saving lists:', error);
    }
}


/**
 * @function loadLists
 * @description Loads to-do lists from local storage.
 * @returns {void}
 */
async function loadLists() {
    try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/users/` + userID +'/lists', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            },
            credentials: 'include', // Include cookies in the request
        });
        if (response.ok){
            const data = await response.json();
            Lists = data;
            eventBus.dispatchEvent(onLists);
            console.log("Lists loaded!!!");
            if (Lists.length == 0) return;
        }
    } catch (error) {
        console.error('Error loading lists:', error);
    }
}


/**
 * @function saveTasks
 * @description Saves the tasks within the current list and triggers a full list save.
 * @returns {void}
 */
function saveTasks() {
    for (let i = 0; i < Lists.length; i++) {
        if (curList && curList.id == Lists[i].id) Lists[i] = curList;
    }
    eventBus.dispatchEvent(onTasks);
    saveLists();
}


/**
 * @function loadTasks
 * @description Loads tasks from the previously loaded lists and sets the current list.
 * @returns {void}
 */
export function loadTasks() {
    loadLists()
    .then (()=>{
        for (let i = 0; i < Lists.length; i++) {if (Lists[i].current == true) curList = Lists[i];};
        eventBus.dispatchEvent(onTasks);
        console.log("Tasks loaded!!!");
    })
}

