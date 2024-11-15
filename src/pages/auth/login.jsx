import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { useState } from "react";
import { Link } from "react-router-dom";

const AuthLogin = () => {
  const initialState = {
    userName: "",
    email: "",
    password: "",
  };
  const [formData, setFormData] = useState(initialState);

  return (
    <div className="w-full max-w-md">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Login to continue</h1>
        <p>
          Don&apos;t have an account?{" "}
          <Link
            to="/auth/register"
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
      <CommonForm
        formData={formData}
        setFormData={setFormData}
        formControls={loginFormControls}
        buttonText="Login"
      />
    </div>
  );
};

export default AuthLogin;
