import { Button } from '@/UI/Button';
import { 
    PlusCircle, 
   
    Home, 
    Users, 
    Calendar, 
    MessageSquare,
    Layers,
   
    X
  } from 'lucide-react';
import Link from 'next/link';

interface SidebarProps{
    isOpen?:boolean
    onClose?:()=>void
    darkMode?:boolean
}

export  const Sidebar = ({ isOpen, onClose,darkMode }:SidebarProps) => (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 z-20 bg-black bg-opacity-50"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 z-30 w-64 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out border-r h-full overflow-y-auto ${
          darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        }`}
      >
        <div className="flex items-center justify-between p-4 md:hidden">
          <div className="flex items-center space-x-2">
            <Layers className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-bold">RoomHub</span>
          </div>
          <Button 
            onClick={onClose}
            variant='custom'
            className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-6">
          <div>
            <p className="text-xs uppercase font-semibold text-gray-500 mb-2">Main</p>
            <ul className="space-y-1">
              <li>
                <Link href="#" className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <Home className="h-5 w-5 mr-3 text-blue-600" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link href="#" className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-blue-400' : 'hover:bg-gray-100 text-blue-600'} bg-blue-50 dark:bg-blue-900/20 font-medium`}>
                  <Layers className="h-5 w-5 mr-3 text-blue-600" />
                  <span>Rooms</span>
                </Link>
              </li>
              <li>
                <Link href="#" className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <Users className="h-5 w-5 mr-3 text-blue-600" />
                  <span>Members</span>
                </Link>
              </li>
              <li>
                <Link href="#" className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                  <span>Schedule</span>
                </Link>
              </li>
              <li>
                <Link href="#" className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <MessageSquare className="h-5 w-5 mr-3 text-blue-600" />
                  <span>Messages</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <p className="text-xs uppercase font-semibold text-gray-500 mb-2">Recent Rooms</p>
            <ul className="space-y-1">
              <li>
                <Link href="#" className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-3"></div>
                  <span>Marketing Team</span>
                </Link>
              </li>
              <li>
                <Link href="#" className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <div className="h-2 w-2 rounded-full bg-blue-500 mr-3"></div>
                  <span>Product Design</span>
                </Link>
              </li>
              <li>
                <Link href="#" className={`flex items-center p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <div className="h-2 w-2 rounded-full bg-purple-500 mr-3"></div>
                  <span>Engineering</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </aside>
    </>
  );