/** @format */
// @ts-nocheck
import React from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import menuItems from '../../constants/menu';
import IntlMessages from '../../helpers/IntlMessages';
import useStore from '../../mobx/UseStore';

interface Props {
    Roles: any;
}
const TopnavEasyAccess = ({ Roles }: Props) => {
    const { UserState } = useStore();
    const { userType } = UserState.userData;

    return (
        <div className="position-relative d-none d-sm-inline-block">
            <UncontrolledDropdown className="dropdown-menu-right">
                <DropdownToggle className="header-icon" color="empty">
                    <i className="simple-icon-grid" />
                </DropdownToggle>

                <DropdownMenu className="position-absolute mt-3" right id="iconMenuDropdown">
                    {menuItems &&
                        menuItems.map((item) =>
                            userType === item.userType
                                ? Roles.map((Role) => (
                                      <NavLink
                                          to={item.to}
                                          style={{
                                              display:
                                                  (Array.isArray(Role[item.name]) && Role[item.name].length) > 0 ? 'inline-block' : 'none',
                                          }}
                                          className="icon-menu-item"
                                      >
                                          <i className={`${item.icon} d-block`} /> <IntlMessages id={item.label} />
                                      </NavLink>
                                  ))
                                : null,
                        )}
                </DropdownMenu>
                {/* {userType === "user" ? (
                    <DropdownMenu className="position-absolute mt-3" right id="iconMenuDropdown">
                        <NavLink to="/user/dashboard" className="icon-menu-item">
                            <i className="iconsminds-home d-block" /> <IntlMessages id="user-dashboard" />
                        </NavLink>
                        <NavLink to="/user/candidates" className="icon-menu-item">
                            <i className="iconsminds-students d-block" /> <IntlMessages id="user-candidates" />
                        </NavLink>
                        <NavLink to="/user/OutputViewer" className="icon-menu-item">
                            <i className="iconsminds-files d-block" /> <IntlMessages id="user-cv_status" />
                        </NavLink>
                        <NavLink to="/user/searchCV" className="icon-menu-item">
                            <i className="simple-icon-magnifier d-block" /> <IntlMessages id="user-search_screen" />
                        </NavLink>
                        <NavLink to="/user/manageTemplate" className="icon-menu-item">
                            <i className="iconsminds-gears d-block" /> <IntlMessages id="pages.manage-template" />
                        </NavLink>
                        <NavLink to="/user/cvProcessing" className="icon-menu-item">
                            <i className="iconsminds-gear d-block" /> <IntlMessages id="user-cv-processing" />
                        </NavLink>
                        <NavLink to="/user/batchProcessing" className="icon-menu-item">
                            <i className="iconsminds-gear d-block" /> <IntlMessages id="user-batch-processing" />
                        </NavLink>
                        <NavLink to="/user/userProfile" className="icon-menu-item">
                            <i className="iconsminds-profile d-block" /> <IntlMessages id="user-profile" />
                        </NavLink>
                        <NavLink to="/user/emailSettings" className="icon-menu-item">
                            <i className="iconsminds-email d-block" /> <IntlMessages id="user-email_settings" />
                        </NavLink>
                    </DropdownMenu>
                ) : null}
                {userType === "admin" ? (
                    <DropdownMenu className="position-absolute mt-3" right id="iconMenuDropdown">
                        <NavLink to="/admin/dashboard" className="icon-menu-item">
                            <i className="iconsminds-home d-block" /> <IntlMessages id="admin-dashboard" />
                        </NavLink>
                        <NavLink to="/admin/manageUser" className="icon-menu-item">
                            <i className="iconsminds-user d-block" /> <IntlMessages id="admin-manageUser" />
                        </NavLink>
                    </DropdownMenu>
                ) : null}
                {userType === "superadmin" ? (
                    <DropdownMenu className="position-absolute mt-3" right id="iconMenuDropdown">
                        <NavLink to="/superadmin/dashboard" className="icon-menu-item">
                            <i className="iconsminds-home d-block" /> <IntlMessages id="superadmin-dashboard" />
                        </NavLink>
                        <NavLink to="/superadmin/manageAdmin" className="icon-menu-item">
                            <i className="iconsminds-user d-block" /> <IntlMessages id="superadmin-manageadmin" />
                        </NavLink>
                        <NavLink to="/superadmin/manageOrg" className="icon-menu-item">
                            <i className="iconsminds-building d-block" /> <IntlMessages id="superadmin-manageorg" />
                        </NavLink>
                    </DropdownMenu>
                ) : null} */}
            </UncontrolledDropdown>
        </div>
    );
};

export default TopnavEasyAccess;
