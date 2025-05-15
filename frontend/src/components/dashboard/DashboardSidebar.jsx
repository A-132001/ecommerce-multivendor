import React, { useState, useEffect } from 'react';
import { Nav, Button, Offcanvas } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { 
  FaStore, 
  FaTachometerAlt, 
  FaBoxes, 
  FaClipboardList,
  FaSignOutAlt,
  FaChevronLeft, 
  FaChevronRight,
  FaBars
} from 'react-icons/fa';

const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeLink, setActiveLink] = useState('dashboard');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-collapse sidebar on mobile
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize on first render

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLinkClick = (link) => {
    setActiveLink(link);
    if (isMobile) {
      setShowMobileSidebar(false); // Close sidebar on mobile after selection
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Add your logout logic here
        Swal.fire(
          'Logged Out!',
          'You have been successfully logged out.',
          'success'
        );
      }
    });
  };

  const sidebarVariants = {
    collapsed: { width: 80 },
    expanded: { width: 250 }
  };

  const linkVariants = {
    hover: { scale: 1.05, originX: 0 },
    tap: { scale: 0.98 }
  };

  const navItems = [
    { path: '/dashboard/store-profile', name: 'Store Profile', icon: <FaStore />, key: 'store' },
    { path: '/dashboard', name: 'Dashboard', icon: <FaTachometerAlt />, key: 'dashboard' },
    { path: '/dashboard/products', name: 'Products', icon: <FaBoxes />, key: 'products' },
    { path: '/dashboard/orders', name: 'Orders', icon: <FaClipboardList />, key: 'orders' }
  ];

  // Mobile sidebar toggle button
  const MobileToggleButton = () => (
    <Button 
      variant="outline-warning" 
      className="d-md-none position-fixed top-2 start-2 z-3"
      onClick={() => setShowMobileSidebar(true)}
    >
      <FaBars />
    </Button>
  );

  // Desktop sidebar
  const DesktopSidebar = () => (
    <motion.div
      className="d-none d-md-flex flex-column bg-dark text-white vh-100 p-3 sticky-top"
      initial={false}
      animate={collapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        {!collapsed && (
          <motion.h3 
            className="text-warning mb-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Admin Panel
          </motion.h3>
        )}
        <Button 
          variant="outline-warning" 
          size="sm" 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1"
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </Button>
      </div>

      <Nav className="flex-column flex-grow-1">
        {navItems.map((item) => (
          <motion.div
            key={item.key}
            variants={linkVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Nav.Link
              href={item.path}
              className={`d-flex align-items-center mb-3 rounded ${activeLink === item.key ? 'bg-warning text-dark' : 'text-white'}`}
              onClick={() => handleLinkClick(item.key)}
            >
              <span className="me-3" style={{ minWidth: '24px' }}>
                {item.icon}
              </span>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {item.name}
                </motion.span>
              )}
            </Nav.Link>
          </motion.div>
        ))}
      </Nav>

      <motion.div
        variants={linkVariants}
        whileHover="hover"
        whileTap="tap"
      >
        <Button 
          variant="outline-danger" 
          className="w-100 mt-auto"
          onClick={handleLogout}
        >
          {!collapsed ? (
            <>
              <FaSignOutAlt className="me-2" />
              Logout
            </>
          ) : (
            <FaSignOutAlt />
          )}
        </Button>
      </motion.div>
    </motion.div>
  );

  // Mobile sidebar (Offcanvas)
  const MobileSidebar = () => (
    <Offcanvas
      show={showMobileSidebar}
      onHide={() => setShowMobileSidebar(false)}
      placement="start"
      className="bg-dark text-white"
    >
      <Offcanvas.Header closeButton closeVariant="white">
        <Offcanvas.Title className="text-warning">Admin Panel</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Nav className="flex-column">
          {navItems.map((item) => (
            <motion.div
              key={item.key}
              variants={linkVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Nav.Link
                href={item.path}
                className={`d-flex align-items-center mb-3 rounded ${activeLink === item.key ? 'bg-warning text-dark' : 'text-white'}`}
                onClick={() => handleLinkClick(item.key)}
              >
                <span className="me-3">
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Nav.Link>
            </motion.div>
          ))}
        </Nav>

        <Button 
          variant="outline-danger" 
          className="w-100 mt-4"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="me-2" />
          Logout
        </Button>
      </Offcanvas.Body>
    </Offcanvas>
  );

  return (
    <>
      <MobileToggleButton />
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default DashboardSidebar;