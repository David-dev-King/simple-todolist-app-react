import Forms from './Components/Forms';

import ListSide from './Components/ListSide';
import MouseLight from './Components/MouseLight';
import TaskSide from './Components/TaskSide';



function App() {

  return (
    <>
      <div className="App
        dark:text-[#D9E2EC]
        flex
        flex-row
      ">
        <MouseLight/>
        <Forms/>
        <ListSide/>
        <TaskSide/>
      </div>
    </>
  )
}

export default App
