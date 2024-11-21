import ProductFilter from "@/components/shopping/filter";
import ShoppingProductDetails from "@/components/shopping/product-details";
import ShoppingProductTile from "@/components/shopping/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import { toast } from "@/hooks/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  getProductDetails,
} from "@/store/shop/products-slice";
import { ArrowUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }
  return queryParams.join("&");
}

const ShoppingListings = () => {
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );

  const { user } = useSelector((state) => state.auth);

  const [sort, setSort] = useState(null);
  const [filters, setFilters] = useState({});
  const [openProductDetailsDialog, setOpenProductDetailsDialog] =
    useState(false);

  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (filters !== null && sort !== null) {
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
      );
    }
  }, [dispatch, filters, sort]);

  function handleSort(sortValue) {
    setSort(sortValue);
  }

  function handleFilter(currentFilterKey, currentFilterOption) {
    let cpyFilter = { ...filters };

    const currentFilterKeyIndex =
      Object.keys(cpyFilter).indexOf(currentFilterKey);

    if (currentFilterKeyIndex === -1) {
      cpyFilter = {
        ...cpyFilter,
        [currentFilterKey]: [currentFilterOption],
      };
    } else {
      const currentFilterOptionIndex =
        cpyFilter[currentFilterKey].indexOf(currentFilterOption);
      if (currentFilterOptionIndex === -1) {
        cpyFilter[currentFilterKey].push(currentFilterOption);
      } else {
        cpyFilter[currentFilterKey].splice(currentFilterOptionIndex, 1);
      }
    }
    setFilters(cpyFilter);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilter));
  }

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, []);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters]);

  function handleProductDetails(productId) {
    dispatch(getProductDetails(productId)).then(() =>
      setOpenProductDetailsDialog(true)
    );
  }

  function handleAddToCart(currentProductId) {
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
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter filters={filters} handleFilter={handleFilter} />
      <div className="bg-background w-full rounded-sm shadow-sm">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-extrabold">All Products</h1>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {productList?.length} Products
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ArrowUpDown className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      key={sortItem.id}
                      value={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {productList && productList.length > 0 ? (
            productList.map((product) => (
              <div key={product._id}>
                <ShoppingProductTile
                  product={product}
                  handleProductDetails={handleProductDetails}
                  handleAddToCart={handleAddToCart}
                />
              </div>
            ))
          ) : (
            <div>No products available</div>
          )}
        </div>
      </div>
      <ShoppingProductDetails
        open={openProductDetailsDialog}
        setOpen={setOpenProductDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
};

export default ShoppingListings;
