export interface ErrorState {
    nameError?:string
    emailError?: string;
    passwordError?: string;
    confirmPasswordError?:string
    serverError?:string
  };

export type Room = {
    id:number;
    name: string;
    description: string;
    color: string;
    createdAt: Date|string;
  };


  export interface Message {
    id: string;
    sender: string;
    senderId: string;
    content: string;
    timestamp: string;
  }
  


export  const colorMap: Record<string, string> = {
    red: 'bg-red-400',
    green: 'bg-green-400',
    blue: 'bg-blue-400',
    yellow: 'bg-yellow-400',
    purple: 'bg-purple-400',
    gray: 'bg-gray-400',
    black:"bg-gray-900"
    // add more as needed
  };  



export interface ChatMessageProps {
    message: Message;
    darkMode: boolean;
    isCurrentUser: boolean;
  }  


export  interface ChatRoomProps {
    params: {
      roomId: string;
    };
  }

export   interface RoomInfoSidebarProps {
    room: Room;
    members: Member[];
    darkMode: boolean;
    onClose: () => void;
  }  




export  interface Member {
    id: string;
    name: string;
    status: string;
    color: string;
  }
  
export   interface User {
    id: string;
    name: string;
  }
  

