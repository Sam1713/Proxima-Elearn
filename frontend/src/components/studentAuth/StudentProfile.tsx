import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Drawer, Card, Typography, List, ListItem, ListItemPrefix, IconButton, Input, Alert } from "@material-tailwind/react";
import { Bars3Icon, Cog6ToothIcon, CubeTransparentIcon, InboxIcon, MagnifyingGlassIcon, PowerIcon, PresentationChartBarIcon, ShoppingBagIcon, UserCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { FaHandPeace } from "react-icons/fa";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const [openAlert, setOpenAlert] = useState(false);

  // Function to close sidebar
  const handleLinkClick = () => {
    toggleSidebar(); // This will close the sidebar
  };

  return (
    <>
      <div className='py-16'>
        {/* Sidebar for large screens */}
        <div className='hidden md:flex fixed top-0 left-0 h-full z-30 bg-custom-sidebar  text-white w-64'>
          <div className='py-16'>
            <Card color="transparent" shadow={false} className="h-full p-4 bg-custom-sidebar text-white">
 <div className="mb-4 flex items-center gap-4 p-4">
      
      <Typography className='font-protest flex items-center gap-2' variant="h5" color="white">
        <FaHandPeace size={30} color='cyan' className="text-xl" /> {/* Adjust size with className or inline style */}
        Welcome
      </Typography>
    </div>
              <div className="p-2">
                <Input
                  icon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
                  label="Search"
                  className="mb-4 text-gray-100"
                />
              </div>
              <List color='white'>
                {[{ key: 'My Account', icon: <PresentationChartBarIcon className="h-5 w-5" />, text: 'My Account', link: '/studentProfile' },
                  { key: 'ecommerce', icon: <ShoppingBagIcon className="h-5 w-5" />, text: 'My Course', link: '/orderedCourses' },
                  { key: 'inbox', icon: <InboxIcon className="h-5 w-5" />, text: 'Inbox', link: '/chat' },
                  { key: 'profile', icon: <UserCircleIcon className="h-5 w-5" />, text: 'Payment info', link: '/paymentDetails' },
                  { key: 'settings', icon: <Cog6ToothIcon className="h-5 w-5" />, text: 'Settings', link: '/settings' },
                  { key: 'logout', icon: <PowerIcon className="h-5 w-5" />, text: 'Log Out', link: '/logout' }
                ].map(({ key, icon, text, link }) => (
                  <ListItem key={key} className="p-2 hover:bg-black hover:text-white rounded-md transition-colors text-white">
                    <ListItemPrefix>
                      {icon}
                    </ListItemPrefix>
                    <Typography variant="small">
                      <Link to={link} onClick={handleLinkClick}>{text}</Link>
                    </Typography>
                  </ListItem>
                ))}
              </List>
              <Alert open={openAlert} className="mt-auto bg-custom-alert text-white">
                <CubeTransparentIcon className="mb-4 h-12 w-12" />
                <Typography variant="h6" className="mb-1">Upgrade to PRO</Typography>
                <Typography variant="small" className="font-normal opacity-80">
                  Upgrade to Material Tailwind PRO and get even more components, plugins, advanced features, and premium.
                </Typography>
                <div className="mt-4 flex gap-3">
                  <Typography as="a" href="#" variant="small" className="font-medium opacity-80" onClick={() => setOpenAlert(false)}>Dismiss</Typography>
                  <Typography as="a" href="#" variant="small" className="font-medium text-blue-400">Upgrade Now</Typography>
                </div>
              </Alert>
            </Card>
          </div>
        </div>

        {/* Drawer for small screens */}
        <div className='md:hidden'>
          <IconButton variant="text" size="lg" onClick={toggleSidebar} className="text-gray-700">
            {isSidebarOpen ? (
              <XMarkIcon className="h-8 w-8" />
            ) : (
              <Bars3Icon className="h-8 w-8" />
            )}
          </IconButton>
          <Drawer open={isSidebarOpen} onClose={toggleSidebar} className="md:hidden">
            <Card color="transparent" shadow={false} className="h-full w-full p-4 bg-custom-sidebar text-white">
              <div className="mb-4 flex items-center gap-4 p-4">
                <img
                  src="https://docs.material-tailwind.com/img/logo-ct-dark.png"
                  alt="brand"
                  className="h-8 w-8"
                />
                <Typography variant="h5" color="white">Sidebar</Typography>
              </div>
              <div className="p-2">
                <Input
                  icon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
                  label="Search"
                  className="mb-4 text-gray-800"
                />
              </div>
              <List>
                {[{ key: 'My Account', icon: <PresentationChartBarIcon className="h-5 w-5" />, text: 'My Account', link: '/studentProfile' },
                  { key: 'ecommerce', icon: <ShoppingBagIcon className="h-5 w-5" />, text: 'My Courses', link: '/orderedCourses' },
                  { key: 'inbox', icon: <InboxIcon className="h-5 w-5" />, text: 'Inbox', link: '/chat' },
                  { key: 'profile', icon: <UserCircleIcon className="h-5 w-5" />, text: 'Payment info', link: '/paymentDetails' },
                  { key: 'settings', icon: <Cog6ToothIcon className="h-5 w-5" />, text: 'Settings', link: '/settings' },
                  { key: 'logout', icon: <PowerIcon className="h-5 w-5" />, text: 'Log Out', link: '/logout' }
                ].map(({ key, icon, text, link }) => (
                  <ListItem key={key} className="p-2 hover:bg-gray-700 rounded-md transition-colors">
                    <ListItemPrefix>
                      {icon}
                    </ListItemPrefix>
                    <Typography variant="small">
                      <Link to={link} onClick={handleLinkClick}>{text}</Link>
                    </Typography>
                  </ListItem>
                ))}
              </List>
              <Alert open={openAlert} className="mt-auto bg-custom-alert text-white">
                <CubeTransparentIcon className="mb-4 h-12 w-12" />
                <Typography variant="h6" className="mb-1">Upgrade to PRO</Typography>
                <Typography variant="small" className="font-normal opacity-80">
                  Upgrade to Material Tailwind PRO and get even more components, plugins, advanced features, and premium.
                </Typography>
                <div className="mt-4 flex gap-3">
                  <Typography as="a" href="#" variant="small" className="font-medium opacity-80" onClick={() => setOpenAlert(false)}>Dismiss</Typography>
                  <Typography as="a" href="#" variant="small" className="font-medium text-blue-400">Upgrade Now</Typography>
                </div>
              </Alert>
            </Card>
          </Drawer>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
