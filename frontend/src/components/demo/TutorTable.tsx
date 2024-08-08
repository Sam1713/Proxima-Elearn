// import React, { useMemo } from 'react';
// import { useTable, useSortBy, useFilters, usePagination } from 'react-table';

// const TutorsTable = ({ data }) => {
//   const columns = useMemo(
//     () => [
//       {
//         Header: 'Username',
//         accessor: 'username',
//       },
//       {
//         Header: 'Email',
//         accessor: 'email',
//       },
//       {
//         Header: 'Profile Picture',
//         accessor: 'profilePic',
//         Cell: ({ value }) => (
//           <img
//             src={value}
//             alt="profile"
//             style={{ width: '50px', borderRadius: '50%' }}
//           />
//         ),
//       },
//       {
//         Header: 'Phone',
//         accessor: 'phone',
//       },
//     ],
//     []
//   );

//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     prepareRow,
//     page,
//     canPreviousPage,
//     canNextPage,
//     pageOptions,
//     pageCount,
//     gotoPage,
//     nextPage,
//     previousPage,
//     setPageSize,
//     state: { pageIndex, pageSize },
//   } = useTable(
//     {
//       columns,
//       data,
//       initialState: { pageIndex: 0 },
//     },
//     useFilters,
//     useSortBy,
//     usePagination
//   );

//   return (
//     <>
//       <table {...getTableProps()} style={{ border: 'solid 1px black', width: '100%' }}>
//         <thead>
//           {headerGroups.map(headerGroup => (
//             <tr {...headerGroup.getHeaderGroupProps()}>
//               {headerGroup.headers.map(column => (
//                 <th {...column.getHeaderProps(column.getSortByToggleProps())}>
//                   {column.render('Header')}
//                   <span>
//                     {column.isSorted
//                       ? column.isSortedDesc
//                         ? ' 🔽'
//                         : ' 🔼'
//                       : ''}
//                   </span>
//                   <div>{column.canFilter ? column.render('Filter') : null}</div>
//                 </th>
//               ))}
//             </tr>
//           ))}
//         </thead>
//         <tbody {...getTableBodyProps()}>
//           {page.map(row => {
//             prepareRow(row);
//             return (
//               <tr {...row.getRowProps()}>
//                 {row.cells.map(cell => {
//                   return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
//                 })}
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//       <div className="pagination">
//         <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
//           {'<<'}
//         </button>
//         <button onClick={() => previousPage()} disabled={!canPreviousPage}>
//           {'<'}
//         </button>
//         <button onClick={() => nextPage()} disabled={!canNextPage}>
//           {'>'}
//         </button>
//         <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
//           {'>>'}
//         </button>
//         <span>
//           Page{' '}
//           <strong>
//             {pageIndex + 1} of {pageOptions.length}
//           </strong>{' '}
//         </span>
//         <span>
//           | Go to page:{' '}
//           <input
//             type="number"
//             defaultValue={pageIndex + 1}
//             onChange={e => {
//               const page = e.target.value ? Number(e.target.value) - 1 : 0;
//               gotoPage(page);
//             }}
//             style={{ width: '100px' }}
//           />
//         </span>{' '}
//         <select
//           value={pageSize}
//           onChange={e => {
//             setPageSize(Number(e.target.value));
//           }}
//         >
//           {[10, 20, 30, 40, 50].map(pageSize => (
//             <option key={pageSize} value={pageSize}>
//               Show {pageSize}
//             </option>
//           ))}
//         </select>
//       </div>
//     </>
//   );
// };

// export default TutorsTable;
