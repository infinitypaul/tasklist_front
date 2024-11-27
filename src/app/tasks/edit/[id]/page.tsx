'use client';

import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import Layout from '@/components/Layout';

type FormValues = {
    name: string;
    description: string;
};

const EditTaskPage = () => {
    const router = useRouter();
    const { id: taskId } = useParams();

    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);
    const [taskLoading, setTaskLoading] = useState(true);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Task name is required'),
        description: Yup.string().required('Task description is required'),
    });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: yupResolver(validationSchema),
    });

    useEffect(() => {
        const fetchTask = async () => {
            console.log('fetchTask called with taskId:', taskId);

            try {
                const token = localStorage.getItem('token');
                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                const response = await axios.get(`http://tasklist.test/api/tasks/${taskId}`, { headers });
                const task = response.data.task;

                console.log('Task fetched:', task);


                setValue('name', task.name);
                setValue('description', task.description);
                setTaskLoading(false);
            } catch (err: any) {
                setServerError('Failed to load task details. Please try again.');
                setTaskLoading(false);
            }
        };

        if (taskId) {
            fetchTask();
        }
    }, [taskId, setValue]);

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setServerError('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            await axios.put(`http://tasklist.test/api/tasks/${taskId}`, data, { headers });
            router.push('/tasks');
        } catch (err: any) {
            setServerError(err.response?.data?.message || 'Failed to update task');
        } finally {
            setLoading(false);
        }
    };

    if (taskLoading) {
        return (
            <Layout title="Edit Task">
                <div className="text-center py-10">Loading task details...</div>
            </Layout>
        );
    }

    return (
        <Layout title="Edit Task">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg mx-auto"
            >
                <h2 className="text-2xl font-bold text-center mb-6">Edit Task</h2>

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
                    {loading ? 'Updating...' : 'Update Task'}
                </button>
            </form>
        </Layout>
    );
};

export default EditTaskPage;
