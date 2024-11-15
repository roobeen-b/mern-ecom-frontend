import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { useState } from "react";
import { Link } from "react-router-dom";

const AuthRegister = () => {
  const initialState = {
    userName: "",
    email: "",
    password: "",
  };
  const [formData, setFormData] = useState(initialState);
  return (
    <div className="w-full max-w-md">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Create New Account
        </h1>
        <p>
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="font-medium text-primary hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
      <CommonForm
        formData={formData}
        setFormData={setFormData}
        formControls={registerFormControls}
        buttonText="Sign Up"
      />
    </div>
  );
};

export default AuthRegister;
