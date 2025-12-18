import React from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
);

interface DashboardChartsProps {
  activeUsers: number;
  inactiveUsers: number;
  transactions: number[];
  transactionLabels: string[];
}

const AdminDashboardCharts: React.FC<DashboardChartsProps> = ({
  activeUsers,
  inactiveUsers,
  transactions,
  transactionLabels,
}) => {
  const doughnutData = {
    labels: ['Active Users', 'Inactive Users'],
    datasets: [
      {
        data: [activeUsers, inactiveUsers],
        backgroundColor: ['#5E72E4', '#ADB5BD'], // blue and gray
        hoverOffset: 4,
      },
    ],
  };

  const doughnutOptions = {
    cutout: '50%',
    radius: '100%',
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  const lineData = {
    labels: transactionLabels,
    datasets: [
      {
        label: 'Transactions',
        data: transactions,
        fill: true,
        backgroundColor: 'rgba(94, 114, 228, 0.2)',
        borderColor: '#5E72E4',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#5E72E4',
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <>
      <Row className="mb-4">
        <Col md="6">
          <Card className="shadow h-100">
            <CardBody>
              <h5 className="text-center">User Status</h5>
              <div style={{ maxWidth: '220px', margin: '0 auto' }}>
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col md="6">
          <Card className="shadow h-100">
            <CardBody>
              <h5 className="text-center">Transactions Over Time</h5>
              <Line data={lineData} options={lineOptions} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AdminDashboardCharts;
