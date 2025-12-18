import { observer } from "mobx-react-lite";
import { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Progress,
  FormGroup,
  Input,
  Row,
  Col,
  FormFeedback,
} from "reactstrap";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import SubscriptionService from "apps/client/src/services/SubscriptionService";
import useStore from "apps/client/src/mobx/UseStore";
import SubscriptionState from "apps/client/src/mobx/states/SubscriptionState";
import PlanService from "apps/client/src/services/PlanService";


const UserWallet = () => {
  const { UserState, UiState } = useStore();
  const { error, isLoading, Razorpay } = useRazorpay();
  const progressValue = Math.min(100, (Number(SubscriptionState.usageStatistics.availableBalance) / 100) * 100);
  const [amountData, setAmountData] = useState({
    amount: 0,
    inValid: false,
    inValidMsg: ""
  });

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
  
  const handlePayment = async () => {
    if (amountData.amount === 0) {
      setAmountData((prev) => ({...prev, inValid: true, inValidMsg: "Please enter a valid amount"}));
    } else if (amountData.amount < 1000) {
      setAmountData((prev) => ({...prev, inValid: true, inValidMsg: "Minimum amount should be INR 1000"}));
    } else {
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

      if (!res) {
        UiState.notify('Razropay failed to load!!', "error");
        return
      }
      const order = await PlanService.createOrder({price: amountData.amount});
      if (!order.error) {
        const options: RazorpayOrderOptions = {
          key: "rzp_test_fXmsjx95uQYbzA",
          amount: order.data.amount, // Amount in paise
          currency: "INR",
          name: "Autohost AI",
          description: "Payment for bot service",
          order_id: order.data.id,
          handler: async (response) => {
            const { error, msg } = await SubscriptionService.updateTrasaction({
              transactionData: {
                paymentId: response.razorpay_payment_id,
                orderId: order.data.orderId,
                recieptId: order.data.receiptId,
                amount: amountData.amount,
                currency: "INR",
                status: "completed",
                createdAt: Date.now()
              },
              subscriptionId: UserState.currentPlan?.["_id"],
              amount: Number(SubscriptionState.usageStatistics.availableBalance) != 0 ? Number(SubscriptionState.usageStatistics.availableBalance) + Number(amountData.amount) : Number(amountData.amount)
            });
      
            if (!error) {
              UiState.notify(msg, "success");
              SubscriptionState.setUsageStatistics("availableBalance", Number(SubscriptionState.usageStatistics.availableBalance) != 0 ? Number(SubscriptionState.usageStatistics.availableBalance) + Number(amountData.amount) : Number(amountData.amount));
              setAmountData((prev) => ({
                ...prev,
                amount: 0,
                inValid: false,
                inValidMsg: ""
              }));
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
  
    }
    
  }

  return (
    <Card className="mb-4 shadow-sm">
      <CardHeader className="bg-primary text-white">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0 text-dark">
            <i className="fa fa-credit-card me-2" />{" "}
            Your Balance
          </h4>
          <span className="h4 mb-0">INR {Number(SubscriptionState.usageStatistics.availableBalance).toFixed(2)}</span>
        </div>
        <p className="text-light">Pay as you go credit remaining</p>
      </CardHeader>

      <CardBody>
        <div className="mb-4">
          <div className="d-flex justify-content-between  mb-1">
            <span>Usage</span>
            <span>INR {Number(SubscriptionState.usageStatistics.availableBalance).toFixed(2)} remaining</span>
          </div>
          <Progress value={progressValue} />
        </div>

        <div className="text-muted small mb-2">
          {Number(SubscriptionState.usageStatistics.availableBalance) < 160 ? (
            <p>Your balance is running low. Consider adding more credits.</p>
          ) : (
            <p>Your balance is healthy. You're good to go!</p>
          )}
        </div>
      </CardBody>

      <CardFooter className="border-top pt-3">
        <Row className="align-items-center">
          <Col md="8">
            <FormGroup className="mb-1">
              <Input
                id="exampleEmail"
                name="email"
                placeholder="Enter amount"
                type="number"
                invalid={amountData.inValid}
                // @ts-ignore
                onChange={(e) => setAmountData((prev) => ({...prev, amount: Number(e.target.value)}))}
                value={amountData.amount}
              />
              {
                amountData.inValid && (
                  <FormFeedback>{amountData.inValidMsg}</FormFeedback>
                )
              }
            </FormGroup>
          </Col>
          <Col md="4">
            <Button
              color="outline-primary"
              className="w-100"
              onClick={handlePayment}
            >
              <i className="fa fa-usd me-2" />
              Add Credits
            </Button>
          </Col>
        </Row>
      </CardFooter>
    </Card>
  );
};

export default observer(UserWallet);
