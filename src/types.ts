// export interface User {
//   _id: string;
//   name: string;
//   email: string;
//   role: 'user' | 'admin';
//   status: 'available' | 'not available';
//   photoUrl?: string;
// }
// Add Role interface


// export interface Role {
//   _id: string;
//   name: string;
//   permissions: number[]; 
// }

// export interface User {
//   _id: string;
//   name: string;
//   email: string;
//   // Change role to be the populated Role object
//   role: Role; 
//   status: 'available' | 'not available';
//   photoUrl?: string;
// }

export interface Role {
    _id: string;
    name: string;
    permissions: number[];
}


export interface User {
    _id: string;
    name: string;
    email: string;
    role: Role;
    status: 'available' | 'not available';
    photoUrl?: string;
}



