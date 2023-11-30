import React from 'react';
import { Layout} from 'antd';
import './index.style.less';
import AppLogo from '../components/AppLogo';
import PropTypes from 'prop-types';
// import {FiMoreVertical} from 'react-icons/fi';
import {AiOutlineMenu} from 'react-icons/ai';

const AppHeader = ({isCollapsed, onToggleSidebar}) => {
  const {Header} = Layout;
  
  // const menuMobile = (
  //   <Menu>
  //     <AppHeaderMessages />
  //     <AppNotifications />
  //     <AppLanguageSwitcher />
  //   </Menu>
  // );

  return (
    <Header className='app-header'>
      <a className='trigger' onClick={() => onToggleSidebar(!isCollapsed)}>
        <AiOutlineMenu />
      </a>
      <AppLogo />
      
      <div className='app-header-sectionDesktop'>
        {/* <AppLanguageSwitcher /> */}
        
      </div>
      <div className='app-header-section-mobile'>
        {/* <Dropdown overlay={menuMobile} trigger={['click']}>
          <a className='ant-dropdown-link' onClick={(e) => e.preventDefault()}>
            <FiMoreVertical />
          </a>
        </Dropdown> */}
      </div>
    </Header>
  );
};

export default AppHeader;

AppHeader.propTypes = {
  onToggleSidebar: PropTypes.func,
  isCollapsed: PropTypes.bool,
};
