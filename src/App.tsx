import { FaHistory, FaSignOutAlt, FaUserEdit } from 'react-icons/fa';
import { SingleLevelDropdownMenu } from './components/SingleLevelDropdownMenu';
import { useNavigate } from 'react-router-dom';
import {
  MdDarkMode,
  MdDelete,
  MdLightMode,
  MdMonitor,
} from 'react-icons/md';
import { SplitButtonDropdown } from './components/SplitButtonDropdown';
import { useState } from 'react';
import { MultiLevelDropdownMenu } from './components/MultiLevelDropdownMenu';

const App = () => {
  const [theme, setTheme] = useState('system'); // Initial theme state

  const navigate = useNavigate();

  return (
    <>
      <h1>Current Theme: {theme}</h1>

      <div className="flex justify-center items-center mt-20">
        {/* Display the selected theme */}
        <SingleLevelDropdownMenu
          buttonLabel="Single dropdown"
          items={[
            {
              title: 'Edit Profile',
              url: '/edit',
              icon: <FaUserEdit />,
            },
            {
              title: 'View Activity',
              url: '/view',
              icon: <FaHistory />,
            },
            {
              title: 'Logout',
              icon: <FaSignOutAlt />,
              action: () => alert('Logged out!'),
            },
          ]}
        />
        <SplitButtonDropdown
          buttonLabel="View profile"
          defaultAction={() => navigate('/profile')}
          items={[
            {
              title: 'Edit Profile',
              url: '/edit',
              icon: <FaUserEdit />,
            },
            {
              title: 'Delete profile',
              action: () => alert('Delete profile'),

              icon: <MdDelete />,
            },
          ]}
        />
        <MultiLevelDropdownMenu
          buttonLabel="Multi level dropdown"
          items={[
            {
              title: 'Edit Profile',
              url: '/edit',
              icon: <FaUserEdit />,
            },
            {
              title: 'View Activity',
              url: '/view',
              icon: <FaHistory />,
            },
            {
              title: 'Theme',
              icon: <MdMonitor />,
              submenu: [
                {
                  title: 'Light',
                  icon: <MdLightMode />,
                  action: () => setTheme('light'),
                },
                {
                  title: 'Dark',
                  icon: <MdDarkMode />,
                  action: () => setTheme('dark'),
                },
                {
                  title: 'System',
                  icon: <MdMonitor />,
                  action: () => setTheme('system'),
                },
              ],
            },
            {
              title: 'Logout',
              icon: <FaSignOutAlt />,
              action: () => alert('Logged out!'),
            },
          ]}
        />
      </div>
    </>
  );
};

export default App;
