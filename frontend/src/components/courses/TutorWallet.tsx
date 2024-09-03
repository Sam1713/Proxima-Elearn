import React, { useEffect, useState } from 'react';
import { CurrencyDollarIcon, ArrowUpIcon } from '@heroicons/react/24/solid';
import api from '../API/Api';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setWalletInfo } from '../../redux/tutor/tutorSlice';
import { Button } from '@material-tailwind/react';

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // Format as dd/mm/yyyy
};

const TutorWallet: React.FC = () => {
    const dispatch = useDispatch();
    const walletInfo = useSelector((state: RootState) => state.tutor.walletInfo);

    // State for search, sorting, and filtering
    const [searchText, setSearchText] = useState('');
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const limit = 4;

    useEffect(() => {
        fetchWalletDetails(page, limit);
    }, [page, limit]);

    const fetchWalletDetails = async (page: number, limit: number) => {
        const response = await api.get(`/backend/course/getWalletDetails/`, {
            headers: {
                'X-Token-Type': 'tutor',
            },
            params: {
                page: page,
                limit: limit,
            },
        });
        dispatch(setWalletInfo(response.data));
        setTotalPages(response.data.totalPages);
        console.log('Response:', response);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const filteredData = walletInfo?.walletDetails?.filter((item) =>
        item.studentName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.courseTitle.toLowerCase().includes(searchText.toLowerCase())
    );

    const sortedData = filteredData?.sort((a, b) => {
        if (sortColumn) {
            const valueA = a[sortColumn as keyof typeof a];
            const valueB = b[sortColumn as keyof typeof b];

            if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
            if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        }
        return 0;
    });

    const handlePrev = () => {
        setPage((prev) => prev - 1);
    };
    const handleNext = () => {
        setPage((prev) => prev + 1);
    };

    return (
        <div className="min-h-screen   md:px-8 md:pt-8 pt-[60%]">
            <div
                className="md:w-full h-auto w-[95%] mx-auto md:mx-0  md:my-8 p-8 rounded-lg shadow-2xl flex flex-col md:flex-row md:items-center justify-between transform hover:scale-105 transition-transform duration-300"
                style={{
                    background: 'linear-gradient(135deg, #fef9c3, #fde68a)',
                    boxShadow: '0 1px 25px rgba(20, 230, 250, 10)',
                }}
            >
                <div className="flex items-center md:justify-center  gap-4 mb-4 md:mb-0">
                    <div className="text-yellow-700 text-4xl">
                        ₹
                    </div>
                    <div className="font-sans">
                        <h2 className="text-xl md:text-2xl  font-extrabold text-gray-800 tracking-tight font-poppins">
                            Total Amount Received
                        </h2>
                        <p className="text-2xl md:text-3xl font-semibold text-green-500 font-poppins">
                            ₹{walletInfo?.deductedAmount}
                        </p>
                    </div>
                </div>
                <div className="flex items-center md:justify-center gap-4">
                    <ArrowUpIcon className="h-8 w-8 md:h-12 md:w-12 text-green-500" />
                    <div className="font-sans">
                        <p className="text-xl md:text-2xl font-bold text-gray-800 tracking-wide font-poppins">
                            Earnings Increase
                        </p>
                        <p className="text-lg md:text-xl font-medium text-gray-600 font-poppins">
                            +12% this month
                        </p>
                    </div>
                </div>
            </div>
            <div className="w-full mt-8">
                <h1 className="text-xl md:text-2xl font-bold text-gray-100 mb-4">All Transaction Details</h1>

                {/* Search Input */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchText}
                        onChange={handleSearchChange}
                        className="p-2 border border-gray-300 rounded-lg w-full"
                    />
                </div>
                <div className="overflow-x-auto md:overflow-hidden md:min-w-full w-[95%] mx-auto md:mx-0 rounded-xl "
                style={{
                    boxShadow: '0 0px 35px rgba(20, 230, 250, 10)',
                }}
                >
                    <table
                        className="md:min-w-full bg-custom-gradient border border-gray-200 rounded-2xl shadow-md"
                        
                    >
                        <thead className="bg-opacity-60 bg-gray-800 text-white uppercase text-sm font-semibold border-b border-gray-300">
                            <tr>
                                <th
                                    className="py-3 px-4 text-left cursor-pointer"
                                    onClick={() => handleSort('studentName')}
                                >
                                    Name {sortColumn === 'studentName' && (sortDirection === 'asc' ? '▲' : '▼')}
                                </th>
                                <th
                                    className="py-3 px-4 text-left cursor-pointer"
                                    onClick={() => handleSort('courseTitle')}
                                >
                                    Course Title {sortColumn === 'courseTitle' && (sortDirection === 'asc' ? '▲' : '▼')}
                                </th>
                                <th
                                    className="py-3 px-4 text-left cursor-pointer"
                                    onClick={() => handleSort('amountPaid')}
                                >
                                    Amount Paid {sortColumn === 'amountPaid' && (sortDirection === 'asc' ? '▲' : '▼')}
                                </th>
                                <th
                                    className="py-3 px-4 text-left cursor-pointer"
                                    onClick={() => handleSort('paymentDate')}
                                >
                                    Payment Date {sortColumn === 'paymentDate' && (sortDirection === 'asc' ? '▲' : '▼')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-white font-poppins">
                            {sortedData?.map((item, index) => (
                                <tr
                                    key={index}
                                    className={`hover:bg-opacity-70 transition-colors duration-200 ${index % 2 === 0 ? 'bg-opacity-80 bg-gray-900' : 'bg-opacity-70 bg-gray-800'}`}
                                >
                                    <td className="py-3 px-4 border-b border-gray-200">{item?.studentName}</td>
                                    <td className="py-3 px-4 border-b border-gray-200">{item?.courseTitle}</td>
                                    <td className="py-3 px-4 border-b border-gray-200">₹{item.amountPaid}</td>
                                    <td className="py-3 px-4 border-b border-gray-200">{formatDate(item.paymentDate)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="flex items-center justify-center mt-6 space-x-4">
                <Button
                    onClick={handlePrev}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                    disabled={page === 1}
                >
                    Prev
                </Button>

                <div className="flex items-center justify-center">
                    <span className="text-lg font-semibold text-gray-700">
                        {page}
                    </span>
                    <span className="mx-2 text-gray-500">/</span>
                    <span className="text-lg font-semibold text-gray-700">
                        {totalPages}
                    </span>
                </div>

                <Button
                    onClick={handleNext}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                    disabled={page === totalPages}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

export default TutorWallet;
