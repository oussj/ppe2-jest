import React, { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import axios from "axios";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  const onSubmit = async (data:any)=> {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/login_check",
        {
          username: data.username,
          password: data.password,
        }
      );
      // setToken(response.data.token);
      // setEmail(response.data.email);
      setIsAuthenticated(true);
      document.cookie = `username=${data.username}; path=/`;
      router.push("/acceuil");
    } catch (error) {
      // setErrorMessage(error.message);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {!isAuthenticated && (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 font-bold mb-2"
            >
              Username:
            </label>
            <input
              type="text"
              {...register("username", { required: true })}
              className="border border-gray-400 rounded-md py-2 px-3 w-full focus:outline-none focus:border-blue-500"
            />
            {errors.username && (
              <span className="text-red-500">Username is required</span>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-bold mb-2"
            >
              Password:
            </label>
            <input
              type="password"
              {...register("password", { required: true })}
              className="border border-gray-400 rounded-md py-2 px-3 w-full focus:outline-none focus:border-blue-500"
            />
            {errors.password && (
              <span className="text-red-500">Password is required</span>
            )}
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Login
            </button>
          </div>
          {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        </form>
      )}
      {isAuthenticated && (
        <div>
          <p>You are logged in!</p>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;
