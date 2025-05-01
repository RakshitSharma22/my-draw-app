export interface ErrorState {
    nameError?:string
    emailError?: string;
    passwordError?: string;
    confirmPasswordError?:string
    serverError?:string
  };

  export type Room = {
    name: string;
    description: string;
    color: string;
    createdAt: Date;
  };
  


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
