"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PlusCircle, 
  Menu,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Sidebar } from '@/components/SideBar';
import { Button } from '@/UI/Button';
import Modal from '@/components/Modal';
import axios from 'axios';
import { Room, colorMap } from '@/utils/Type';

export default function Dashboard() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<boolean | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  console.log(rooms)

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

  // Navigate to chat room when a room card is clicked
  const handleRoomClick = (roomId:number) => {
    router.push(`/room/${roomId}`);
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:8000/room", {
          withCredentials: true,
        });
  
        if (response.status === 200) {
          console.log(response.data);
          setRooms(response.data["rooms"]);
          setSuccessMessage(true);
        }
      } catch (error: any) {
        console.error("Error fetching rooms:", error);
        setSuccessMessage(false);
      }
    };
  
    fetchRooms();
  }, []);
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      {/* Navbar */}
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <div className="flex">
        {/* Sidebar */}
        <Sidebar rooms={rooms} darkMode={darkMode} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
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
          { rooms && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {rooms.map((room, index) => (
              <div 
                key={index}
                className={`rounded-xl p-4 md:p-6 shadow-sm border transition-all duration-300 hover:shadow-md cursor-pointer transform hover:scale-105 ${
                  darkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-100 hover:border-gray-300'
                }`}
                onClick={() => handleRoomClick(room.id)}
              >
                <div className="flex items-center mb-3 md:mb-4">
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg ${colorMap[room.color.toLowerCase()]} flex items-center justify-center text-white font-bold text-sm md:text-base`}>
                    {room.name.substring(0,2)}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-sm md:text-base">{room.name}</h3>
                    <p className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                     20 members
                    </p>
                  </div>
                </div>
                
                <div className="flex -space-x-2 mb-3 md:mb-4">
                  {[...Array(Math.min(5, 20))].map((_, i) => (
                    <div 
                      key={i}
                      className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-2 ${
                        darkMode ? 'border-gray-800' : 'border-white'
                      } bg-gray-300`}
                    />
                  ))}
                  {20 > 5 && (
                    <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-2 ${
                      darkMode ? 'border-gray-800 bg-gray-700' : 'border-white bg-gray-100'
                    } flex items-center justify-center text-xs`}>
                      +{20 - 5}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    Active
                  </span>
                  <div className={`text-xs md:text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}>
                    View Details
                  </div>
                </div>
              </div>
            ))}
          </div>}
         
        </main>
      </div>
      
      {/* Create Room Modal */}
      {showModal && (
       <Modal darkMode={darkMode} closeModal={closeModal}/>
      )}
    </div>
  );
}