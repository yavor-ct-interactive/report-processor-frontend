import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from "flowbite-react";
import {Link, Route, Routes} from "react-router-dom"
import { GameplayPanel } from './components/presentational/GameplayPanel';
import { MdRocketLaunch } from 'react-icons/md';
import { ImStatsDots } from "react-icons/im";
import { MdAccountBalance } from "react-icons/md";



function App() {
  const [count, setCount] = useState(0)

  return (
    <section className="bg-gray-50 dark:bg-black w-full min-h-screen"> 
      <div className="px-2" >

        <nav className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden mb-2">
          <ul className="flex  items-center justify-center text-gray-900 dark:text-white w-full ">
            <li className="flex border">
              <Link to="/gameplay-stats" className="flex flex-row gap-4 items-center justify-between px-2 decoration-black" >
                  <div><ImStatsDots /></div> 
                  <div className=''>Gameplay Statistics</div>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden p-3">
          <Routes> 
            <Route path="/gameplay-stats" element={<GameplayPanel />} />
          </Routes>
        </div>
      </div>
    </section>
  )
}

export default App
