import React, { useEffect, useMemo } from 'react';
import api from '../API/Api';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setPurchasedStudents } from '../../redux/tutor/tutorSlice';
import { useTable, useSortBy, Column, TableInstance } from 'react-table';

// Default icon image for users without a profile picture
import userIcon from '../../assets/images/1000_F_392072816_sO8hOPXhrlg3fELAdmWrLIJyw5dLKWu2.jpg';

const PurchasedStudent: React.FC = () => {
    const dispatch = useDispatch();
    const purchasedStudents = useSelector((state: RootState) => state.tutor.purchased);

    useEffect(() => {
        fetchPurchasedStudents();
    }, []);

    const fetchPurchasedStudents = async () => {
        try {
            const response = await api.get('/backend/course/getPurchasedStudents', {
                headers: {
                    'X-Token-Type': 'tutor',
                },
            });
            console.log('response', response);
            dispatch(setPurchasedStudents(response.data));
        } catch (error) {
            console.error('Failed to fetch purchased students:', error);
        }
    };

    const columns = useMemo<Column<any>[]>(
        () => [
            {
                Header: 'Index',
                id: 'index',
                disableFilters: true,
                Cell: ({ row }) => row.index + 1,
                width: 50,
            },
            {
                Header: "Student",
                accessor: "username",
                width: 200,
            },
            {
                Header: "Email",
                accessor: "email",
                width: 250,
            },
            {
                Header: "Course",
                accessor: "title",
                width: 300, // Specific width for the title column
            },
            {
                Header: "Category",
                accessor: 'category',
                width: 150,
            },
            {
                Header: 'Profile Pic',
                accessor: 'profilePic',
                Filter: () => null,
                Cell: ({ value }) => (
                    <img
                        src={value || userIcon}
                        alt="Profile"
                        className="rounded-full w-12 h-12 object-cover"
                    />
                ),
                width: 100,
            },
        ],
        [purchasedStudents]
    );

    const data = useMemo(() => purchasedStudents, [purchasedStudents]);

    const TableContainer = ({ columns, data }: { columns: Column<any>[], data: any[] }) => {
        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            rows,
            prepareRow,
            state: { sortBy },
            setSortBy,
        }: TableInstance<any> = useTable(
            {
                columns,
                data,
                initialState: { sortBy: [] },
            },
            useSortBy
        );

        return (
            <div className="w-full overflow-x-auto">
                <table {...getTableProps()} className="min-w-full bg-white shadow-md rounded-lg table-fixed">
                    <thead className="bg-gray-800 text-white">
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider border-b border-gray-200"
                                        style={{ width: column.width }}
                                    >
                                        {column.render("Header")}
                                        <span>
                                            {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()} className="bg-custom-gradient text-white divide-y divide-gray-200">
                        {rows.map(row => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()} className="hover:bg-gray-900">
                                    {row.cells.map(cell => {
                                        return (
                                            <td
                                                {...cell.getCellProps()}
                                                className="py-4 px-3 whitespace-nowrap text-sm font-medium text-gray-200"
                                                style={{ width: cell.column.width }}
                                            >
                                                {cell.render("Cell")}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="container h-[90vh] p-4">
            <h1 className="text-2xl font-semibold text-gray-100 mb-6">Purchased Students</h1>
            <div className="bg-white w-full shadow-md rounded-lg p-4">
                <TableContainer columns={columns} data={data} />
            </div>
        </div>
    );
}

export default PurchasedStudent;
