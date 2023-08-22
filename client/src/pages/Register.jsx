import { Form, Link, redirect, useNavigation } from "react-router-dom";
import { FormField, SubmitButton } from "../components";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    const resp = await customFetch.post("/auth/register", data);
    toast.success(resp.data.msg);
    return redirect("/login");
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.msg ?? error.message);
    return error;
  }
};

const Register = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Form method="post" className="space-y-4">
        <h1 className="text-xl font-bold">Register</h1>
        <FormField type="text" name="name" />
        {/* defaultValue="Kushal" /> */}
        <FormField type="email" name="email" />
        {/* defaultValue="kushal@gmail.com"/> */}
        <FormField type="password" name="password" />
        {/* defaultValue="secret123/> */}
        <SubmitButton />
        <p>
          Already registered? <Link to="/login">Go to Login</Link>
        </p>
      </Form>
    </div>
  );
};

export default Register;
