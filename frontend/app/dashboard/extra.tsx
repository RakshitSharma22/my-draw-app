"use client"
import { useState } from 'react';
import { 
  PlusCircle, 
  Bell, 
  Settings, 
  Search, 
  Moon, 
  Sun, 
  Home, 
  Users, 
  Calendar, 
  MessageSquare,
  Layers
} from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
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
     <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode}/>
      
      <div className="flex">
        {/* Sidebar */}
        <aside className={`w-64 border-r p-4 h-screen ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          <nav className="space-y-6">
            <div>
              <p className="text-xs uppercase font-semibold text-gray-500 mb-2">Main</p>
              <ul className="space-y-1">
                <li>
                  <a href="#" className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    <Home className="h-5 w-5 mr-3 text-blue-600" />
                    <span>Dashboard</span>
                  </a>
                </li>
                <li>
                  <a href="#" className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-blue-400' : 'hover:bg-gray-100 text-blue-600'} bg-blue-50 dark:bg-blue-900/20 font-medium`}>
                    <Layers className="h-5 w-5 mr-3 text-blue-600" />
                    <span>Rooms</span>
                  </a>
                </li>
                <li>
                  <a href="#" className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    <Users className="h-5 w-5 mr-3 text-blue-600" />
                    <span>Members</span>
                  </a>
                </li>
                <li>
                  <a href="#" className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                    <span>Schedule</span>
                  </a>
                </li>
                <li>
                  <a href="#" className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    <MessageSquare className="h-5 w-5 mr-3 text-blue-600" />
                    <span>Messages</span>
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <p className="text-xs uppercase font-semibold text-gray-500 mb-2">Recent Rooms</p>
              <ul className="space-y-1">
                <li>
                  <a href="#" className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-3"></div>
                    <span>Marketing Team</span>
                  </a>
                </li>
                <li>
                  <a href="#" className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    <div className="h-2 w-2 rounded-full bg-blue-500 mr-3"></div>
                    <span>Product Design</span>
                  </a>
                </li>
                <li>
                  <a href="#" className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    <div className="h-2 w-2 rounded-full bg-purple-500 mr-3"></div>
                    <span>Engineering</span>
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Rooms</h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Manage and organize your team spaces
              </p>
            </div>
            
            <button 
              onClick={openModal}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow transition-all duration-300 transform hover:scale-105"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Create Room
            </button>
          </div>
          
          {/* Room Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className={`rounded-xl p-6 shadow-sm border transition-all duration-300 hover:shadow-md ${
                  darkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-100 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center mb-4">
                  <div className={`w-10 h-10 rounded-lg ${room.color} flex items-center justify-center text-white font-bold`}>
                    {room.name.substring(0, 2)}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold">{room.name}</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {room.members} members
                    </p>
                  </div>
                </div>
                
                <div className="flex -space-x-2 mb-4">
                  {[...Array(Math.min(5, room.members))].map((_, i) => (
                    <div 
                      key={i}
                      className={`w-8 h-8 rounded-full border-2 ${
                        darkMode ? 'border-gray-800' : 'border-white'
                      } bg-gray-300`}
                    />
                  ))}
                  {room.members > 5 && (
                    <div className={`w-8 h-8 rounded-full border-2 ${
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
                  <button className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Create New Room</h3>
              <button 
                onClick={closeModal}
                className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Room Name
                </label>
                <input 
                  type="text" 
                  className={`w-full p-2 rounded-lg border ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                  placeholder="Enter room name"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Description
                </label>
                <textarea 
                  className={`w-full p-2 rounded-lg border ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none h-24`}
                  placeholder="Enter room description"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Room Color
                </label>
                <div className="flex space-x-2">
                  {['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-red-500', 'bg-indigo-500'].map((color, index) => (
                    <button 
                      key={index}
                      className={`w-8 h-8 rounded-full ${color} border-2 ${
                        index === 0 ? (darkMode ? 'border-gray-300' : 'border-gray-800') : 'border-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={closeModal}
                className={`flex-1 py-2 px-4 rounded-lg border ${
                  darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                Cancel
              </button>
              <button 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow"
              >
                Create Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}