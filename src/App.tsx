import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button, Datepicker } from "flowbite-react";
import {Link, Route, Routes} from "react-router-dom"
import { GameplayPanel } from './components/presentational/GameplayPanel';
import { MdRocketLaunch } from 'react-icons/md';
import { ImStatsDots } from "react-icons/im";
import { MdAccountBalance } from "react-icons/md";
import { SysinfoPanel } from './components/presentational/Sysinfo/SystemPanel';
import { useLocation } from 'react-router-dom';
import { PromosPanel } from './components/presentational/PromosPanel';
import { GrSystem } from "react-icons/gr";
import { MdOutlineCampaign } from "react-icons/md";
import {EndpointsLogsPanel} from './components/presentational/EndpointsLogsPanel';
import {LoginForm} from './components/Forms/LoginForm.tsx';
import { ProtectedPanel } from './components/presentational/ProtectedPanel.tsx';
//import { UsersManagementPanel } from './components/manage_users/UsersManagementPanel.tsx';


function App() {
  const [count, setCount] = useState(0)
  const location = useLocation();
  const validPaths = ["/gameplay-stats", "/system-info", "/promos", "/endpoints-logs", "/login", "/protected","/user-management"];
  const showWrapper = validPaths.includes(location.pathname);
  return (
    <section className="bg-gray-50  dark:bg-black w-screen  dark:text-gray-200 w-full "> 
        
        <nav className="relative sm:rounded-lg overflow-x-hidden mb-2 mx-4 w-11/12">
          <ul className="flex items-center justify-center text-gray-900  gap-2 p-2">
            <li className="flex hover:bg-gray-100 dark:hover:bg-teal-900">
              <Link to="/gameplay-stats" >
              <div className="flex flex-row gap-1 items-center hover:text-teal-500 hover:dark:text-teal-500 justify-between px-2 text-black dark:text-white">
                  <div><ImStatsDots /></div> 
                  <div className=''>Gameplay Statistics</div>
              </div>
              </Link>
            </li>
           {/* <li className="flex hover:bg-gray-100 dark:hover:bg-teal-900 hover:bg-gray-100 dark:hover:bg-gray-700">
              <Link to="/system-info" className="flex flex-row gap-4 items-center justify-between px-2" >
                <div className="flex flex-row gap-1 items-center hover:text-teal-500 hover:dark:text-teal-500 justify-between text-black dark:text-white">
                  <div><GrSystem /></div> 
                  <div className=''>SysInfo</div>
                </div>
              </Link>
            </li>
            <li className="flex hover:bg-gray-100 dark:hover:bg-teal-900 hover:bg-gray-100 dark:hover:bg-gray-700">
              <Link to="/promos" className="flex flex-row gap-4 items-center justify-between px-2" >
                <div className="flex flex-row gap-1 items-center hover:text-teal-500 hover:dark:text-teal-500 justify-between text-black dark:text-white">
                  <div><MdOutlineCampaign size="25" /></div> 
                  <div className=''>Promos</div>
                </div>
              </Link>
            </li>
            <Route path="/user-management" element = {<UsersManagementPanel />} />
          */}            
          </ul>
        </nav>
        {showWrapper && (
        <div className="border dark:bg-gray-800 relative overflow-auto p-3 mx-4 mb-5"> 
            <Routes> 
              <Route path="/gameplay-stats" element={<GameplayPanel />} />
              <Route path="/system-info" element={<SysinfoPanel />} />
              <Route path="/promos" element = {<PromosPanel />} />
             { // <Route path="/login" element = {<LoginForm />} /> 
             }
             { //<Route path="/protected" element= { <ProtectedPanel /> } />
             }
              <Route path="/endpoints-logs" element = {<EndpointsLogsPanel />} />           
            </Routes>
          </div>
        )}
    </section>
  )
}

export default App
