
import { loadTasks } from './App';

import ListSide from './Components/ListSide';
import MouseLight from './Components/MouseLight';
import TaskSide from './Components/TaskSide';


loadTasks();

function App() {

  return (
    <>
      <div className="App
        dark:text-[#D9E2EC]
        flex
        flex-row
      ">
        <MouseLight/>
        <ListSide/>
        <TaskSide/>
      </div>
    </>
  )
}

export default App
