'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import axios from 'axios';

type FormValues = {
    name: string;
    email: string;
    username: string;
    password: string;
    password_confirmation: string;
};

const RegisterPage = () => {
    const router = useRouter();
    const [serverError, setServerError] = useState('');

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Full Name is required'),
        email: Yup.string()
            .required('Email is required')
            .email('Invalid email address'),
        username: Yup.string()
            .required('Username is required')
            .min(3, 'Username must be at least 3 characters')
            .max(20, 'Username cannot exceed 20 characters'),
        password: Yup.string()
            .required('Password is required')
            .min(6, 'Password must be at least 6 characters'),
        password_confirmation: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Password confirmation is required'),
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
            const apiUrl = 'http://tasklist.test/api/register';
            await axios.post(apiUrl, data);
            router.push('/login');
        } catch (err: any) {
            setServerError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-md bg-white p-6 rounded-lg shadow-md"
            >
                <h1 className="text-2xl font-bold text-center mb-6">Register</h1>


                {serverError && (
                    <p className="text-red-500 text-center text-sm mb-4">{serverError}</p>
                )}


                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        {...register('name')}
                        className={`mt-1 block w-full px-3 py-2 border ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                    />
                    <p className="text-red-500 text-sm mt-1">{errors.name?.message}</p>
                </div>


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


                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        {...register('username')}
                        className={`mt-1 block w-full px-3 py-2 border ${
                            errors.username ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                    />
                    <p className="text-red-500 text-sm mt-1">{errors.username?.message}</p>
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

                <div className="mb-6">
                    <label
                        htmlFor="password_confirmation"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="password_confirmation"
                        {...register('password_confirmation')}
                        className={`mt-1 block w-full px-3 py-2 border ${
                            errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                    />
                    <p className="text-red-500 text-sm mt-1">
                        {errors.password_confirmation?.message}
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-2 px-4 rounded-md text-white ${
                        isSubmitting ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                >
                    {isSubmitting ? 'Submitting...' : 'Register'}
                </button>


                <p className="text-center text-sm mt-4">
                    Already have an account?{' '}
                    <a href="/login" className="text-blue-500 hover:underline">
                        Login
                    </a>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;
