export interface Message {
    sender: {
      id: string;
      username: string;
      avatar: string;
    };
    body: string;
    createdAt: number; 
  }