import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import female from '../../assets/images/1-512.webp';
import { Card, CardBody, CardHeader, Typography } from "@material-tailwind/react";
import Chart from "react-apexcharts";
import { Square3Stack3DIcon } from "@heroicons/react/24/outline";
import api from '../API/Api'
// Chart configuration
// Chart configuration
const chartConfig = {
  type: "line" as const,
  height: 240,
  series: [
    {
      name: "Sales",
      data: [50, 40, 300, 320, 500, 350, 200, 230, 500],
    },
  ],
  options: {
    chart: {
      toolbar: {
        show: false,
      },
    },
    title: {
      text: "Sales Overview", // Title of the chart
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#fff',
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#4F46E5"], // Modern color
    stroke: {
      lineCap: "round" as const, // Explicit type for lineCap
      curve: "smooth" as const, // Explicit type for curve
    },
    markers: {
      size: 0,
    },
    xaxis: {
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        style: {
          colors: "#6B7280", // Updated color for x-axis labels
          fontSize: "14px",
          fontWeight: 500,
        },
      },
      categories: [
        "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ],
    },
    yaxis: {
      labels: {
        style: {
          colors: "#6B7280", // Updated color for y-axis labels
          fontSize: "14px",
          fontWeight: 500,
        },
      },
    },
    grid: {
      show: true,
      borderColor: "#E5E7EB",
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 5,
        right: 20,
      },
    },
    fill: {
      opacity: 0.9, // Adjusted opacity for the fill
    },
    tooltip: {
      theme: "dark",
    },
  },
};


const Dashboard: React.FC = () => {
   const [deductedAmount,setDeductedAmount]=useState<number>(0)
    useEffect(()=>{
      fetchWalletDetails()
    },[])

    const fetchWalletDetails=async()=>{
        const response=await api.get('/backend/admin/getWalletDetails',{
           headers:{
            'X-Token-Type':'admin'
           }
        })
        setDeductedAmount(response.data.adminAmount)
        console.log('res',response.data)
    }
  return (
    <div className=" py-6 my-6 md:my-0 p-6 md:w-auto md:mx-10 bg-black rounded-xl  min-h-screen font-serif">
      <div className="md:flex flex-w md:gap-4   md:mb-6">
        {/* Ratings Card 1 */}
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-teal-400 w-full md:w-1/2 lg:w-1/3 flex items-center p-2 mb-3 md:mb-aut rounded-lg shadow-lg relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="md:flex-1 w-full md:w-auto text-left ">
            <h1 className="text-3xl font-bold text-white mb-4">Ratings</h1>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-semibold text-white">13K</h1>
              <div className="text-green-300 mx-3 font-medium text-xl flex items-center">
                +15.6%
              </div>
            </div>
            <button className="bg-red-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition duration-300">
              Year of 2021
            </button>
          </div>
          <div className="md:flex-shrink-0 ml-6 ">
            <div className="relative w-32 h-32">
              <img
                className="w-full h-full object-cover rounded-full shadow-md"
                src={female}
                alt="Female"
                style={{
                  filter: 'brightness(0) invert(1)', // Makes the image white
                }}
              />
              <div className="absolute inset-0 rounded-full border-4 border-blue-400 -z-10" />
            </div>
          </div>
        </motion.div>
        
        {/* Ratings Card 2 */}
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-teal-400 w-full md:w-1/2 lg:w-1/3 flex items-center p-4 mb-3  md:mb-auto rounded-lg shadow-lg relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="md:flex-1 text-left">
            <h1 className="text-3xl font-bold text-white mb-4">Ratings</h1>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-semibold text-white">13K</h1>
              <div className="text-green-300 mx-3 font-medium text-xl flex items-center">
                +15.6%
              </div>
            </div>
            <button className="bg-red-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition duration-300">
              Year of 2021
            </button>
          </div>
          <div className="flex-shrink-0 ml-6">
            <div className="relative w-32 h-32">
              <img
                className="w-full h-full object-cover rounded-full shadow-md"
                src={female}
                alt="Female"
                style={{
                  filter: 'brightness(0) invert(1)', // Makes the image white
                }}
              />
              <div className="absolute inset-0 rounded-full border-4 border-blue-400 -z-10" />
            </div>
          </div>
        </motion.div>
        
        {/* Admin Transaction Details Card */}
        <motion.div
  className="bg-gradient-to-r from-yellow-400 to-orange-500 w-full md:w-1/2 lg:w-1/2 flex items-center p-6 rounded-lg shadow-lg relative overflow-hidden"
  whileHover={{ scale: 1.02 }}
  transition={{ duration: 0.3 }}
>
  <div className="flex-1 text-left">
    <h1 className="text-3xl font-bold text-white mb-4">Wallet Balance</h1>
    <div className="flex items-center justify-between mb-4">
    {deductedAmount == 0 ? (
  <span className="w-6 h-6 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></span> // Show spinning animation
) : (
  <h1 className="text-2xl font-semibold text-blue-500">{deductedAmount}</h1> // Show the deducted amount
)}

     
      <div className="text-green-300 mx-3 font-medium text-xl flex items-center">
        +$120.75
      </div>
    </div>
    <button className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
      View Transactions
    </button>
  </div>
  <div className="flex-shrink-0 ml-6">
    <div className="relative w-32 h-32 flex items-center justify-center">
    <span className="text-white text-5xl">₹</span>
    <div className="absolute inset-0 rounded-full border-4 border-yellow-400 -z-10" />
    </div>
  </div>
</motion.div>

      </div>

      {/* Chart Card */}
      <Card className="shadow-lg rounded-lg overflow-hidden"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="flex flex-col gap-4 rounded-none md:flex-row md:items-center bg-gray-800 text-white"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        >
          <div className="w-max rounded-lg bg-gray-900 p-5 text-white">
            <Square3Stack3DIcon className="h-6 w-6" />
          </div>
          <div>
            <Typography variant="h6" color="white"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              Line Chart
            </Typography>
            <Typography
              variant="small"
              color="gray"
              className="max-w-sm font-normal"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}            >
              Visualize your data in a simple way using the @material-tailwind/react chart plugin.
            </Typography>
          </div>
        </CardHeader>
        <CardBody className="px-4 py-2" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <Chart 
        options={chartConfig.options} 
        series={chartConfig.series} 
        type={chartConfig.type} 
        height={chartConfig.height} 
      />        </CardBody>
      </Card>
    </div>
  );
};

export default Dashboard;
