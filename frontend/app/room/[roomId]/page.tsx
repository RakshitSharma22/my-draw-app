"use client"

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Send, 
  ArrowLeft, 
  MoreVertical, 
  PaperclipIcon as Paperclip,
  Smile,
  Mic,
  Image,
  Download,
  Info,
  Users,
  Settings
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Sidebar } from '@/components/SideBar';
import { Button } from '@/UI/Button';
import axios from 'axios';
import { ChatRoomProps, Member, Message, Room, User, colorMap } from '@/utils/Type';
import { RoomInfoSidebar } from '@/components/RoomInfoSideBar';
import { ChatMessage } from '@/components/ChatMessage';

const ChatRoom: React.FC<ChatRoomProps> = ({ params }) => {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [infoSidebarOpen, setInfoSidebarOpen] = useState<boolean>(false);
  const [room, setRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [currentUser, setCurrentUser] = useState<User>({ id: 'user1', name: 'John Doe' });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data for room members
  const mockMembers: Member[] = [
    { id: 'user1', name: 'John Doe', status: 'Online', color: 'blue' },
    { id: 'user2', name: 'Jane Smith', status: 'Away', color: 'green' },
    { id: 'user3', name: 'Robert Johnson', status: 'Offline', color: 'red' },
    { id: 'user4', name: 'Emily Williams', status: 'Online', color: 'purple' },
    { id: 'user5', name: 'Michael Brown', status: 'Online', color: 'yellow' },
  ];

  // Mock data for messages
  const mockMessages: Message[] = [
    { id: 'm1', sender: 'Jane Smith', senderId: 'user2', content: 'Hi everyone! Welcome to our new chat room.', timestamp: '2023-07-20T09:30:00Z' },
    { id: 'm2', sender: 'Robert Johnson', senderId: 'user3', content: 'Thanks for setting this up. I think it will be really helpful for our project.', timestamp: '2023-07-20T09:32:00Z' },
    { id: 'm3', sender: 'John Doe', senderId: 'user1', content: 'No problem! Let me know if you have any questions about how to use it.', timestamp: '2023-07-20T09:33:00Z' },
    { id: 'm4', sender: 'Emily Williams', senderId: 'user4', content: 'I just joined. Can someone catch me up on what we\'re discussing?', timestamp: '2023-07-20T09:40:00Z' },
    { id: 'm5', sender: 'John Doe', senderId: 'user1', content: 'We were just getting started with introductions. This room is for our team to collaborate on the new project.', timestamp: '2023-07-20T09:42:00Z' },
    { id: 'm6', sender: 'Michael Brown', senderId: 'user5', content: 'I have some ideas for the initial phase that I\'d like to share with everyone.', timestamp: '2023-07-20T09:45:00Z' },
    { id: 'm7', sender: 'Jane Smith', senderId: 'user2', content: 'That sounds great, Michael! Let\'s hear them.', timestamp: '2023-07-20T09:47:00Z' },
    { id: 'm8', sender: 'Robert Johnson', senderId: 'user3', content: 'Also, does anyone have the link to the shared documents folder?', timestamp: '2023-07-20T09:50:00Z' },
    { id: 'm9', sender: 'John Doe', senderId: 'user1', content: 'I\'ll send it shortly. Just finalizing some permissions.', timestamp: '2023-07-20T09:52:00Z' },
  ];

  // Mock room data
  const mockRoom: Room = {
    id: 1,                                // Add this
    name: 'Project Alpha',
    color: 'blue',
    createdAt: '2023-07-19T14:00:00Z',         // Add this
    description: 'Main room for Project Alpha collaboration'
  };

  const toggleDarkMode = (): void => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = (): void => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleInfoSidebar = (): void => {
    setInfoSidebarOpen(!infoSidebarOpen);
  };

  const handleBack = (): void => {
    router.push('/dashboard');
  };

  const handleSendMessage = (e: React.FormEvent): void => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    
    const newMessageObj: Message = {
      id: `m${messages.length + 1}`,
      sender: currentUser.name,
      senderId: currentUser.id,
      content: newMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages([...messages, newMessageObj]);
    setNewMessage('');
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load room data and messages
  useEffect(() => {
    // Here you would fetch data from your API
    // For now, we're using mock data
    setLoading(true);
    
    // Simulate API fetch
    setTimeout(() => {
      setRoom(mockRoom);
      setMessages(mockMessages);
      setMembers(mockMembers);
      setLoading(false);
    }, 500);
    
    // In a real app, you would do something like:
    // async function fetchRoomData() {
    //   try {
    //     const response = await axios.get(`http://localhost:8000/room/${params.roomId}`, {
    //       withCredentials: true,
    //     });
    //     setRoom(response.data.room);
    //     setMessages(response.data.messages);
    //   } catch (error) {
    //     console.error("Error fetching room data:", error);
    //   } finally {
    //     setLoading(false);
    //   }
    // }
    // fetchRoomData();
    
    // Fetch all rooms for sidebar
    const fetchRooms = async (): Promise<void> => {
      try {
        const response = await axios.get("http://localhost:8000/room", {
          withCredentials: true,
        });
        if (response.status === 200) {
          setRooms(response.data["allRooms"]);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    
    fetchRooms();
  }, [params]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      {/* Navbar */}
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar rooms={rooms} darkMode={darkMode} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full max-h-[calc(100vh-64px)]">
          {/* Chat Header */}
          <div className={`px-4 py-3 flex items-center justify-between border-b ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center">
              <Button 
                variant="custom"
                onClick={handleBack}
                className="mr-2 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              
              <div className={`w-10 h-10 rounded-lg ${colorMap[room?.color.toLowerCase() || 'blue']} flex items-center justify-center text-white font-bold mr-3`}>
                {room?.name.substring(0, 2)}
              </div>
              
              <div>
                <h2 className="font-bold text-lg">{room?.name}</h2>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {members.length} members • {members.filter(m => m.status === 'Online').length} online
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="custom"
                onClick={toggleInfoSidebar}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Info className="h-5 w-5" />
              </Button>
              
              <Button
                variant="custom"
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Messages Container */}
          <div className={`flex-1 p-4 overflow-y-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center">
                <div className={`w-16 h-16 rounded-xl ${colorMap[room?.color.toLowerCase() || 'blue']} flex items-center justify-center text-white font-bold text-2xl mb-4`}>
                  {room?.name.substring(0, 2)}
                </div>
                <h3 className="text-lg font-medium mb-2">Welcome to {room?.name}</h3>
                <p className={`text-center max-w-md ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  This is the beginning of your conversation in this room. Send a message to get started!
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {/* Date Separator */}
                <div className="flex items-center justify-center mb-6">
                  <div className={`px-3 py-1 rounded-full text-xs ${
                    darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {new Date(messages[0].timestamp).toLocaleDateString()}
                  </div>
                </div>
                
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id} 
                    message={message} 
                    darkMode={darkMode}
                    isCurrentUser={message.senderId === currentUser.id}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          {/* Message Input */}
          <div className={`px-4 py-3 border-t ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <form onSubmit={handleSendMessage} className="flex items-center">
              <div className="flex space-x-2 mr-2">
                <Button
                  type="button"
                  variant="custom"
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <Smile className="h-5 w-5" />
                </Button>
                
                <Button
                  type="button"
                  variant="custom"
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <Image className="h-5 w-5" />
                </Button>
              </div>
              
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className={`flex-1 py-2 px-3 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-gray-100 border-gray-200 text-gray-800 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              
              <div className="flex space-x-2 ml-2">
                <Button
                  type="button"
                  variant="custom"
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
                
                <Button
                  type="submit"
                  variant="custom"
                  className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </div>
        </main>
        
        {/* Info Sidebar (conditionally rendered) */}
        {infoSidebarOpen && room && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={toggleInfoSidebar}
            ></div>
            <RoomInfoSidebar
              room={room} 
              members={members} 
              darkMode={darkMode} 
              onClose={toggleInfoSidebar} 
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;