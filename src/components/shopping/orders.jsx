import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Dialog } from "../ui/dialog";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersByUser } from "@/store/shop/order-slice";
import { formatDateTime } from "@/lib/utils";
import { Badge } from "../ui/badge";

const ShoppingOrders = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList } = useSelector((state) => state.shopOrder);
  const [openOrderDetailsDialog, setOpenOrderDetailsDialog] = useState(false);

  useEffect(() => {
    dispatch(getAllOrdersByUser(user?.id));
  }, [dispatch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0 ? (
              orderList.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>{formatDateTime(order.orderDate)}</TableCell>
                  <TableCell className="capitalize">
                    <Badge
                      className={`py-1 px-3 ${
                        order?.orderStatus === "confirmed"
                          ? "bg-green-500"
                          : order?.orderStatus === "rejected"
                          ? "bg-red-600"
                          : "bg-black"
                      }`}
                    >
                      {order?.orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button onClick={() => setOpenOrderDetailsDialog(true)}>
                      View Details
                    </Button>
                    <Dialog
                      open={openOrderDetailsDialog}
                      onOpenChange={setOpenOrderDetailsDialog}
                    >
                      <ShoppingOrderDetailsView orderDetails={order} />
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <div>No orders found</div>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ShoppingOrders;
