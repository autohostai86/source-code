import React from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface DashboardChartsProps {
  messagesCount: number;
  unreadMessagesCount: number;
  listingsCount: number;
  tagsCount: number;
  avgResponseTime: number;
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({
  messagesCount,
  unreadMessagesCount,
  listingsCount,
  tagsCount,
  avgResponseTime,
}) => {
  const messageChartData = {
    labels: ['Unread', 'Read'],
    datasets: [
      {
        data: [unreadMessagesCount, messagesCount - unreadMessagesCount],
        backgroundColor: ['#5E72E4', '#ADB5BD'], // blue and gray
        hoverOffset: 4,
      },
    ],
  };

  const listingTagData = {
    labels: ['Listings', 'Tags'],
    datasets: [
      {
        label: 'Count',
        data: [listingsCount, tagsCount],
        backgroundColor: ['#11CDEF', '#8898AA'], // cyan and gray
        barThickness: 30,
      },
    ],
  };

  const doughnutOptions = {
    cutout: '50%', // shrink doughnut size more
    radius: '100%', // control overall chart radius
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <>
      <Row className="mb-4">
        <Col md="6">
          <Card className="shadow h-100">
            <CardBody>
              <h5 className="text-center">Message Read Status</h5>
              <div style={{ maxWidth: '220px', margin: '0 auto' }}>
                <Doughnut data={messageChartData} options={doughnutOptions} />
              </div>
            </CardBody>
          </Card>
        </Col>
        {/* <Col md="6">
          <Card className="shadow h-100">
            <CardBody>
              <h5 className="text-center">Listings vs Tags</h5>
              <Bar
                data={listingTagData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    y: { beginAtZero: true },
                  },
                }}
              />
            </CardBody>
          </Card>
        </Col> */}
        <Col md="6" >
          <Card className="shadow text-center">
            <CardBody>
              <h5>Average Response Time</h5>
              <h2 className="text-primary">{avgResponseTime} sec</h2>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DashboardCharts;
