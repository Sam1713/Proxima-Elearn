import { DocumentIcon } from "@heroicons/react/24/solid";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import api from '../API/Api'
import {
  Card,
  Input,
  Typography,
  CardHeader,
  IconButton
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setOrdersList } from "../../redux/admin/adminSlice";

const TABLE_HEAD = [
  { head: "Index" },
  { head: "Customer" },
  { head: "Email" },
  { head: "Course Title" },
  { head: "Amount" },
  { head: "Payment Date" },
  { head: "" },
];

function OrdersList() {
  const dispatch = useDispatch();
  const OrdersList = useSelector((state: RootState) => state.admin.ordersList);
  const [page,setPage]=useState<number>(1)
  const [totalPages,setTotalPages]=useState<number>(1)
  const limit:number=3


  useEffect(() => {
    fetchOrdersList(page, limit);
  }, [page,limit]);


  const fetchOrdersList = async (page: number,limit: number) => {
    try {
      const response = await api.get('/backend/admin/getOrdersList', {
        headers: { 'X-Token-Type': 'admin' },
        params:{page:page,limit:limit}
      });
      console.log('res',response.data)
      dispatch(setOrdersList(response.data.ordersList));
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error('Error fetching orders list:', error);
    }
  };

  const handleIncPage = () => {
    console.log(';sfddsf')
    setPage(prevPage => prevPage + 1);
  };

  const handleDecPage = () => {
    setPage(prevPage => Math.max(prevPage - 1, 1)); // Ensure page doesn't go below 1
  };
  return (
    <div className="mt-5 mx-10 w-full md:w-[120%]">
      <Card className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <h1 className="text-2xl pt-4 mx-5 text-gray-100 font-extrabold underline">Orders List</h1>
        <CardHeader
          floated={false}
          shadow={false}
          className="mb-4 rounded-none p-2 bg-gray-700"
        >
          <div className="w-full md:w-96 text-white">
  <div className="relative">
    <Input
      label={<span className="text-white">Search</span>} // Apply custom class here
      icon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-100" />}
      className="bg-gray-900 text-gray-100 placeholder-white"
    />
  </div>
</div>


        </CardHeader>
        <div className="overflow-x-auto w-full ">
          <table className=" table-auto min-w-full text-left w-full">
            <thead>
              <tr className="bg-gray-700 text-gray-100">
                {TABLE_HEAD.map(({ head }, index) => (
                  <th key={index} className="border-b border-gray-600 p-4">
                    <Typography variant="small" className="font-bold">
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {OrdersList.map(
                (order, index) => {
                  const { number, username, email, title, price, createdAt } = order;
                  const isLast = index === OrdersList.length - 1;
                  const classes = `p-4 w-[17%]  ${isLast ? '' : 'border-b border-gray-600'}`;
                  const pageIndex = (page - 1) * limit + index + 1;

                  return (
                    <tr key={number} className="hover:bg-gray-700">
                      <td className={classes}>
                        <Typography variant="small" className="font-bold text-gray-300">
                          {pageIndex} {/* Display index number */}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" className="font-normal text-gray-300">
                          {username}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" className="font-normal text-gray-400">
                          {email}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" className="font-normal text-gray-300 ">
                          {title}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" className="font-normal text-gray-300">
                          ${price}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" className="font-normal text-gray-300">
                          {new Date(createdAt).toLocaleDateString()}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <div className="flex items-center gap-2">
                          <IconButton variant="text" size="sm">
                            <DocumentIcon className="h-4 w-4 text-gray-400" />
                          </IconButton>
                          <IconButton variant="text" size="sm">
                            <ArrowDownTrayIcon className="h-4 w-4 text-gray-400" />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <div className="flex flex-col items-center p-4 bg-gray-700 mt-4 rounded-lg shadow-md">
  <div className="flex items-center gap-4 mb-2">
    <button
      onClick={handleDecPage}
      className="bg-gray-600 text-gray-100 px-4 py-2 rounded-lg hover:bg-gray-500 disabled:bg-gray-400"
      disabled={page === 1} // Disable button if on the first page
    >
      Previous
    </button>
    <span className="text-gray-100 font-semibold">
      Page {page} of {totalPages}
    </span>
    <button
      onClick={handleIncPage}
      className="bg-gray-600 text-gray-100 px-4 py-2 rounded-lg hover:bg-gray-500 disabled:bg-gray-400"
      disabled={page === totalPages} // Disable button if on the last page
    >
      Next
    </button>
  </div>
  {/* Optional: Add a border or shadow around the buttons for emphasis */}
  <div className="border-t border-gray-600 pt-2 w-full text-center">
    <span className="text-gray-400 text-sm">Use the buttons to navigate through pages.</span>
  </div>
</div>

      </Card>
    </div>
  );
}

export default OrdersList;
