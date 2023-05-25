import React, { useState } from 'react';
import { deleteUser } from '../api';
import EditUser from './EditUser';
import { UserContext } from '../App';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContextType } from '../types';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { Delete } from '@mui/icons-material';

const UserDetails: React.FunctionComponent = () => {
 // Accessing and using the user data and fetchUsersData function from UserContext
  const { users, fetchUsersData } = React.useContext(
    UserContext
  ) as UserContextType;
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [deleteUserName, setDeleteUserName] = useState<string | null>(null);
  
  // Handling delete functionality
  const handleDelete = async () => {
    if (deleteUserName) {
      const response = await deleteUser(deleteUserName);
      if (response) {
        toast.success('User deleted successfully', { autoClose: 2500 });
        fetchUsersData();
      } else {
        toast.error('Failed to delete user', { autoClose: 2500 });
      }
    }
    setDeleteUserName(null);
    setDeleteConfirmationOpen(false);
  };

  const handleDeleteConfirmation = (name: string) => {
    setDeleteUserName(name);
    setDeleteConfirmationOpen(true);
  };

  const handleCancelDelete = () => {
    setDeleteUserName(null);
    setDeleteConfirmationOpen(false);
  };

  // Handling pagination
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

   // Table column
  const columns = [
    { id: 'name', label: 'Name', minWidth: 100 },
    { id: 'description', label: 'Description', minWidth: 150 },
    { id: 'viewed', label: 'Viewed', minWidth: 50 },
    { id: 'status', label: 'Status', minWidth: 50 },
    { id: 'action', label: 'Action', minWidth: 50 },
  ];

  // Reverse the users array to display the last added data first
  const reversedUsers = [...users].reverse();

  return (
    // User table component with delete functionality
    <>
      <Container>
         {/* Display toast notifications */}
        <ToastContainer theme='colored' />
        <Paper>
          <TableContainer>
              {/* Rendering the table */}
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      style={{
                        minWidth: column.minWidth,
                        backgroundColor: 'blue',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 15,
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody style={{ cursor: 'pointer' }}>
                {reversedUsers && reversedUsers.length > 0 ? (
                  reversedUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row: any) => (
                      <TableRow
                        key={row?._id}
                        onClick={() => setSelectedUserName(row.name)}
                      >
                        <TableCell>{row?.name}</TableCell>
                        <TableCell>{row?.description}</TableCell>
                        <TableCell style={{ textTransform: 'capitalize' }}>
                          {row?.viewed}
                        </TableCell>
                        <TableCell>
                          {row?.status === 'new'
                            ? 'New'
                            : row?.status === 'complete'
                            ? 'Completed'
                            : 'In Progress'}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color='error'
                            onClick={(event) => {
                              event.stopPropagation();
                              handleDeleteConfirmation(row?.name);
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <p style={{ margin: 30 }}>No users to display</p>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component='div'
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Container>
      
      
      {/* Passing props to child component */}
      <EditUser userName={selectedUserName} />

      {/* Delete confirmation dialog */}             
      <Dialog
        open={deleteConfirmationOpen}
        onClose={handleCancelDelete}
        aria-labelledby='delete-dialog-title'
      >
        <DialogTitle id='delete-dialog-title'>Delete User</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleDelete} color='error' variant='text'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserDetails;
