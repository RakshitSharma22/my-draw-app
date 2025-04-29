import { Button } from '@/UI/Button';
import { Input } from '@/UI/Input';
import { 
    
    Bell, 
    Settings, 
    Search, 
    Moon, 
    Sun, 
    Layers
  } from 'lucide-react';

interface NavbarProps{
  darkMode:boolean,
  toggleDarkMode:()=>void
  
}  
export default function Navbar({darkMode,toggleDarkMode}:NavbarProps){
    return (
        <header className={`py-3 md:py-4 px-3 md:px-6 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold">RoomHub</h1>
            </div>
            
            {/* Mobile Icons */}
            <div className="flex md:hidden items-center space-x-2">
              <button onClick={toggleDarkMode} className={`p-1.5 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button className={`p-1.5 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} relative`}>
                <Bell className="h-4 w-4" />
                <span className="absolute top-0 right-0 h-1.5 w-1.5 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
          
          <div className={`flex items-center rounded-lg px-2 md:px-3 py-1.5 md:py-2 w-full md:w-auto ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <Search className="h-4 w-4 md:h-5 md:w-5 text-gray-400 flex-shrink-0" />
          
            <Input variant='custom' type='text' placeholder='Serach' className={`ml-2 bg-transparent outline-none w-full md:w-44 lg:w-64 text-sm md:text-base ${darkMode ? 'text-white' : 'text-gray-800'}`}/>
          </div>
          
          <div className="hidden md:flex items-center space-x-2 md:space-x-4">
            <Button variant='custom' onClick={toggleDarkMode} className={`p-1.5 md:p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
              {darkMode ? <Sun className="h-4 w-4 md:h-5 md:w-5" /> : <Moon className="h-4 w-4 md:h-5 md:w-5" />}
            </Button>
                  
            <Button variant='custom' className={`p-1.5 md:p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} relative`}>
              <Bell className="h-4 w-4 md:h-5 md:w-5" />
              <span className="absolute top-0 right-0 h-1.5 w-1.5 md:h-2 md:w-2 bg-red-500 rounded-full"></span>
            </Button>
          
            <Button variant='custom' className={`p-1.5 md:p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
              <Settings className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
            
            <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm md:text-base font-semibold">
              JD
            </div>
          </div>
        </header>
      );
}