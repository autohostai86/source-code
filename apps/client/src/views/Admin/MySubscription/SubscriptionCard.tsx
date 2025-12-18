import { observer } from "mobx-react-lite";
import { Card, CardBody, CardHeader, CardFooter, Button, Badge } from "reactstrap";

interface Feature {
    name: string;
    included: boolean;
}

interface Plan {
    id: string;
    name: string;
    description: string;
    price: string;
    priceDetail: string;
    features: Feature[];
}

interface SubscriptionCardProps {
    plan: Plan;
    isActive: boolean;
    onSubscribe: () => void;
}

const SubscriptionCard = ({ plan, isActive, onSubscribe }: SubscriptionCardProps) => {
    return (
        <Card
            className={`h-100 d-flex flex-column transition border shadow shadow-sm ${isActive ? "border-2 border-primary" : "border-secondary"
                }`}
        >
            <CardHeader className="bg-white pb-2">
                {isActive && (
                    <Badge color="primary" pill className="mb-2">
                        Current Plan
                    </Badge>
                )}
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">{plan?.["title"]}</h5>
                    {plan?.["category"] === "free" && <span className="h4 fw-bold">INR {plan.price}</span>}
                </div>
                <p className="text-muted mt-2 mb-1">{plan.description}</p>
                <small className="text-secondary">{plan.priceDetail}</small>
            </CardHeader>
            {
                plan?.["category"] === "payAsYouGo" && (
                    <CardBody className="flex-grow-1">
                        <ul className="list-unstyled mb-0">
                            <li className="d-flex align-items-start mb-3">
                                <span
                                    className={`me-2 d-flex align-items-center justify-content-center rounded-circle text-white bg-primary
                        }`}
                                    style={{ width: "20px", height: "20px", fontSize: "12px" }}
                                >
                                    <i className={`fa fa-check`}></i>
                                </span>
                                <span className={"text-dark ml-1"}>
                                    Starting at INR 1000
                                </span>
                            </li>
                            <li className="d-flex align-items-start mb-3">
                                <span
                                    className={`me-2 d-flex align-items-center justify-content-center rounded-circle text-white bg-primary
                        }`}
                                    style={{ width: "20px", height: "20px", fontSize: "12px" }}
                                >
                                    <i className={`fa fa-check`}></i>
                                </span>
                                <span className={"text-dark ml-1"}>
                                    Get charged based on usage
                                </span>
                            </li>
                        </ul>
                    </CardBody>
                )
            }


            <CardFooter className="bg-white border-top-0 pt-3">
                {
                    plan?.["category"] !== "free" ? (
                        <button
                            disabled={isActive}
                            onClick={onSubscribe}
                            className="btn w-100 custom-button"
                        >
                            {isActive ? "Current plan" : "Upgrade plan"}
                        </button>
                    ) : (
                        <button
                            disabled={true}
                            // onClick={onSubscribe}
                            className="btn w-100 btn-outlined-secondary text-black"
                        >
                            {isActive ? "Current plan" : "Disabled plan"}
                        </button>
                    )
                }
            </CardFooter>
        </Card>
    );
};

export default observer(SubscriptionCard);
