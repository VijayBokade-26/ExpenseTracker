import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import "../../../App.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../../../services/methods";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

function Login() {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await loginUser(values);

      if (res.access_token) {
        localStorage.setItem("token", res.access_token);
        toast.success("Login successful! Welcome back.");
        navigate("/dashboard");
      } else {
        toast.error(
          res.detail || "Login failed. Please check your credentials.",
        );
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error("Login error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="signup-bg">
      <div className="signup-card">
        <h2>Welcome back</h2>
        <p className="subtitle">Log in to continue tracking.</p>

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-group">
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="form-input"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="form-input"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error-message"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="form-button"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="subtitle" style={{ marginTop: "16px" }}>
          Don&apos;t have an account? <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
