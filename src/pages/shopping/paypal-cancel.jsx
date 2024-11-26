import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaypalCancelPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/shopping");
  }, [navigate]);

  return <div>Redirecting...</div>;
};

export default PaypalCancelPage;
