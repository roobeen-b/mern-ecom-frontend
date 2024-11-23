import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { captureOrder } from "@/store/shop/order-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

const PaypalReturn = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("token");
  const payerId = params.get("PayerID");

  useEffect(() => {
    if (paymentId && payerId) {
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

      dispatch(captureOrder({ paymentId, payerId, orderId })).then((res) => {
        if (res?.payload?.success) {
          sessionStorage.removeItem("currentOrderId");
          window.location.href = "/shopping/payment-success";
        }
      });
    }
  }, [dispatch, payerId, paymentId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Payment...Please wait!</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default PaypalReturn;
