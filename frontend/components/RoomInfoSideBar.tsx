import { Button } from "@/UI/Button";
import { RoomInfoSidebarProps, colorMap } from "@/utils/Type";
import { ArrowLeft, Settings, Users } from "lucide-react";

// Room info sidebar component
export const RoomInfoSidebar: React.FC<RoomInfoSidebarProps> = ({ room, members, darkMode, onClose }) => {
    return (
      <div className={`w-64 md:w-80 fixed top-0 right-0 h-full z-50 transform transition-transform duration-300 ease-in-out ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg p-4 overflow-y-auto`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Room Info</h2>
          <Button 
            variant="custom" 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-opacity-10 hover:bg-gray-500"
          >
            <ArrowLeft size={20} />
          </Button>
        </div>
        
        <div className="mb-6">
          <div className={`w-16 h-16 rounded-xl ${colorMap[room.color.toLowerCase()]} flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3`}>
            {room.name.substring(0, 2)}
          </div>
          <h3 className="text-xl font-bold text-center mb-1">{room.name}</h3>
          <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Created on {new Date(room.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Users size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
            <h4 className="font-semibold ml-2">Members ({members.length})</h4>
          </div>
          
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {members.map((member, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full ${colorMap[member.color.toLowerCase() || 'blue']} flex items-center justify-center text-white font-medium`}>
                  {member.name.substring(0, 1)}
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {member.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Settings size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
            <h4 className="font-semibold ml-2">Settings</h4>
          </div>
          
          <div className="space-y-2">
            <button className={`w-full text-left py-2 px-3 rounded-lg text-sm ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              Notifications
            </button>
            <button className={`w-full text-left py-2 px-3 rounded-lg text-sm ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              Media & Files
            </button>
            <button className={`w-full text-left py-2 px-3 rounded-lg text-sm ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              Privacy & Security
            </button>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button className={`w-full py-2 px-3 rounded-lg text-sm text-red-500 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            Leave Room
          </button>
        </div>
      </div>
    );
  };