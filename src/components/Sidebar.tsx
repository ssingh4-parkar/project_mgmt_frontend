import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PERMISSIONS = { USER_MANAGEMENT: 1, TASK_MANAGEMENT: 2, ROLE_MANAGEMENT: 3, ALL: 4 };

// Removed toggleSidebar prop
function Sidebar({ isOpen }: { isOpen: boolean }) {
    const location = useLocation();
    const { permissions, isLoading, logout } = useAuth(); 

    // Define items that *do* require specific permissions
    const permissionNavItems = [
        { name: 'Role Management', path: '/roles', requiredPermission: PERMISSIONS.ROLE_MANAGEMENT },
        { name: 'User Management', path: '/users', requiredPermission: PERMISSIONS.USER_MANAGEMENT },
        { name: 'Task Management', path: '/tasks', requiredPermission: PERMISSIONS.TASK_MANAGEMENT },
    ];

    // Home item is treated separately so it bypasses permission filtering
    const homeNavItem = { name: 'Home', path: '/home' };

    const hasAccess = (requiredPermission: number) => {
        return permissions.includes(requiredPermission) || permissions.includes(PERMISSIONS.ALL); 
    };
    
    // Filter the items that require permissions
    const visiblePermissionItems = permissionNavItems.filter(item => hasAccess(item.requiredPermission));

    if (isLoading) { return <div className="w-64 bg-gray-800 text-white p-4">Loading menu...</div>; }
    
    return (
        // Dynamic classes for visibility/positioning using fixed positioning and transform
        <div className={`fixed inset-y-0 left-0 transform bg-gray-800 text-white flex flex-col h-full transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'}`}>
            
            <div className="p-4 text-xl font-bold border-b border-gray-700 flex justify-between items-center">
                <span>Admin Panel</span>
                {/* Button was removed from here */}
            </div>
            
            <nav className="flex-1 px-4 mt-6 space-y-2 overflow-y-auto">
                
                {/* Always render the Home link first */}
                <Link 
                    key={homeNavItem.name} 
                    to={homeNavItem.path} 
                    className={`flex items-center py-2 px-4 rounded-md transition duration-200 ${ 
                        location.pathname === homeNavItem.path
                            ? 'bg-gray-700 text-white' 
                            : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                    }`}
                >
                    {homeNavItem.name}
                </Link>

                {/* Then render the other items using the filtered list */}
                {visiblePermissionItems.map((item) => (
                    <Link 
                        key={item.name} 
                        to={item.path} 
                        className={`flex items-center py-2 px-4 rounded-md transition duration-200 ${ 
                            location.pathname === item.path
                                ? 'bg-gray-700 text-white' 
                                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                        {item.name}
                    </Link>
                ))}
            </nav>
            <div className="p-4 border-t border-gray-700">
                <button onClick={logout} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200"> Logout </button>
            </div>
        </div>
    );
}

export default Sidebar;
