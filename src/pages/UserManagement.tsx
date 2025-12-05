// import React, { useState, useEffect } from 'react';
// import { User } from '../types';
// import { fetchUsers, deleteUserApi, addUserApi, updateUserApi } from '../api/usersApi';
// import UserTable from '../components/UserTable.js';
// import UserDetailsModal from '../components/UserDetailsModal';
// import AddUserModal from '../components/AddUserModal';

// function UserManagementPage() {
  
//   const [users, setUsers] = useState<User[]>([]);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);

//   useEffect(() => {
//     loadUsers();
//   }, []);

//   const loadUsers = async () => {
//     const data = await fetchUsers();
//     setUsers(data);
//   };

//   const handleDeleteUser = async (id: string) => {
//     await deleteUserApi(id);
//     loadUsers();
//   };

//   const handleAddUser = async (userData: Omit<User, '_id'>) => {
//     await addUserApi(userData);
//     loadUsers();
//     setIsAddModalOpen(false);
//   };

//   const handleUpdateUser = async (id: string, updates: Partial<User>) => {
//     await updateUserApi(id, updates);
//     loadUsers();
//     if (selectedUser && selectedUser._id === id) {
//         setSelectedUser(prev => ({ ...prev!, ...updates }));
//     }
//   };

//   return (
//     <div className="p-8">
//       <header className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">User Management</h1>
//         <button
//           onClick={() => setIsAddModalOpen(true)}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//         >
//           Add User
//         </button>
//       </header>

//       <UserTable 
//         users={users} 
//         deleteUser={handleDeleteUser} 
//         openDetails={setSelectedUser} 
//         updateUser={handleUpdateUser} 
//       />

//       {selectedUser && (
//         <UserDetailsModal 
//           user={selectedUser} 
//           onClose={() => setSelectedUser(null)} 
//           updateUser={handleUpdateUser} 
//         />
//       )}
      
//       {isAddModalOpen && (
//         <AddUserModal 
//           onClose={() => setIsAddModalOpen(false)} 
//           addUser={handleAddUser} 
//         />
//       )}
//     </div>
//   );
// }

// export default UserManagementPage;
// src/pages/UserManagement.tsx

import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { fetchUsers, deleteUserApi, addUserApi, updateUserApi } from '../api/usersApi';
import UserTable from '../components/UserTable.js';
import UserDetailsModal from '../components/UserDetailsModal';
import AddUserModal from '../components/AddUserModal';
// import { useAuth } from '../context/AuthContext'; // If you use auth guards/timing, uncomment this

function UserManagementPage() {
  
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // const { user, isLoading } = useAuth(); // If used for the timing fixes, uncomment this line

  useEffect(() => {
    // Note: If you implement the timing fixes suggested earlier, this useEffect 
    // should depend on isLoading/user and include error handling.
    loadUsers(); 
  }, []);

  const loadUsers = async () => {
    const data = await fetchUsers();
    setUsers(data);
  };

  const handleDeleteUser = async (id: string) => {
    await deleteUserApi(id);
    // Optimistic delete: filter out the deleted user instantly
    setUsers(prevUsers => prevUsers.filter(user => user._id !== id));
  };

  const handleAddUser = async (userData: any /* Use the correct type from AddUserModal.tsx */) => {
    // Instantly add the returned user to the state here for speed
    const newUser = await addUserApi(userData);
    setUsers(prevUsers => [...prevUsers, newUser]); 
    setIsAddModalOpen(false);
  };

  // Use the returned updated user object for instant UI update
  const handleUpdateUser = async (id: string, updates: Partial<User>) => {
    try {
        // Capture the specific updated user object returned from the API call
        const updatedUserFromServer = await updateUserApi(id, updates);
        
        // Instantly update the main users list state in memory
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user._id === id ? updatedUserFromServer : user
          )
        );

        // Also update the selectedUser state if the modal is open, to reflect changes immediately
        if (selectedUser && selectedUser._id === id) {
            // Use the full object from the server response, which has the correct populated role ID/object
            setSelectedUser(updatedUserFromServer); 
        }
        
        // We no longer need the slow 'loadUsers()' call here because state is updated instantly

    } catch (error) {
        console.error("Failed to update user:", error);
        // Optional: Show an error notification here
        loadUsers(); // Fallback to full refresh if an error occurs
    }
  };

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add User
        </button>
      </header>

      <UserTable 
        users={users} 
        deleteUser={handleDeleteUser} 
        openDetails={setSelectedUser} 
        updateUser={handleUpdateUser} 
      />

      {selectedUser && (
        <UserDetailsModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
          updateUser={handleUpdateUser} 
        />
      )}
      
      {isAddModalOpen && (
        <AddUserModal 
          onClose={() => setIsAddModalOpen(false)} 
          addUser={handleAddUser} 
        />
      )}
    </div>
  );
}

export default UserManagementPage;