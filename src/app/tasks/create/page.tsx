'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Layout from '@/components/Layout';

type FormValues = {
    name: string;
    description: string;
};

const CreateTaskPage = () => {
    const router = useRouter();
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);


    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Task name is required'),
        description: Yup.string().required('Task description is required'),
    });


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: yupResolver(validationSchema),
    });


    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setServerError('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            await axios.post('http://tasklist.test/api/tasks', data, { headers });
            router.push('/tasks');
        } catch (err: any) {
            setServerError(err.response?.data?.message || 'Failed to create task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Create Task">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg mx-auto"
            >
                <h2 className="text-2xl font-bold text-center mb-6">Create a New Task</h2>


                {serverError && (
                    <p className="text-red-500 text-center text-sm mb-4">{serverError}</p>
                )}


                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Task Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        {...register('name')}
                        className={`mt-1 block w-full px-3 py-2 border ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                </div>


                <div className="mb-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Task Description
                    </label>
                    <textarea
                        id="description"
                        {...register('description')}
                        rows={4}
                        className={`mt-1 block w-full px-3 py-2 border ${
                            errors.description ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                    ></textarea>
                    {errors.description && (
                        <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                    )}
                </div>


                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 px-4 rounded-md text-white ${
                        loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                >
                    {loading ? 'Creating...' : 'Create Task'}
                </button>
            </form>
        </Layout>
    );
};

export default CreateTaskPage;
