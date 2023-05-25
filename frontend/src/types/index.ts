// Creating interfaces

export interface UserObject {
    name: string;
    viewed: boolean;
    description: string;
    status: 'new' | 'complete' | 'in_progress';
}

export interface UserList {
    _id: string;
    name: string;
    viewed: boolean;
    description: string;
    status: string;
}

export interface EditUserProps {
    userName: string | null;
}

export interface selectedUserNameProps {
    selectedUserName: string | null;
}

export interface UserContextType  {
    users: any;
    fetchUsersData: any;
  };


  