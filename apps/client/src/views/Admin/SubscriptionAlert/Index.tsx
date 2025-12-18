import { observer } from 'mobx-react-lite'
import logo from "../../../assets/img/access_denied.png";
import SubscriptionState from 'apps/client/src/mobx/states/SubscriptionState';
const Index = () => {
  return (
    <div className="p-3">
      <div className="text-center">
        <div className="d-flex justify-content-center mb-3">
          <img src={logo} alt="logo" className="img-fluid w-25 w-md-25" />
        </div>
        <p className="fw-bold fs-5 text-dark">Subscription Alert</p>
        {
          SubscriptionState.usageStatistics.planCategory === "free" ? (
            <p className="fs-6 text-dark">
              Your subscription limit has been exceeded. Please{" "}
              <a href="https://getcitrus.ai" target="_blank" rel="noopener noreferrer" className="text-primary">
                upgrade
              </a>{" "}
              to continue.
            </p>
          ) : (
            <p className="fs-6 text-dark">
              Your account balance is insufficient. Please add funds to continue using the service.
            </p>
          )
        }
      </div>
    </div>
  );
};

export default observer(Index);
