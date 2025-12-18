/** @format */
import React, { Component } from 'react';
import adminRoutePaths from './adminRoutePaths.json';
import { exact } from 'prop-types';

const Dashboard = React.lazy(() => import('./Dashboard'));
const Chatbot = React.lazy(() => import('./Chatbot/Index'));
const CreateChatbot = React.lazy(() => import('./Chatbot/Create/Create'));
const EditChatbot = React.lazy(() => import('./Chatbot/Edit/Edit'));
const Inbox = React.lazy(() => import('./Inbox/Index'));
const ManageCustomer = React.lazy(() => import('./ManageCustomer/Index'));
const BillingModule = React.lazy(() => import('./BillingModule/Index'));
const Settings = React.lazy(() => import('./Settings/Index'));
const UrgentTags = React.lazy(() => import('./UrgentTags/Index'));
const Listing = React.lazy(() => import("./Listing/Index"));
const ViewListing = React.lazy(() => import("./ViewListing/Index"));
// const ConversationalLog = React.lazy(() => import("./ConversationalLog/index"));
// const Plan = React.lazy(() => import("./Plan/Index"));
const Plan = React.lazy(() => import("./MySubscription/Index"));
const Transactions = React.lazy(() => import("./Transactions/Index"));
const CreateOrUpdate = React.lazy(() => import("./Listing/CreateOrUpdate/Index"));
const Profile = React.lazy(() => import('./Profile/Index'));
const SubscriptionAlert = React.lazy(() => import('./SubscriptionAlert/Index'));

const routes = [
    {
        component: Dashboard,
        path: adminRoutePaths.Dashboard,
        exact: true,
        icon: "fa fa-home",
        name: "Dashboard",
        isMenu: true,
        isAdmin: false
    },
    {
        component: Chatbot,
        path: adminRoutePaths.Chatbot,
        exact: true,
        icon: "fa fa-comment",
        name: "Chatbot",
        isMenu: true,
        isAdmin: true
    },
    {
        component: CreateChatbot,
        path: adminRoutePaths.CreateBot,
        exact: true,
        icon: "fa fa-comment",
        name: "Create Chatbot",
        isMenu: false,
        isAdmin: true
    },
    {
        component: EditChatbot,
        path: adminRoutePaths.EditBot,
        exact: true,
        icon: "fa fa-comment text-warning",
        name: "Edit Chatbot",
        isMenu: false,
        isAdmin: true
    },
    {
        component: Inbox,
        path: adminRoutePaths.Inbox,
        exact: true,
        icon: "fa fa-inbox",
        name: "Inbox",
        isMenu: true,
        isAdmin: false
    },
    {
        component: ManageCustomer,
        path: adminRoutePaths.ManageCustomer,
        exact: true,
        icon: "fa fa-users",
        name: "Manage Customer",
        isMenu: true,
        isAdmin: true
    },
    {
        component: BillingModule,
        path: adminRoutePaths.BillingModule,
        exact: true,
        icon: "fa fa-file-pdf-o",
        name: "Billing Module",
        isMenu: true,
        isAdmin: true
    },
    {
        component: Settings,
        path: adminRoutePaths.Settings,
        exact: true,
        icon: "fa fa-users",
        name: "View",
        isMenu: false,
        isAdmin: true
    },
    {
        component: UrgentTags,
        path: adminRoutePaths.UrgentTags,
        exact: true,
        icon: "fa fa-tag",
        name: "Urgent Tags",
        isMenu: true,
        isAdmin: false
    },
    {
        component: ViewListing,
        path: adminRoutePaths.ViewListing,
        exact: true,
        icon: "fa fa-users",
        name: "View",
        isMenu: false,
        isAdmin: true
    },
    {
        component: Listing,
        path: adminRoutePaths.Listing,
        exact: true,
        icon: "fa fa-list",
        name: "Listing",
        isMenu: true,
        isAdmin: false
    },
    // {
    //     component: ConversationalLog,
    //     path: adminRoutePaths.ConversationalLog,
    //     exact: true,
    //     icon: "fa fa-history",
    //     name: "Conversational Log",
    //     isMenu: true,
    //     isAdmin: false
    // },
    {
        component: Plan,
        path: adminRoutePaths.Plan,
        exact: true,
        icon: "fa fa-shopping-cart",
        name: "Plan",
        isMenu: true,
        isAdmin: false
    },
    {
        component: Transactions,
        path: adminRoutePaths.Transactions,
        exact: true,
        icon: "fa fa-credit-card-alt",
        name: "Transactions",
        isMenu: true,
        isAdmin: true
    },
    {
        component: CreateOrUpdate,
        path: adminRoutePaths.ManageListing,
        exact: true,
        icon: "fa fa-credit-card-alt",
        name: "CreateOrUpdate",
        isMenu: false,
        isAdmin: false
    },
    {
        component: Profile,
        path: adminRoutePaths.Profile,
        exact: true,
        icon: "fa fa-list",
        name: "Listing",
        isMenu: false,
        isAdmin: false
    },
    {
        component: SubscriptionAlert,
        path: adminRoutePaths.SubscriptionAlert,
        exact: true,
        icon: "fa fa-list",
        name: "Listing",
        isMenu: false,
        isAdmin: false
    },

];

export default routes;
