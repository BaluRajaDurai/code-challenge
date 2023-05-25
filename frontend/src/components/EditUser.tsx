import React, { useState, useEffect, useCallback } from 'react';
import { EditUserProps, UserContextType, UserObject } from '../types';
import { getUser, editUser } from '../api';
import { UserContext } from '../App';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  useMediaQuery,
  Button,
  Container,
  IconButton,
  TextField,
  Checkbox,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from '@mui/material';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const EditUser: React.FunctionComponent<EditUserProps> = ({ userName }) => {
  // Accessing and using the "fetchUsersData" function from UserContext
  const { fetchUsersData } = React.useContext(UserContext) as UserContextType;

  const isMobile = useMediaQuery('(max-width: 600px)');

  const initialValue: UserObject = {
    name: '',
    viewed: false,
    description: '',
    status: 'in_progress',
  };

  const [open, setOpen] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<string>('');
  const [user, setUser] = useState<UserObject>(initialValue);
  const [errorType, setErrorType] = useState<Array<string>>(['', '']);
  const { name, viewed, description, status } = user;

  // Handling drawer 
  const handleDrawer = useCallback((): void => {
    setOpen((prevOpen) => !prevOpen);
  }, []);

 // Update the state values based on the changed data
  const onValueChange = (e: any) => {
    setUser({
      ...user,
      [e.target.name]: e.target.type === 'checkbox' ? !viewed : e.target.value,
    });

    if (e.target.name === 'name' || e.target.name === 'description') {
      setErrorType(['', '']);
    }
  };

   // Edit API call
  const editUserDetails = async (dataToSend: UserObject) => {
    if (userName !== null) {
      const response = await editUser(userName, dataToSend);

      if (response) {
        fetchUsersData();
        toast.success('User edited successfully', { autoClose: 2500 });
      } else {
        toast.error('Failed to edit user', { autoClose: 2500 });
      }
    } else {
      toast.error('Something went wrong', { autoClose: 2500 });
    }
    handleDrawer();
  };

  //Handling submit with validation
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (name.trim() === '') {
      setErrorType(['Please enter the name', '']);
      return;
    }

    if (name.length > 36) {
      setErrorType(['Name should not exceed 100 characters', '']);
      return;
    }

    if (description.length > 100) {
      setErrorType(['', 'Description should not exceed 100 characters']);
      return;
    }

    editUserDetails({ name, description, status, viewed });
  };

	useEffect(() => {
    const fetchUserData = async () => {
      // User API call
      const userResponse = await getUser(userName || '');
      setUser(userResponse);
      setIsDisabled(userResponse?.status);
      handleDrawer();
    };
    // Fetching user data if props received or when userName changes
    if (userName !== null) {
      fetchUserData();
    }
  }, [handleDrawer, userName]);

  return (
    // Component for the user editing drawer
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        '& > :not(style)': {
          m: isMobile ? 3 : 5,
        },
      }}
    >
       {/* Display toast notifications */}
      <ToastContainer theme='colored' />

      <Drawer
        anchor='left'
        open={open}
        onClose={handleDrawer}
        BackdropProps={{
          onClick: (event) => event.stopPropagation(),
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 1,
          }}
        >
          <IconButton
            color='error'
            onClick={() => {
              setUser(initialValue);
              setErrorType(['', '']);
              handleDrawer();
            }}
          >
            <CancelPresentationIcon style={{ fontSize: 30 }} />
          </IconButton>
        </Box>

        <Container maxWidth='sm'>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            <AccountCircleIcon sx={{ fontSize: 50 }} />
            <p style={{ fontSize: 25, marginLeft: '0.2rem' }}>
              Editing {userName || ''} Details
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ marginTop: 20 }}>
              <label htmlFor='Name' className='form-label'>
                Enter Name*
              </label>
              <TextField
                label='Name'
                name='name'
                value={name}
                onChange={(e) => onValueChange(e)}
                fullWidth
                sx={{ my: 2 }}
                error={errorType[0] !== ''}
                helperText={errorType[0]}
                inputProps={{
                  style: { color: errorType[0] !== '' ? 'red' : '' },
                }}
              />
            </div>

            <div style={{ marginTop: 20 }}>
              <label htmlFor='Description' className='form-label'>
                Enter Description
              </label>
              <TextField
                label='Description'
                name='description'
                InputProps={{
                  rows: 3,
                }}
                value={description}
                onChange={(e) => onValueChange(e)}
                multiline
                fullWidth
                sx={{ my: 2 }}
                error={errorType[1] !== ''}
                helperText={errorType[1]}
                inputProps={{
                  style: { color: errorType[1] !== '' ? 'red' : '' },
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'start',
                marginTop: 20,
              }}
            >
              <FormControl component='fieldset'>
                <label htmlFor='Status' className='form-label'>
                  Status*
                </label>
                <RadioGroup
                  name='status'
                  value={status}
                  onChange={(e) => onValueChange(e)}
                  row
                >
                  <FormControlLabel
                    value='new'
                    control={<Radio disabled={isDisabled === 'complete'} />}
                    label='New'
                  />
                  <FormControlLabel
                    value='in_progress'
                    control={<Radio disabled={isDisabled === 'complete'} />}
                    label='In Progress'
                  />
                  <FormControlLabel
                    value='complete'
                    control={<Radio disabled={isDisabled === 'complete'} />} // Always disabled
                    label='Completed'
                  />
                </RadioGroup>
              </FormControl>

              <FormControlLabel
                name='viewed'
                control={
                  <Checkbox
                    checked={viewed.toString() === 'false' ? false : true}
                    onChange={(e) => onValueChange(e)}
                  />
                }
                label='Viewed'
                style={{
                  marginTop: 20,
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                gap: 25,
                marginTop: 30,
                marginBottom: 30,
              }}
            >
              <Button
                type='submit'
                variant='outlined'
                color='success'
                sx={{ fontWeight: 'bold' }}
              >
                Save
              </Button>
              <Button
                variant='outlined'
                color='error'
                sx={{ fontWeight: 'bold' }}
                onClick={() => {
                  setUser(initialValue);
                  setErrorType(['', '']);
                  handleDrawer();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Container>
      </Drawer>
    </Box>
  );
};

export default EditUser;
