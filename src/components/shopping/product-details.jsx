/* eslint-disable react/prop-types */
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { addNewReview, getProductReviews } from "@/store/shop/review-slice";
import StarRatings from "../common/star-rating";

const ShoppingProductDetails = ({ open, setOpen, productDetails }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productReviews } = useSelector((state) => state.productReviews);

  const [reviewMessage, setReviewMessage] = useState("");
  const [ratingValue, setRatingValue] = useState(0);

  function handleAddToCart(currentProductId, currentProductTotalStock) {
    const currentProductTotalCartQuantity = cartItems?.items?.find(
      (item) => item.productId === currentProductId
    )?.quantity;

    if (currentProductTotalCartQuantity >= currentProductTotalStock) {
      toast({
        title: `Only ${currentProductTotalStock} items can be added for this product`,
        variant: "destructive",
      });
      return;
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: currentProductId,
        quantity: 1,
      })
    ).then((res) => {
      if (res?.payload?.success) {
        toast({
          title: res?.payload?.message,
        });
        dispatch(fetchCartItems(user?.id));
      }
    });
  }

  function handleAddNewReview() {
    dispatch(
      addNewReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.username,
        reviewMessage,
        reviewValue: ratingValue,
      })
    )
      .then((res) => {
        if (res?.payload?.success) {
          setReviewMessage("");
          setRatingValue(null);
          dispatch(getProductReviews(productDetails?._id));
          toast({
            title: res?.payload?.message,
          });
        } else {
          toast({
            title: res?.payload?.message,
            variant: "destructive",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: error.message,
          variant: "destructive",
        });
      });
  }

  const totalNumberOfReviews = productReviews && productReviews.length;
  const averageReview =
    (productReviews &&
      productReviews.length > 0 &&
      productReviews?.reduce((sum, review) => sum + review.reviewValue, 0) /
        totalNumberOfReviews) ||
    0.0;

  function handleDialogClose() {
    setOpen(false);
    setRatingValue(0);
    setReviewMessage("");
  }

  useEffect(() => {
    if (productDetails !== null) {
      dispatch(getProductReviews(productDetails?._id));
    }
  }, [productDetails, dispatch]);

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={500}
            height={500}
            className="aspect-square w-full object-contain"
          />
        </div>
        <div>
          <div>
            <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
            <p className="text-muted-foreground text-2xl mb-5 mt-4">
              {productDetails?.description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p
              className={`text-3xl font-bold text-primary ${
                productDetails?.salePrice > 0 ? "line-through" : ""
              }`}
            >
              ${productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 ? (
              <p className="text-2xl font-bold text-muted-foreground">
                ${productDetails?.salePrice}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-0.5">
            <StarRatings ratingValue={averageReview} />
            <span className="text-muted-foreground text-sm">
              ({averageReview.toFixed(2)})
            </span>
          </div>
          <div className="mt-5 mb-5">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed">
                Out of Stock
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id,
                    productDetails?.totalStock
                  )
                }
              >
                Add to Cart
              </Button>
            )}
          </div>
          <Separator />
          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            <div className="grid gap-6">
              {productReviews && productReviews.length > 0 ? (
                productReviews?.map((review) => (
                  <div className="flex gap-4" key={review?._id}>
                    <Avatar className="w-10 h-10 border capitalize">
                      <AvatarFallback>
                        {review?.userName && review?.userName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold capitalize">
                          {review?.userName}
                        </h3>
                      </div>
                      <StarRatings ratingValue={review?.reviewValue} />
                      <p className="text-muted-foreground">
                        {review?.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div>No reviews yet</div>
              )}
            </div>
            <div className="mt-10 flex-col flex gap-2">
              <Label>Write a review</Label>
              <div>
                <StarRatings
                  ratingValue={ratingValue}
                  setRatingValue={setRatingValue}
                />
              </div>
              <Input
                name="reviewMsg"
                placeholder="Write a review..."
                value={reviewMessage}
                onChange={(event) =>
                  setReviewMessage(event.target.value.trim())
                }
              />
              <Button
                onClick={handleAddNewReview}
                disabled={reviewMessage.trim() === ""}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShoppingProductDetails;
