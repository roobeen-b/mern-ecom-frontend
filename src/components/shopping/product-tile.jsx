/* eslint-disable react/prop-types */
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

const ShoppingProductTile = ({
  product,
  handleProductDetails,
  handleAddToCart,
}) => {
  return (
    <Card className="w-full max-w-sm mx-auto cursor-pointer">
      <div onClick={() => handleProductDetails(product._id)}>
        <div className="relative overflow-hidden">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[150px] object-contain rounded-t-lg hover:scale-125 transition ease-out"
          />
          {product?.totalStock === 0 ? (
            <Badge
              className={`absolute top-2 ${
                product?.salePrice > 0 && product?.totalStock != 0
                  ? "left-14"
                  : "left-2"
              }  bg-red-500 hover:bg-red-600`}
            >
              Out of stock
            </Badge>
          ) : product?.totalStock <= 10 ? (
            <Badge
              className={`absolute top-2 ${
                product?.salePrice > 0 && product?.totalStock != 0
                  ? "left-14"
                  : "left-2"
              } bg-red-500 hover:bg-red-600`}
            >
              {`Only ${product?.totalStock} items left`}
            </Badge>
          ) : null}
          {product?.salePrice > 0 && product?.totalStock != 0 ? (
            <Badge className="absolute top-2 left-2 bg-yellow-500 hover:bg-red-600">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent>
          <h2 className="text-xl font-bold mb-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm capitalize text-muted-foreground`}>
              {product?.category}
            </span>
            <span className="text-sm capitalize text-muted-foreground">
              {product?.brand}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-semibold text-primary">
                ${product?.salePrice}
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>
      <CardFooter>
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed">
            Out of stock
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={() => handleAddToCart(product?._id)}
          >
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ShoppingProductTile;
