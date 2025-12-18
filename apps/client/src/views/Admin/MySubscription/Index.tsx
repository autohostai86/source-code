import useStore from "apps/client/src/mobx/UseStore";
import SubscriptionService from "apps/client/src/services/SubscriptionService";
import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Badge } from "reactstrap";
import SubscriptionCard from "./SubscriptionCard";
import "./Index.scss";
import UserWallet from "./UserWallet";
import SubscriptionState from "apps/client/src/mobx/states/SubscriptionState";
import PlanService from "apps/client/src/services/PlanService";
import { RazorpayOrderOptions } from "react-razorpay";
import Razorpay from "react-razorpay/dist/razorpay";

const Index = () => {
  const { UserState, UiState } = useStore();
  const [plans, setPlans] = useState([]);

  const getCurrentPlan = async () => {
    const { error, data, msg, plans } = await SubscriptionService.getSubscriptionData({ userId: UserState.userData.userId });
    if (!error) {
      if (data.length > 0) {
        const obj = {
          planCategory: data[0].billingDetails?.category ? data[0].billingDetails?.category : "",
          isExpired: data[0].isExpired ? data[0].isExpired : false,
          availableBalance: data[0].availableBalance ? data[0].availableBalance : 0
        }
        SubscriptionState.setUsageStatisticsBulk(obj)
        UserState.setCurrentPlan(data[0]);
      } else {
        UserState.setCurrentPlan({});
      }
      setPlans(plans);
    } else {
      UiState.notify(msg, "error");
    }
  }

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = src
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }

  const handleSubscriptionChange = async (planId: string) => {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

    if (!res) {
      UiState.notify('Razropay failed to load!!', "error");
      return
    }
    const order = await PlanService.createOrder({price: 1000});
    if (!order.error) {
      const options: RazorpayOrderOptions = {
        key: "rzp_test_fXmsjx95uQYbzA",
        amount: order.data.amount, // Amount in paise
        currency: "INR",
        name: "Autohost AI",
        description: "Payment for bot service",
        order_id: order.data.id,
        handler: async (response) => {
          const payload = {
            transactionData: {
              paymentId: response.razorpay_payment_id,
              orderId: order.data.orderId,
              recieptId: order.data.receiptId,
              amount: 1000,
              currency: "INR",
              status: "completed",
              createdAt: Date.now()
            },
            id: UserState.currentPlan?.["_id"],
            amount: 1000,
            billingId: planId,
          }
          const { error, msg } = await SubscriptionService.changeSubscription(payload);
          if (!error) {
            UiState.notify(msg, "success");
            getCurrentPlan();

          } else {
            UiState.notify(msg, "error");
          }
        },
        prefill: {
          name: UserState.userData.name,
          email: UserState.userData.email,
          contact: UserState.userData.contactNo,
        },
        theme: {
          color: "#051E5C",
        },
      };
      const razorpayInstance = new Razorpay(options);
      razorpayInstance.open();

    } else {
      UiState.notify(order.msg, "error");
    }
    const payload = {
      transactionData: {
        paymentId: "45",
        orderId: "",
        recieptId: "",
        amount: 1000,
        currency: "INR",
        status: "completed",
        createdAt: Date.now()
      },
      id: UserState.currentPlan?.["_id"],
      amount: 1000,
      billingId: planId,
    }
  };

  useEffect(() => {
    getCurrentPlan();
  }, [])

  return (

    <Container fluid className="py-5">
      <section className="mb-5">
        <Row className="align-items-center justify-content-between mb-4">
          <Col md="6">
            <h2 className="h4 text-dark">Your Subscription</h2>
            <p className="text-muted">Manage your plan and usage</p>
          </Col>
        </Row>
        <Row>
          {plans.length > 0 && plans.map((plan) => (
            <Col md="6" className="mb-4" key={plan.id}>
              <SubscriptionCard
                plan={plan}
                isActive={UserState.currentPlan?.["billingDetails"]?.["_id"] === plan._id}
                onSubscribe={() => handleSubscriptionChange(plan._id)}
              />
            </Col>
          ))}
        </Row>
      </section>

      {UserState.currentPlan?.['billingDetails']?.['category'] === "payAsYouGo" && (
        <section>
          <Row className="align-items-center justify-content-between mb-4">
            <Col>
              <h2 className="h4 text-dark">Your Credit Balance</h2>
              <p className="text-muted">Manage your Pay As You Go credits</p>
            </Col>
          </Row>

          <UserWallet />
        </section>
      )}
    </Container>
  );
};

export default Index;
