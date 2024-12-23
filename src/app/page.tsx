'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import axios from 'axios';

type FormValues = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState('');

  const validationSchema = Yup.object().shape({
    email: Yup.string()
        .required('Email is required')
        .email('Invalid email address'),
    password: Yup.string().required('Password is required'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setServerError('');
    try {
      const apiUrl = 'http://tasklist.test/api/login';
      const response = await axios.post(apiUrl, data);
      const { token } = response.data.data;

      localStorage.setItem('token', token);
      router.push('/tasks');
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-md bg-white p-6 rounded-lg shadow-md"
        >
          <h1 className="text-2xl font-bold text-center mb-6">Login</h1>


          {serverError && (
              <p className="text-red-500 text-center text-sm mb-4">{serverError}</p>
          )}


          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
                type="email"
                id="email"
                {...register('email')}
                className={`mt-1 block w-full px-3 py-2 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            />
            <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
          </div>


          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
                type="password"
                id="password"
                {...register('password')}
                className={`mt-1 block w-full px-3 py-2 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            />
            <p className="text-red-500 text-sm mt-1">{errors.password?.message}</p>
          </div>


          <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 px-4 rounded-md text-white ${
                  isSubmitting ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
              }`}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>


          <p className="text-center text-sm mt-4">
            Don&apos;t have an account?{' '}
            <a href="/register" className="text-blue-500 hover:underline">
              Register
            </a>
          </p>
        </form>
      </div>
  );
};

export default LoginPage;
