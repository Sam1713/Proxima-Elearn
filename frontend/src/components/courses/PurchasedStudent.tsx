import React, { useEffect, useState } from 'react';
import api from '../API/Api';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setPurchasedStudents } from '../../redux/tutor/tutorSlice';

import userIcon from '../../assets/images/1000_F_392072816_sO8hOPXhrlg3fELAdmWrLIJyw5dLKWu2.jpg';
import { Button } from '@material-tailwind/react';

const PurchasedStudent: React.FC = () => {
    const [page, setPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(1);
    const limit = 5;
    const dispatch = useDispatch();
    const purchasedStudents = useSelector((state: RootState) => state.tutor.purchased);

    useEffect(() => {
        fetchPurchasedStudents(page, limit);
    }, [page, limit]);

    const fetchPurchasedStudents = async (page: number, limit: number) => {
        try {
            const response = await api.get('/backend/course/getPurchasedStudents', {
                headers: {
                    'X-Token-Type': 'tutor',
                },
                params: {
                    page: page,
                    limit: limit,
                },
            });
            console.log('response', response);
            dispatch(setPurchasedStudents(response.data.studentDetails));
            setTotalPage(response.data.totalPages);
        } catch (error) {
            console.error('Failed to fetch purchased students:', error);
        }
    };

    const handleNext = () => {
        setPage((prev) => prev + 1);
    };

    const handleBack = () => {
        setPage((prev) => prev - 1);
    };

    return (
        <div className="container h-[90vh] p-4">
            <h1 className="text-2xl font-semibold text-gray-100 mb-6 underline">Purchased Students</h1>
            <div className="bg-white w-full shadow-md rounded-lg p-4">
                {/* Check if there are no purchased students */}
                {purchasedStudents.length === 0 ? (
                    <div className="m-auto ">
                        <p className="text-2xl m-auto w-full h-full text-gray-500 font-protest">No purchased students.</p>
                    </div>
                ) : (
                    <div className="w-full overflow-x-auto">
                        <table className="min-w-full bg-white shadow-md rounded-lg table-fixed">
                            <thead className="bg-gray-800 text-white">
                                <tr>
                                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider border-b border-gray-200" style={{ width: 50 }}>
                                        Index
                                    </th>
                                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider border-b border-gray-200" style={{ width: 200 }}>
                                        Student
                                    </th>
                                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider border-b border-gray-200" style={{ width: 250 }}>
                                        Email
                                    </th>
                                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider border-b border-gray-200" style={{ width: 300 }}>
                                        Course
                                    </th>
                                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider border-b border-gray-200" style={{ width: 150 }}>
                                        Category
                                    </th>
                                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider border-b border-gray-200" style={{ width: 100 }}>
                                        Profile Pic
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-custom-gradient text-white divide-y divide-gray-200 ">
                                {purchasedStudents.map((student, index) => (
                                    <tr key={student._id} className="hover:bg-gray-900">
                                        <td className="py-4 px-3 whitespace-nowrap text-sm font-medium text-gray-200" style={{ width: 50 }}>
                                            {index + 1}
                                        </td>
                                        <td className="py-4 px-3 whitespace-nowrap text-sm font-medium text-gray-200" style={{ width: 200 }}>
                                            {student.username}
                                        </td>
                                        <td className="py-4 px-3 whitespace-nowrap text-sm font-medium text-gray-200" style={{ width: 250 }}>
                                            {student.email}
                                        </td>
                                        <td className="py-4 px-3 whitespace-nowrap text-sm font-medium text-gray-200" style={{ width: 300 }}>
                                            {student.title}
                                        </td>
                                        <td className="py-4 px-3 whitespace-nowrap text-sm font-medium text-gray-200" style={{ width: 150 }}>
                                            {student.category}
                                        </td>
                                        <td className="py-4 px-3 whitespace-nowrap text-sm font-medium text-gray-200" style={{ width: 100 }}>
                                            <img
                                                src={student.profilePic || userIcon}
                                                alt="Profile"
                                                className="rounded-full w-12 h-12 object-cover"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Show pagination only if there are students */}
            {purchasedStudents.length > 0 && (
                <div className='flex justify-center items-center mt-5'>
                    <div>
                        <Button disabled={page === 1} onClick={handleBack} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Prev</Button>
                    </div>
                    <p className="text-lg font-semibold text-white rounded-lg px-4 py-2 shadow-lg">
                        {page} - {totalPage}
                    </p>
                    <div>
                        <Button disabled={page === totalPage} onClick={handleNext}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Next</Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PurchasedStudent;
