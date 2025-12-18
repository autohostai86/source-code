/** @format */
import adminRoutePaths from '../views/Admin/adminRoutePaths.json';

const data = [
    // superadmin urls

    // user urls
    {
        id: 'user-dashboard',
        icon: 'iconsminds-home',
        label: 'user-dashboard',
        to: adminRoutePaths.Dashboard,
        name: 'Dashboard',
        userType: 'user',
        subs: [],
        style: '',
    },
];
export default data;
