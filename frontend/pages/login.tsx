import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import axios from "axios";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/login_check`,
        {
          username: data.username,
          password: data.password,
        }
      );
      localStorage.setItem("token", response.data.token);

      // Si la connexion réussit, stockez l'état de connexion de l'utilisateur et redirigez-le vers la page de profil
      setIsAuthenticated(true);
      setToken(response.data.token);

      router.push("/messagerie");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleLogout = () => {
    // Réinitialiser l'état de connexion de l'utilisateur et rediriger l'utilisateur vers la page de connexion
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <div className="container mx-auto">
      {!isAuthenticated && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-sm mx-auto mt-8"
        >
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
              className="w-full border border-gray-400 rounded py-2 px-3"
            />
            {errors.username && (
              <span className="text-sm text-red-500">Username is required</span>
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
              className="w-full border border-gray-400 rounded py-2 px-3"
            />
            {errors.password && (
              <span className="text-sm text-red-500">Password is required</span>
            )}
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded"
            >
              Login
            </button>
          </div>
          {errorMessage && (
            <div className="text-sm text-red-500">{errorMessage}</div>
          )}
        </form>
      )}
      {isAuthenticated && (
        <div className="max-w-sm mx-auto mt-8">
          <p className="text-center">You are logged in!</p>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 px-4 rounded mt-4"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;
