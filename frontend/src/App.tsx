import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CreateUser from './components/CreateUser';
import UserDetails from './components/UserDetails';
import { UserContextType, UserList } from './types';
import { getAllUsers } from './api';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

// Create a context for user data and fetch function
export const UserContext = React.createContext<UserContextType | null>(null);

const App: React.FunctionComponent = () => {
  const [users, setUsers] = useState<Array<UserList>>([]);
  const [loading, setLoading] = useState<boolean>(true);

   // Fetch all users data from the API
  const fetchUsersData = async () => {
    let response = await getAllUsers();
    setUsers(response);
    // Not: Remove setTimeout function if network is slow
    setTimeout(async () => {
      setLoading(false);
    }, 2000);  
  };

  useEffect(() => {
    // Trigger the fetching of user data
    fetchUsersData();
  }, []);

  return (
    <UserContext.Provider value={{ users, fetchUsersData }}>
      <>
        {loading && (
          <Backdrop
            sx={{ color: 'blue', zIndex: 1500 }} 
            open={loading}
          >
            <CircularProgress color='inherit' />
          </Backdrop>
        )}
        <Header />
        <CreateUser />
        <UserDetails />
      </>
    </UserContext.Provider>
  );
};

export default App;