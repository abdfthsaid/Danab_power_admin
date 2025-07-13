import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUser, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { selectUsers, selectPermissions } from '../store/usersSlice';

const Users = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'User', permissions: [] });
  const [success, setSuccess] = useState(false);
  const users = useSelector(selectUsers);
  const PERMISSIONS = useSelector(selectPermissions);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePermissionChange = (perm) => {
    setForm((prev) => {
      const has = prev.permissions.includes(perm);
      return {
        ...prev,
        permissions: has
          ? prev.permissions.filter((p) => p !== perm)
          : [...prev.permissions, perm],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setModalOpen(false);
      setForm({ name: '', email: '', role: 'User', permissions: [] });
    }, 1500);
  };

  return (
    <div className="p-4">
      <div className="flex flex-col mb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-2xl font-bold dark:text-white">Users</h3>
          <p className="text-gray-500 dark:text-gray-400">Manage system users, permissions, and roles</p>
        </div>
        <button
          className="flex items-center px-5 py-2 mt-4 font-semibold text-white transition-all duration-200 rounded-lg shadow-lg md:mt-0 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={() => setModalOpen(true)}
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add New User
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="relative w-full max-w-lg p-8 bg-white shadow-2xl dark:bg-gray-900 rounded-2xl animate-fadeInUp">
            <button
              className="absolute text-xl text-gray-400 top-4 right-4 hover:text-blue-600 dark:hover:text-white focus:outline-none"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <div className="flex items-center mb-6">
              <div className="p-3 mr-3 text-blue-600 bg-blue-100 rounded-full">
                <FontAwesomeIcon icon={faUser} className="text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Add New User</h2>
            </div>
            {success ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="p-4 mb-4 text-green-600 bg-green-100 rounded-full">
                  <FontAwesomeIcon icon={faCheck} className="text-3xl" />
                </div>
                <p className="text-lg font-semibold text-green-700 dark:text-green-400">User created successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 transition-all border border-gray-200 rounded-lg dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 transition-all border border-gray-200 rounded-lg dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Role</label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 transition-all border border-gray-200 rounded-lg dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Permissions</label>
                  <div className="flex flex-wrap gap-3">
                    {PERMISSIONS.map((perm) => (
                      <label key={perm.key} className="flex items-center px-3 py-1 space-x-2 bg-gray-100 rounded-lg cursor-pointer dark:bg-gray-800">
                        <input
                          type="checkbox"
                          checked={form.permissions.includes(perm.key)}
                          onChange={() => handlePermissionChange(perm.key)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded form-checkbox focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-200">{perm.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 font-semibold text-white transition-all duration-200 rounded-lg shadow-lg bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Create User
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <div className="mb-6 transition-colors duration-300 bg-white rounded-lg shadow dark:bg-gray-800">
        <div className="p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold dark:text-white">User List</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Name</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Email</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Role</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Permissions</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-gray-300">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-gray-300">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-gray-300">{user.role}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-gray-300">
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.map((perm) => (
                        <span key={perm} className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded text-xs font-medium">
                          {PERMISSIONS.find((p) => p.key === perm)?.label || perm}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-gray-300">
                    <button className="mr-3 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">Edit</button>
                    <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users; 