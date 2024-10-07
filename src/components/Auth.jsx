import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useSignInHook, useSignUpHook } from "../hooks/useSignHook";
import { useAuth } from "../components/context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
} from "../config/firebase.config";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] =
    useState(false);

  const { updatedUser } = useAuth();
  const navigate = useNavigate();

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const {
    register: signupRegister,
    handleSubmit: handleSignupSubmit,
    reset: signUpReset,
    formState: { errors: signupErrors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { user } = result;

      if (user.uid) {
        const userRef = doc(collection(db, "users"), user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("Existing user data:", userData);
          updatedUser(userData);
        } else {
          const newUser = {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            image: user.photoURL,
            credit: 1000,
            createdAt: new Date(),
            updatedAt: new Date(),
            ordered: 0,
            purchased: 0,
            sold: 0,
            rented: 0,
            donated: 0,
            wishlist: [],
          };

          await setDoc(userRef, newUser);

          updatedUser(newUser);
          console.log("New user created and stored:", newUser);
        }
      }

      navigate("/");
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  const inputClasses =
    "w-full border-[1px] border-gray-300 px-4 py-3 rounded-3xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white";
  const labelClasses = "block text-gray-700 font-medium mb-2";
  const errorClasses = "text-red-500 text-sm mt-1 ml-2";
  const buttonClasses =
    "w-full px-8 py-3 rounded-3xl bg-gradient-to-t from-primaryColor to-secondaryColor rounded-3xl text-white text-xl font-bold shadow-lg transition-transform duration-300 ease-in-out hover:scale-105";

  const onLoginSubmit = async (data) => {
    try {
      const user = await useSignInHook(data, updatedUser, navigate);
      console.log(user);
      if (!user.emailVerified) {
        alert(
          "Please verify your email before logging in, Check Inbox of provided Email"
        );
        await auth.signOut();
        return;
      }

      navigate(-1);
    } catch (err) {
      console.error(err);
    }
  };

  const onSignupSubmit = async (data) => {
    try {
      await useSignUpHook(data);
      alert(
        "Account created successfully! Please check your email for verification."
      );
      setActiveTab("login");
      signUpReset();
    } catch (err) {
      console.error(err);
    }
  };

  const renderPasswordInput = (
    id,
    register,
    error,
    showPassword,
    setShowPassword
  ) => (
    <>
      <div className="relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          {...register}
          className={`${inputClasses} ${error ? "border-red-500" : ""}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
        </button>
      </div>
      {error && <p className={errorClasses}>{error.message}</p>}
    </>
  );

  const renderLoginForm = () => (
    <form
      onSubmit={handleLoginSubmit(onLoginSubmit)}
      className="flex flex-col gap-6 mt-6 bg-white p-8 rounded-2xl border-2 shadow-xl mb-10"
    >
      <div>
        <label htmlFor="loginEmail" className={labelClasses}>
          Email Address
        </label>
        <input
          id="loginEmail"
          {...loginRegister("email")}
          className={`${inputClasses} ${
            loginErrors.email ? "border-red-500" : ""
          }`}
          placeholder="Enter your email"
        />
        {loginErrors.email && (
          <p className={errorClasses}>{loginErrors.email.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="loginPassword" className={labelClasses}>
          Password
        </label>
        {renderPasswordInput(
          "loginPassword",
          loginRegister("password"),
          loginErrors.password,
          showLoginPassword,
          setShowLoginPassword
        )}
      </div>
      <div className="text-sm text-purple-600 cursor-pointer hover:underline font-medium text-right">
        Forgot password?
      </div>
      <button type="submit" className={buttonClasses}>
        Login
      </button>
      <div className="text-sm mt-2 text-center text-gray-600">
        Don't have an account?{" "}
        <span
          className="text-purple-600 cursor-pointer hover:underline font-medium"
          onClick={() => setActiveTab("signup")}
        >
          Sign up
        </span>
      </div>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>
      <button
        type="button"
        className="flex items-center justify-center gap-3 bg-white text-gray-700 p-3 rounded-3xl hover:bg-gray-50 transition-all duration-300 shadow-md border-2 border-gray-300 font-bold"
        onClick={handleGoogleSignIn}
      >
        <FontAwesomeIcon icon={faGoogle} className="text-xl" />
        Login with Google
      </button>
    </form>
  );

  const renderSignupForm = () => (
    <form
      onSubmit={handleSignupSubmit(onSignupSubmit)}
      className="flex flex-col gap-6 mt-6 bg-white p-8 rounded-2xl border-2 shadow-xl mb-10"
    >
      <div>
        <label htmlFor="signupName" className={labelClasses}>
          Full Name
        </label>
        <input
          id="signupName"
          {...signupRegister("name")}
          className={`${inputClasses} ${
            signupErrors.name ? "border-red-500" : ""
          }`}
          placeholder="Enter your full name"
        />
        {signupErrors.name && (
          <p className={errorClasses}>{signupErrors.name.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="signupEmail" className={labelClasses}>
          Email Address
        </label>
        <input
          id="signupEmail"
          {...signupRegister("email")}
          className={`${inputClasses} ${
            signupErrors.email ? "border-red-500" : ""
          }`}
          placeholder="Enter your email"
        />
        {signupErrors.email && (
          <p className={errorClasses}>{signupErrors.email.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="signupPassword" className={labelClasses}>
          Password
        </label>
        {renderPasswordInput(
          "signupPassword",
          signupRegister("password"),
          signupErrors.password,
          showSignupPassword,
          setShowSignupPassword
        )}
      </div>
      <div>
        <label htmlFor="signupConfirmPassword" className={labelClasses}>
          Confirm Password
        </label>
        {renderPasswordInput(
          "signupConfirmPassword",
          signupRegister("confirmPassword"),
          signupErrors.confirmPassword,
          showSignupConfirmPassword,
          setShowSignupConfirmPassword
        )}
      </div>
      <button type="submit" className={buttonClasses}>
        Create Account
      </button>
      <div className="text-sm mt-2 text-center text-gray-600">
        Already have an account?{" "}
        <span
          className="text-purple-600 cursor-pointer hover:underline font-medium"
          onClick={() => setActiveTab("login")}
        >
          Login
        </span>
      </div>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>
      <button
        type="button"
        className="flex items-center justify-center gap-3 bg-white text-gray-700 p-3 rounded-3xl hover:bg-gray-50 transition-all duration-300 shadow-md border-2 border-gray-300 font-bold"
        onClick={handleGoogleSignIn}
      >
        <FontAwesomeIcon icon={faGoogle} className="text-xl" />
        Sign up with Google
      </button>
    </form>
  );

  return (
    <div className="w-full max-w-[600px] m-auto mt-10">
      <div className="flex justify-around mb-8">
        <div
          className={`p-2 cursor-pointer text-xl font-bold transition-all duration-300 ${
            activeTab === "login"
              ? "text-purple-600 border-b-4 border-purple-600"
              : "text-gray-400 hover:text-purple-400"
          }`}
          onClick={() => setActiveTab("login")}
        >
          Login
        </div>
        <div
          className={`p-2 cursor-pointer text-xl font-bold transition-all duration-300 ${
            activeTab === "signup"
              ? "text-purple-600 border-b-4 border-purple-600"
              : "text-gray-400 hover:text-purple-400"
          }`}
          onClick={() => setActiveTab("signup")}
        >
          Sign Up
        </div>
      </div>

      {activeTab === "login" ? renderLoginForm() : renderSignupForm()}
    </div>
  );
};

export default Auth;
