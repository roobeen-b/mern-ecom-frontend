import ProductImageUpload from "@/components/admin/image-upload";
import AdminProductTile from "@/components/admin/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { addProductFormElements } from "@/config";
import { toast } from "@/hooks/use-toast";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialFomData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
};

const AdminProducts = () => {
  const [openAddProductSidebar, setOpenAddProductSidebar] = useState(false);
  const [formData, setFormData] = useState(initialFomData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.adminProducts);

  function onSubmit(event) {
    event.preventDefault();

    dispatch(
      currentEditedId !== null
        ? editProduct({
            formData,
            id: currentEditedId,
          })
        : addNewProduct({
            ...formData,
            image: uploadedImageUrl,
          })
    )
      .then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setImageFile(null);
          setFormData(initialFomData);
          setOpenAddProductSidebar(false);
          toast({
            title: data.payload.message,
          });
        } else {
          toast({
            title: data.payload.message,
            variant: "destructive",
          });
        }
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Some error occured",
          variant: "destructive",
        });
      });
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  // TODO: Implement pop up modal on pressing delete button
  function handleDelete(id) {
    dispatch(deleteProduct(id)).then((res) => {
      if (res?.payload?.success) {
        dispatch(fetchAllProducts());
        toast({
          title: res.payload.message,
        });
      }
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .filter((item) => item !== "salePrice")
      .map((key) => formData[key] !== "")
      .every((itm) => itm);
  }

  return (
    <Fragment>
      <Sheet
        open={openAddProductSidebar}
        onOpenChange={() => {
          setOpenAddProductSidebar(false);
          setFormData(initialFomData);
          setCurrentEditedId(null);
        }}
      >
        <SheetContent side="right" className="overflow-auto py-2">
          <div className="flex flex-col h-full">
            <SheetHeader>
              <SheetTitle className="flex gap-2 mb-2 w-full">
                <h1 className="text-2xl font-extrabold">
                  {currentEditedId !== null ? "Edit" : "Add new"} Product
                </h1>
              </SheetTitle>
            </SheetHeader>
            <div className="py-2">
              <ProductImageUpload
                imageFile={imageFile}
                setImageFile={setImageFile}
                setUploadedImageUrl={setUploadedImageUrl}
                imageLoadingState={imageLoadingState}
                setImageLoadingState={setImageLoadingState}
                isEditMode={currentEditedId !== null}
              />
              <CommonForm
                formControls={addProductFormElements}
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit}
                buttonText={currentEditedId !== null ? "Edit" : "Add"}
                isBtnDisabled={!isFormValid()}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <div className="flex justify-end w-full mb-4">
        <Button onClick={() => setOpenAddProductSidebar(true)}>
          Add New Product
        </Button>
      </div>
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
        {productList && productList.length > 0 ? (
          productList.map((product) => (
            <div key={product._id}>
              <AdminProductTile
                product={product}
                setFormData={setFormData}
                setCurrentEditedId={setCurrentEditedId}
                setOpenAddProductSidebar={setOpenAddProductSidebar}
                handleDelete={handleDelete}
              />
            </div>
          ))
        ) : (
          <div>No products available</div>
        )}
      </div>
    </Fragment>
  );
};

export default AdminProducts;
