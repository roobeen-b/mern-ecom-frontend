import { Button } from "@/components/ui/button";
import bannerOne from "../../assets/banner-1.webp";
import bannerTwo from "../../assets/banner-2.webp";
import bannerThree from "../../assets/banner-3.webp";
import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  getProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping/product-tile";
import { useNavigate } from "react-router-dom";
import ShoppingProductDetails from "@/components/shopping/product-details";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "@/hooks/use-toast";

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: Shirt },
  { id: "adidas", label: "Adidas", icon: WashingMachine },
  { id: "puma", label: "Puma", icon: ShoppingBasket },
  { id: "levi", label: "Levi's", icon: Airplay },
  { id: "zara", label: "Zara", icon: Images },
  { id: "h&m", label: "H&M", icon: Heater },
];

const ShoppingHome = () => {
  const slides = [bannerOne, bannerTwo, bannerThree];
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { user } = useSelector((state) => state.auth);

  const [openProductDetailsDialog, setOpenProductDetailsDialog] =
    useState(false);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  function handleNavigateToListingsPage(selectedSection, selectedOption) {
    sessionStorage.removeItem("filters");
    const newFilters = {
      [selectedSection]: [selectedOption.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(newFilters));
    navigate("/shopping/listings");
  }

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

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[600px] overflow-hidden">
        {slides.map((slide, index) => (
          <img
            key={index}
            src={slide}
            className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-1000 ${
              index === currentSlideIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <Button
          className="bg-white/80 absolute top-1/2 left-4 -translate-y-1/2"
          size="icon"
          variant="outline"
          onClick={() =>
            setCurrentSlideIndex(
              (prev) => (prev - 1 + slides.length) % slides.length
            )
          }
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          className="bg-white/80 absolute top-1/2 right-4 -translate-y-1/2"
          size="icon"
          variant="outline"
          onClick={() =>
            setCurrentSlideIndex((prev) => (prev + 1) % slides.length)
          }
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
      <section className="pt-12 pb-6 bg-gray-50">
        <div className="px-4 container mx-auto">
          <h1 className="font-extrabold text-2xl text-center mb-4">
            Shop By Category
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                key={categoryItem.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() =>
                  handleNavigateToListingsPage("category", categoryItem)
                }
              >
                <CardContent className="flex items-center justify-center flex-col p-6">
                  <categoryItem.icon className="h-8 w-8 mb-2 text-primary" />
                  <span className="font-bold">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-6 bg-gray-50">
        <div className="px-4 container mx-auto">
          <h1 className="font-extrabold text-2xl text-center mb-4">
            Shop By Brand
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem) => (
              <Card
                key={brandItem.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleNavigateToListingsPage("brand", brandItem)}
              >
                <CardContent className="flex items-center justify-center flex-col p-6">
                  <brandItem.icon className="h-8 w-8 mb-2 text-primary" />
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-6 bg-gray-50">
        <div className="px-4 container mx-auto">
          <h1 className="font-extrabold text-2xl text-center mb-4">
            Featured Products
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
      </section>
      <ShoppingProductDetails
        open={openProductDetailsDialog}
        setOpen={setOpenProductDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
};

export default ShoppingHome;
