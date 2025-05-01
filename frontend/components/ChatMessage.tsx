import { ChatMessageProps } from "@/utils/Type";

// Message component to display individual messages
export const ChatMessage: React.FC<ChatMessageProps> = ({ message, darkMode, isCurrentUser }) => {
    return (
      <div className={`flex mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
        {!isCurrentUser && (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 mr-2 flex items-center justify-center">
            {message.sender.substring(0, 1).toUpperCase()}
          </div>
        )}
        
        <div className={`max-w-xs sm:max-w-md md:max-w-lg ${isCurrentUser ? 
          `bg-blue-600 text-white rounded-t-lg rounded-bl-lg ml-2` : 
          `${darkMode ? 'bg-gray-700' : 'bg-gray-100'} ${darkMode ? 'text-white' : 'text-gray-800'} rounded-t-lg rounded-br-lg`} 
          p-3 shadow-sm`}>
          
          <div className="text-sm">{message.content}</div>
          <div className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-200' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        
        {isCurrentUser && (
          <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 ml-2 flex items-center justify-center text-white">
            {message.sender.substring(0, 1).toUpperCase()}
          </div>
        )}
      </div>
    );
  };