import React, { useState } from 'react';
import { User } from '../types';

interface AddUserModalProps {
    onClose: () => void;
    // Update the expected type to include the password field
    addUser: (userData: Omit<User, '_id'> & { password: string }) => void;
}

function AddUserModal({ onClose, addUser }: AddUserModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '', // <-- Added password field
        role: 'User' as string, // <-- Set default value to 'User' (capitalized)
        status: 'available' as 'available' | 'not available',
        photoUrl: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addUser(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Add New User</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required className="border p-2 w-full rounded" />
                    <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="border p-2 w-full rounded" />
                    {/* Added password input */}
                    <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" required className="border p-2 w-full rounded" />
                    <input name="photoUrl" value={formData.photoUrl} onChange={handleChange} placeholder="Photo URL (Optional)" className="border p-2 w-full rounded" />
                    <select name="role" value={formData.role} onChange={handleChange} className="border p-2 w-full rounded">
                        {/* Changed values to be capitalized "User" and "Admin" */}
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                    </select>
                    <select name="status" value={formData.status} onChange={handleChange} className="border p-2 w-full rounded">
                        <option value="available">Available</option>
                        <option value="not available">Not Available</option>
                    </select>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add User</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddUserModal;
