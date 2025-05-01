"use client"
import { useState } from 'react';
import { 
  PlusCircle, 
  Menu,
  
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Sidebar } from '@/components/SideBar';
import { Button } from '@/UI/Button';
import Modal from '@/components/Modal';



export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const openModal = () => {
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
  };


  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      {/* Navbar */}
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <div className="flex">
        {/* Sidebar */}
        <Sidebar darkMode={darkMode} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Main Content */}
        <main className="flex-1 p-3 md:p-6 w-full">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <div className="flex items-center md:items-start">
              <Button 
                variant="custom"
                onClick={toggleSidebar}
                className="md:hidden mr-2 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Menu className="h-6 w-6" />
              </Button>
              <div>
                <h2 className="text-xl md:text-2xl font-bold">Rooms</h2>
                <p className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Manage and organize your team spaces
                </p>
              </div>
            </div>
            
            <Button 
              variant='custom'
              onClick={openModal}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-1.5 md:py-2 px-3 md:px-4 rounded-lg shadow transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
            >
              <PlusCircle className="h-4 w-4 md:h-5 md:w-5 mr-1.5 md:mr-2" />
              <span className="hidden xs:inline">Create Room</span>
              <span className="xs:hidden">New</span>
            </Button>
          </div>
          
          {/* Room Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {[
              { name: 'Marketing Team', members: 8, color: 'bg-green-500' },
              { name: 'Product Design', members: 12, color: 'bg-blue-500' },
              { name: 'Engineering', members: 16, color: 'bg-purple-500' },
              { name: 'Customer Support', members: 6, color: 'bg-yellow-500' },
              { name: 'Sales', members: 10, color: 'bg-red-500' },
              { name: 'Executive', members: 4, color: 'bg-indigo-500' },
            ].map((room, index) => (
              <div 
                key={index}
                className={`rounded-xl p-4 md:p-6 shadow-sm border transition-all duration-300 hover:shadow-md ${
                  darkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-100 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center mb-3 md:mb-4">
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg ${room.color} flex items-center justify-center text-white font-bold text-sm md:text-base`}>
                    {room.name.substring(0, 2)}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-sm md:text-base">{room.name}</h3>
                    <p className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {room.members} members
                    </p>
                  </div>
                </div>
                
                <div className="flex -space-x-2 mb-3 md:mb-4">
                  {[...Array(Math.min(5, room.members))].map((_, i) => (
                    <div 
                      key={i}
                      className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-2 ${
                        darkMode ? 'border-gray-800' : 'border-white'
                      } bg-gray-300`}
                    />
                  ))}
                  {room.members > 5 && (
                    <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-2 ${
                      darkMode ? 'border-gray-800 bg-gray-700' : 'border-white bg-gray-100'
                    } flex items-center justify-center text-xs`}>
                      +{room.members - 5}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    Active
                  </span>
                  <button className={`text-xs md:text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
      
      {/* Create Room Modal */}
      {showModal && (
       <Modal darkMode={darkMode} closeModal={closeModal}/>
      )}
    </div>
  );
}