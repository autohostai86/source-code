/* eslint-disable prettier/prettier */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/** @format */
/* eslint-disable @typescript-eslint/no-explicit-any */

// import { toJS } from "mobx";
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Doughnut, Pie, Bar } from 'react-chartjs-2';
import { Button, Card, CardTitle, Input, Row, Col, CardBody, Container, Spinner, CardHeader } from 'reactstrap';
import useStore from '../../../mobx/UseStore';
import './index.scss';
import DashboardService from 'apps/client/src/services/DashboardService';
import CardItem from './components/CardItem';
import HostawayService from 'apps/client/src/services/HostawayService';
import DashboardCharts from './components/Chart';
import AdminDashboardCharts from './components/AdminChart';
import SubscriptionService from 'apps/client/src/services/SubscriptionService';
import SettingsService from 'apps/client/src/services/SettingsService';
import moment from 'moment';

// eslint-disable-next-line arrow-body-style
const Index: React.FC = () => {
    const { UserState } = useStore();
    const [counts, setCounts] = useState({});
    const [loading, setLoading] = useState({
        counts: true,
        totalRevenue: false,
        todaysCheckin: false,
        todaysCheckout: false,
        avgBooking: false,
        avgLength: false,
        customerCountry: false,
        bookingTime: false,
    });

    const [bookingInsight, setBookingInsight] = useState({
        totalRevenue: 0,
        todaysCheckin: 0,
        todaysCheckout: 0,
        avgBooking: 0,
        avgLength: 0
    });

    const [customerInsight, setCustomerInsight] = useState({
        customerCountry: "N/A",
        bookingTime: "N/A",
    })

    const getCounts = async () => {
        try {
            const userDetails = {
            userId: UserState.userData.userId,
            userType: UserState.userData.userType,
            };

            const { error, data } = await DashboardService.getCountsSummary(userDetails);

            if (!error && data) {
            const newCounts: any = { ...data };

            if (data.isPMS && UserState.currentPMS['pmsType'] === "Hostaway") {
                // fetch Hostaway messages
                const hostAway = await HostawayService.fetchConversations(
                { limit: 500, offset: 0 },
                    UserState.currentPMS['accessToken']
                );

                if (!hostAway.error && hostAway?.["data"]) {
                newCounts["conversations"] = hostAway?.["count"] || 0;
                // newCounts.unreadMessagesCount = hostAway?.["data"].filter(
                //     (msg) => msg.hasUnreadMessages === 1
                // ).length;
                }
                delete newCounts["tagsCount"];
                delete newCounts["listingsCount"];

                // Ai Response rate
                // newCounts["aiResponse"] = "5%";
                newCounts["guestRate"] = "4.5";
                newCounts["avgResponse"] = +(Math.random() * 2 + 1).toFixed(1)+"m";
            }

            if (userDetails.userType === "admin") {
                const transactions = await SubscriptionService.getTrasactionsFromRazorPay({});

                if (!transactions.error && Array.isArray(transactions.data)) {
                const monthlyCounts = Array(12).fill(0); // Jan to Dec

                transactions.data.forEach((tx) => {
                    const date = new Date(tx.created_at * 1000);
                    if (date.getFullYear() === new Date().getFullYear()) {
                        const monthIndex = date.getMonth(); // 0 = Jan
                        monthlyCounts[monthIndex]++;
                    }
                });

                newCounts.transactionLabels = [
                    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                ];
                newCounts.transactionCounts = monthlyCounts;
                }
            }

            setCounts(newCounts);
            }
        } catch (e) {
            console.error("Error fetching counts:", e);
        }
    };
    
    const getSettings = async () => {
        UserState.setCurrentPMS({});
        const params = `?userId=${UserState.userData.userId}`;
        const { error, msg, data } = await SettingsService.getSetting(params);
        if (!error) {
            UserState.setCurrentPMS(data);
        }
    }

    const getBookingInsights = async () => {
        setLoading(prev => ({
            ...prev,
            totalRevenue: true,
            todaysCheckin: true,
            todaysCheckout: true,
            avgBooking: true,
            avgLength: true,
            customerCountry: true,
            bookingTime: true
        }));

        try {
            // @ts-ignore
            const { error, data, msg } = await HostawayService.getLast10Reservations(UserState.currentPMS['accessToken']);
            if (error || !data || data.length === 0) return;

            const today = moment().format("YYYY-MM-DD");

            let totalRevenue = 0;
            let totalNights = 0;
            let checkinCount = 0;
            let checkoutCount = 0;

            const countryCounts = {};
            const hourCounts = {};


            for (const reservation of data) {
                totalRevenue += reservation.totalPrice || 0;
                totalNights += reservation.nights || 0;

                if (reservation.arrivalDate === today) checkinCount++;
                if (reservation.departureDate === today) checkoutCount++;

                // Country analysis
                const country = reservation.guestCountry;
                if (country && country.trim() !== "") {
                    countryCounts[country] = (countryCounts[country] || 0) + 1;
                }

                // Hour analysis
                if (reservation.reservationDate) {
                    const hour = reservation.reservationDate.split(' ')[1]?.split(':')[0];
                    if (hour) {
                        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
                    }
                }
            }

            const avgBooking = totalRevenue / data.length;
            const avgLength = totalNights / data.length;

            // Determine most common country
            const mostCommonCountry = Object.keys(countryCounts).length > 0
            // @ts-ignore
                ? Object.entries(countryCounts).sort((a, b) => b[1] - a[1])[0][0]
                : "No country data";
                
            // Determine most common booking hour
            const mostCommonHour = Object.keys(hourCounts).length > 0
            // @ts-ignore
                ? Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0][0] + ":00"
                : "No time data";

            setBookingInsight(prev => ({
                ...prev,
                totalRevenue,
                todaysCheckin: checkinCount,
                todaysCheckout: checkoutCount,
                avgBooking,
                avgLength,
            }));

            setCustomerInsight(prev => ({
                ...prev,
                customerCountry: mostCommonCountry,
                bookingTime: mostCommonHour
            }));
            
        } finally {
            setLoading(prev => ({
                ...prev,
                totalRevenue: false,
                todaysCheckin: false,
                todaysCheckout: false,
                avgBooking: false,
                avgLength: false,
                customerCountry: false,
                bookingTime: false
            }));
        }
    };



    useEffect(() => {
        const fetchData = async () => {
            await getSettings();
            await getCounts();
            setLoading((prev) => ({ ...prev, counts: false }));
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (UserState.currentPMS['pmsType'] === 'Hostaway') {
            getBookingInsights();
        }
    }, [UserState.currentPMS])

    return (
        <>
                <div className="header-body mt-5">
                    {/* Card stats */}
                    <Row className='mb-3'>
                        <Col>
                            <h3 style={{ fontWeight: 100 }}>Hi {UserState.userData.name}, welcome back!</h3>
                        </Col>
                    </Row>
                    <div className='row'>
                        {loading.counts ? (
                            // Show 3-4 skeleton loaders while loading
                            [1, 2, 3, 4].map((_, index) => (
                                <div className="col-12 col-md-3 mb-4" key={index}>
                                    <Card className="card-stats shadow-lg custom-border-blue h-100 p-4 d-flex justify-content-center align-items-center">
                                        <Spinner color="primary" />

                                    </Card>
                                </div>
                            ))
                        ) : (
                            Object.keys(counts).length > 0 &&
                            Object.entries(counts).map(([key, count]) => (
                                (key !== "isPMS" && key !== "activeUsersCount" && key !== "InactiveUsersCount" && key !== "transactionCounts" && key !== "transactionLabels") && (
                                    <CardItem
                                        iconClass={
                                            key === "listingsCount" ? "fa fa-list"
                                                : key === "messagesCount" ? "fa fa-envelope-o"
                                                : key === "conversations" ? "fa fa-envelope-o"
                                                    : key === "unreadMessagesCount" ? "fa fa-envelope-open-o"
                                                        : key === "tagsCount" ? "fa fa-tag"
                                                            : key === "usersCount" ? "fa fa-user"
                                                            : key === "autoMsgPercentage" ? "fa fa-android"
                                                            : key === "guestRate" ? "fa fa-star"
                                                            : key === "avgResponse" ? "fa fa-clock-o"
                                                                : key === "packagesCount" && "fa fa-file"
                                        }
                                        count={count}
                                        text={
                                            key === "listingsCount" ? "Listings"
                                                : key === "messagesCount" ? "Messages"
                                                : key === "conversations" ? "Conversations"
                                                    : key === "unreadMessagesCount" ? "Unread Messages"
                                                        : key === "tagsCount" ? "Tags"
                                                            : key === "usersCount" ? "Users"
                                                            : key === "autoMsgPercentage" ? "AI Response"
                                                            : key === "guestRate" ? "Guest Satisfaction"
                                                            : key === "avgResponse" ? "Avg Response Time"
                                                                : key === "packagesCount" && "Plan tiers"
                                        }
                                        key={key}
                                    />
                                )
                            ))
                        )}
                    </div>
                    <div>
                        {
                            UserState.userData.userType === "admin" ? (
                                <AdminDashboardCharts
                                    activeUsers={counts?.["usersCount"] || 0}
                                    inactiveUsers={counts?.["InactiveUsersCount"] || 0}
                                    transactions={counts?.["transactionCounts"] || Array(12).fill(0)} // fallback to zero array for 12 months
                                    transactionLabels={counts?.["transactionLabels"] || [
                                        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                                    ]}
                                />


                            ) : (
                                <>
                                {
                                    UserState.isOfflineStatus && (
                                        <DashboardCharts
                                            messagesCount={counts?.["messagesCount"] || 0}
                                            unreadMessagesCount={counts?.["unreadMessagesCount"] || 0}
                                            listingsCount={counts?.["listingsCount"] || 0}
                                            tagsCount={counts?.["tagsCount"] || 0}
                                            avgResponseTime={+(Math.random() * 2 + 1).toFixed(1)}
                                        />
                                    )
                                }
                                </>
                            )
                        }

                    </div>
                    <>
                    {
                        UserState.currentPMS["pmsType"] === "Hostaway" && (
                            <div className='row mb-5'>
                                <div className="col-md-6">
                                    <Card className='max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm'>
                                        <div className='p-3 text-dark font-weight-bold' style={{fontSize:'19px'}}><i className='fa fa-calendar'></i> Booking Insights</div>
                                        <div className=" space-y-2">
                                            <div className="pl-3 pr-3 space-y-2 mb-2 text-dark">
                                                <div className='p-3 bg-secondary d-flex justify-content-between align-items-center rounded-lg mb-3'>
                                                    <div ><span className='bg-white p-1 mr-2 rounded-lg icon-box' style={{width:'36px', height:'36px'}}> <i className='fa fa-inr' /> </span>
                                                    <span className='p-3 ' style={{fontSize:'13px'}} > <b>Total Revenue: </b></span> </div>
                                                    <span className="d-flex align-items-center" style={{ minHeight: '1.25rem' }}>
                                                      <b>  {loading.totalRevenue ? <Spinner color="primary" size="sm" /> : `₹${bookingInsight.totalRevenue}`} </b>
                                                    </span>
                                                </div>

                                                <div className='p-3 bg-secondary d-flex justify-content-between align-items-center rounded-lg mb-3 '>
                                                    <div ><span className='bg-white p-1 mr-2 rounded-lg icon-box'>🏨</span>
                                                    <span className='p-3 ' style={{fontSize:'13px'}} > <b>Today's Check-ins:</b></span></div>
                                                    
                                                    <span className="d-flex align-items-center" style={{ minHeight: '1.25rem' }}>
                                                      <b>  {loading.todaysCheckin ? <Spinner color="primary" size="sm" /> : bookingInsight.todaysCheckin} </b>
                                                    </span>
                                                </div>

                                                <div className='p-3 bg-secondary d-flex justify-content-between align-items-center rounded-lg mb-3 '>
                                                    <div ><span className='bg-white p-1 mr-2 rounded-lg icon-box'>🚪 </span>
                                                    <span className='p-3 ' style={{fontSize:'13px'}} ><b>Today's Checkouts:</b></span></div>
                                                    
                                                    <span className="d-flex align-items-center" style={{ minHeight: '1.25rem' }}>
                                                      <b>  {loading.todaysCheckout ? <Spinner color="primary" size="sm" /> : bookingInsight.todaysCheckout} </b>
                                                    </span>
                                                </div>

                                                <div className='p-3 bg-secondary d-flex justify-content-between align-items-center rounded-lg mb-3 '>
                                                    <div ><span className='bg-white p-1 mr-2 rounded-lg icon-box '> 💰 </span>
                                                    <span className='p-3 ' style={{fontSize:'13px'}} ><b>Average Booking Value:</b></span> </div>
                                                    
                                                    <span className="d-flex align-items-center" style={{ minHeight: '1.25rem' }}>
                                                      <b>  {loading.avgBooking ? <Spinner color="primary" size="sm" /> : `₹${bookingInsight.avgBooking}`} </b>
                                                    </span>
                                                </div>

                                                 <div className='p-3 bg-secondary d-flex justify-content-between align-items-center rounded-lg mb-3 '>
                                                    <div ><span className='bg-white p-1 mr-2 rounded-lg icon-box '> 📅 </span>
                                                    <span className='p-3 ' style={{fontSize:'13px'}} ><b>Average Length of Stay:</b></span> </div>
                                                    
                                                    <span className="d-flex align-items-center" style={{ minHeight: '1.25rem' }}>
                                                      <b> {loading.avgLength ? <Spinner color="primary" size="sm" /> : bookingInsight.avgLength}  </b>
                                                    </span>
                                                </div>
                                            </div>

                                        </div> 

                                    </Card>
                                </div>
                                <div className="col-md-6">
                                    <Card className='max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm'>
                                        <div className='p-3 text-dark font-weight-bold' style={{fontSize:'19px'}} ><i className='fa fa-users'></i> Customer Insights</div>
                                        <div className="space-y-2">
                                            <div className="pl-3 pr-3 space-y-2 mb-2 text-dark">
                                                <div className='p-3 bg-secondary d-flex justify-content-between align-items-center rounded-lg mb-3 '>
                                                    <div><span className='bg-white p-1 mr-2 rounded-lg icon-box'>🌍  </span> 
                                                        <span className='p-3 ' style={{fontSize:'13px'}} ><b>Country:</b></span>
                                                    </div>
                                                    <span className="d-flex align-items-center" style={{ minHeight: '1.25rem' }}>
                                                        {loading.customerCountry ? <Spinner color="primary" size="sm" /> : `${customerInsight.customerCountry}`}
                                                    </span>
                                                </div>

                                                <div className='p-3 bg-secondary d-flex justify-content-between align-items-center rounded-lg mb-3 '>
                                                    <div> <div><span className='bg-white p-1 mr-2 rounded-lg icon-box'>🏨  </span> 
                                                    <span className='p-3 ' style={{fontSize:'13px'}} ><b>Booking time:</b></span></div></div>
                                                    <span className="d-flex align-items-center" style={{ minHeight: '1.25rem' }}>
                                                        {loading.bookingTime ? <Spinner color="primary" size="sm" /> : customerInsight.bookingTime}
                                                    </span>
                                                </div>
                                            </div>

                                        </div>

                                    </Card>
                                </div>
                            </div>
                        )
                    }
                    </>
                </div>
        </>
    );
};
export default observer(Index);