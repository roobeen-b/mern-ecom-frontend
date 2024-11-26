import ShoppingProductDetails from "@/components/shopping/product-details";
import ShoppingProductTile from "@/components/shopping/product-tile";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { getProductDetails } from "@/store/shop/products-slice";
import { getSearchResults, resetSearchResult } from "@/store/shop/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

const Search = () => {
  const dispatch = useDispatch();
  const { searchResult } = useSelector((state) => state.searchProducts);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productDetails } = useSelector((state) => state.shopProducts);

  const [keyword, setKeyword] = useState("");
  const [openProductDetailsDialog, setOpenProductDetailsDialog] =
    useState(false);
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (keyword && keyword.trim().length >= 3) {
      setSearchParams(new URLSearchParams(`?keyword=${keyword.trim()}`));
      setTimeout(dispatch(getSearchResults(keyword)), 1000);
    } else {
      setSearchParams(new URLSearchParams());
      dispatch(resetSearchResult());
    }
  }, [keyword]);

  function handleProductDetails(productId) {
    dispatch(getProductDetails(productId)).then(() =>
      setOpenProductDetailsDialog(true)
    );
  }

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

  return (
    <div className="container mx-auto p-4 md:px-6">
      <div className="flex flex-col justify-center">
        <div className="w-full mb-6">
          <Input
            className="py-6"
            placeholder="Search products ..."
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Search Results</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4">
            {searchResult && searchResult.length > 0 ? (
              searchResult.map((product) => (
                <ShoppingProductTile
                  key={product._id}
                  product={product}
                  handleProductDetails={handleProductDetails}
                  handleAddToCart={handleAddToCart}
                />
              ))
            ) : (
              <div>No products found</div>
            )}
          </div>
        </div>
        <ShoppingProductDetails
          open={openProductDetailsDialog}
          setOpen={setOpenProductDetailsDialog}
          productDetails={productDetails}
        />
      </div>
    </div>
  );
};

export default Search;
