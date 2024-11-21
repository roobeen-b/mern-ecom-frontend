import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import CommonForm from "../common/form";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editAddress,
  fetchAllAddresses,
} from "@/store/shop/address-slice";
import { toast } from "@/hooks/use-toast";
import AddressCard from "./address-card";

const initialAddressFormData = {
  address: "",
  city: "",
  pincode: "",
  phone: "",
  notes: "",
};

const ShoppingAddress = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);

  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  function handleAddressSubmit(event) {
    event.preventDefault();
    addressList.length >= 3 && currentEditedId === null
      ? toast({
          title: "You can add at most 3 addresses only.",
          variant: "destructive",
        })
      : dispatch(
          currentEditedId === null
            ? addNewAddress({ userId: user?.id, ...formData })
            : editAddress({
                formData,
                userId: user?.id,
                addressId: currentEditedId,
              })
        ).then((res) => {
          if (res?.payload?.success) {
            dispatch(fetchAllAddresses(user?.id));
            setFormData(initialAddressFormData);
            setCurrentEditedId(null);
            toast({
              title: res.payload.message,
            });
          } else {
            toast({
              title: res.payload.message,
              variant: "destructive",
            });
          }
        });
  }

  function handleEditAddress(currentAddress) {
    setCurrentEditedId(currentAddress?._id);
    setFormData({
      ...formData,
      address: currentAddress?.address,
      city: currentAddress?.city,
      pincode: currentAddress?.pincode,
      phone: currentAddress?.phone,
      notes: currentAddress?.notes,
    });
  }

  function handleDeleteAddress(currentAddress) {
    dispatch(
      deleteAddress({ userId: user.id, addressId: currentAddress._id })
    ).then((res) => {
      if (res?.payload?.success) {
        dispatch(fetchAllAddresses(user?.id));
        toast({
          title: res.payload.message,
        });
      } else {
        toast({
          title: res.payload.message,
          variant: "destructive",
        });
      }
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key].trim() !== "")
      .every((item) => item);
  }

  useEffect(() => {
    dispatch(fetchAllAddresses(user?.id));
  }, [dispatch]);

  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {addressList && addressList.length > 0 ? (
          addressList.map((address) => (
            <AddressCard
              key={address._id}
              addressInfo={address}
              handleEditAddress={handleEditAddress}
              handleDeleteAddress={handleDeleteAddress}
            />
          ))
        ) : (
          <div>No Addresses added</div>
        )}
      </div>
      <CardHeader>
        <CardTitle>
          {currentEditedId === null ? "Add new address" : "Edit Address"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentEditedId === null ? "Add" : "Edit"}
          onSubmit={handleAddressSubmit}
          isBtnDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
  );
};

export default ShoppingAddress;
