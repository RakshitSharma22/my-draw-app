import { Button } from "@/UI/Button";
import { Input } from "@/UI/Input";
import axios from "axios";
import { useState } from "react";

interface ModalProps{
    darkMode:boolean,
    closeModal:()=>void,
   
}


export default function({darkMode,closeModal}:ModalProps){
    const [roomName,setRoomName]=useState<string>("")
    const [roomColor,setRoomColor]=useState<string>("")
    const [roomDesc,setRoomDesc]=useState<string>("")
    const [successMessage, setSuccessMessage] = useState<string | null>(null);


    function onRoomNameChange(e:React.ChangeEvent<HTMLInputElement>){
        setRoomName(e.target.value)
    }

    function onRoomDescChange(e:React.ChangeEvent<HTMLTextAreaElement>){
        setRoomDesc(e.target.value)
    }
    function onRoomColorChange(e:React.ChangeEvent<HTMLInputElement>){
        setRoomColor(e.target.value)
    }

    async function handleRoomCreate(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
      
        try {
          const response = await axios.post("http://localhost:8000/room", {
            name: roomName,
            color: roomColor,
            description: roomDesc,
          }, {
            withCredentials: true,
          });
      
          if (response.status === 201) {
            setSuccessMessage("Room created successfully!");
            setTimeout(() => {
              setSuccessMessage(null);
              closeModal();
            }, 2000);
          }
        } catch (error: any) {
          console.error("Error creating room:", error);
          setSuccessMessage("Failed to create room");
          setTimeout(() => setSuccessMessage(null), 2000);
        }
      }
      
      



    return   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 md:p-4">
    <div className={`w-full max-w-md rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 md:p-6`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg md:text-xl font-bold">Create New Room</h3>
        <Button 
        variant="custom"
          onClick={closeModal}
          className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
        >
          ✕
        </Button>
      </div>
      
      <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
        <div>
          <label className={`block text-xs md:text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Room Name
          </label>
          <Input 
            onChange={onRoomNameChange}
            inputValue={roomName}
            type="text" 
            className={`w-full p-2 rounded-lg border text-sm md:text-base ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
            } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none`}
            placeholder="Enter room name"
          />
        </div>
        
        <div>
          <label className={`block text-xs md:text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Description
          </label>
          <textarea 
            onChange={onRoomDescChange}
            value={roomDesc}
            className={`w-full p-2 rounded-lg border text-sm md:text-base ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
            } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none h-20 md:h-24`}
            placeholder="Enter room description"
          />
        </div>
        
        <div>
          <label className={`block text-xs md:text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Room Color
          </label>
          <Input 
          onChange={onRoomColorChange}
            inputValue={roomColor}
            type="text" 
            className={`w-full p-2 rounded-lg border text-sm md:text-base ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
            } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none`}
            placeholder="Enter room Color"
          />
        </div>
      </div>
      {successMessage && (
  <div className={`text-sm font-medium text-center mb-4 ${successMessage.includes("successfully") ? 'text-green-500' : 'text-red-500'}`}>
    {successMessage}
  </div>
)}

      <div className="flex space-x-3">
        <Button 
          variant="custom"
          onClick={closeModal}
          className={`flex-1 py-1.5 md:py-2 px-3 md:px-4 rounded-lg border text-sm md:text-base ${
            darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'
          }`}
        >
          Cancel
        </Button>
        <Button 
        onClick={handleRoomCreate}
        variant="custom"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1.5 md:py-2 px-3 md:px-4 rounded-lg shadow text-sm md:text-base"
        >
          Create Room
        </Button>
      </div>
    </div>
  </div>
}