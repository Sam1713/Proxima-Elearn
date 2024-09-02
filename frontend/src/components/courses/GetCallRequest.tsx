import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PencilIcon, CheckIcon } from "@heroicons/react/24/solid";
import api from '../API/Api';
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Avatar,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setCallRequests } from "../../redux/tutor/tutorSlice";
import dayjs from 'dayjs'; 
import ApproveBookingModal from "../../modals/videocall/ApproveBookingModal";
import { useNavigate } from "react-router-dom";

const TABLE_HEAD = ["Profile", "Email", "Purpose", "Status", "Details", "Requested Time", "Actions"];

function GetCallRequest() {
    const [open, setOpen] = useState<boolean>(false);
    const details = useSelector((state: RootState) => state.tutor.tutorUploadedCourseDetail);
    const CallRequestDetails = useSelector((state: RootState) => state.tutor.CallRequestDetails || []);
    const booking = useSelector((state: RootState) => state.tutor.CallRequestAccept);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const courseId = details?._id;
    const [search, setSearch] = useState<string>("");
    const [bookingId, setBookingId] = useState<string>('');

    useEffect(() => {
        if (courseId) {
            fetchCallRequest(courseId);
        }
    }, [courseId]);

    const fetchCallRequest = async (courseId: string) => {
        try {
            const response = await api.get('/backend/contact/getCallRequest', {
                headers: {
                    'X-Token-Type': 'tutor',
                },
                params: {
                    courseId: courseId,
                },
            });
            dispatch(setCallRequests(response.data));
        } catch (error) {
            console.error('Error fetching call requests:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const filteredRequests = (CallRequestDetails || []).filter(({ name, email, purpose, description }: any) =>
        name.toLowerCase().includes(search.toLowerCase()) ||
        email.toLowerCase().includes(search.toLowerCase()) ||
        purpose.toLowerCase().includes(search.toLowerCase()) ||
        description.toLowerCase().includes(search.toLowerCase())
    );

    const handleApprove = (id: string) => {
        setBookingId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleView = (id: string) => {
        console.log('id',id)
        navigate(`/getFullCallDetails/${id}`);
    };

    return (
        <div className="min-h-screen">
        <Card className="w-[90%] mx-auto my-20 shadow-lg rounded-3xl">
            <CardHeader
                floated={false}
                shadow={false}
                className="rounded-lg bg-custom-gradient p-6 flex flex-col items-center"
            >
                <Typography variant="h4" color="white" className="font-bold mb-2 text-center">
                    Call Request Students
                </Typography>
                <div className="w-full md:w-1/2 mb-4">
                    <Input
                        label="Search"
                        onChange={handleChange}
                        icon={<MagnifyingGlassIcon className="h-5 w-5 text-black" />}
                        className="rounded-full text-black bg-white placeholder-white focus:ring-2 focus:ring-red-600 focus:outline-none"
                        containerProps={{
                            className: "rounded-full bg-red-400",
                        }}
                    />
                </div>
                <div className="flex items-center gap-3 text-white">
                    <Typography variant="small" className="font-normal">
                        Total Requests: {filteredRequests.length}
                    </Typography>
                    <Button variant="filled" size="sm" className="bg-white text-red-400">
                        Add Request
                    </Button>
                </div>
            </CardHeader>

            <CardBody className="overflow-x-auto px-4 py-6">
                <table className="w-full table-auto text-left bg-white rounded-xl">
                    <thead>
                        <tr>
                            {TABLE_HEAD.map((head) => (
                                <th
                                    key={head}
                                    className="p-4 text-teal-900 border-b-2 border-teal-600"
                                >
                                    <Typography variant="small" color="teal" className="font-semibold">
                                        {head}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRequests.length > 0 ? (
                            filteredRequests.map(({ name, email, purpose, status, profilePic, description, createdAt, _id }: any) => (
                                <tr key={_id} className="hover:bg-teal-50 transition-all">
                                    <td className="p-4 border-b border-gray-200">
                                        <div className="flex items-center gap-3">
                                            <Avatar src={profilePic} alt={name} size="sm" />
                                            <div>
                                                <Typography variant="small" color="teal" className="font-semibold">
                                                    {name}
                                                </Typography>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 border-b border-gray-200">
                                        <Typography variant="small" color="gray" className="font-normal">
                                            {email}
                                        </Typography>
                                    </td>
                                    <td className="p-4 border-b border-gray-200">
                                        <Typography variant="small" color="gray" className="font-normal">
                                            {purpose}
                                        </Typography>
                                    </td>
                                    <td className="px-[1] border-b">
                                        <Chip
                                            variant="ghost"
                                            size="sm"
                                            value={status}
                                            color={
                                                status === "approved"
                                                    ? "green"
                                                    : status === "rejected"
                                                    ? "red"
                                                    : status === "pending"
                                                    ? "yellow"
                                                    : "blue"
                                            }
                                            className="rounded-full"
                                        />
                                    </td>

                                    <td className="p-4 border-b border-gray-200">
                                        <Typography variant="small" color="gray" className="font-normal">
                                            {description}
                                        </Typography>
                                    </td>
                                    <ApproveBookingModal 
                                        isOpen={open} 
                                        onClose={handleClose} 
                                        id={bookingId}   
                                        fetchCallRequest={() => fetchCallRequest(courseId)} 
                                    />
                                    <td className="p-4 border-b border-gray-200">
                                        <Typography variant="small" color="gray" className="font-normal">
                                            {dayjs(createdAt).format('MMM D, YYYY h:mm A')}
                                        </Typography>
                                    </td>
                                    <td className="p-4 border-b border-gray-200 text-right flex gap-2">
    {status === 'pending' || status === 'rejected' ? (
        <Tooltip content="Approve Request">
            <IconButton onClick={() => handleApprove(_id)} variant="text">
                <CheckIcon className="h-4 w-4 text-green-500" />
            </IconButton>
        </Tooltip>
    ) : status === 'completed' ? (
        <span className="text-blue-900 font-bold mt-1">Done</span> // Display "Completed" text or any other custom content
    ) : (
        <Button onClick={() => handleView(_id)} size="sm">View</Button>
    )}
</td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={TABLE_HEAD.length} className="p-4 text-center">
                                    <Typography variant="small" color="gray" className="font-normal">
                                        No course found
                                    </Typography>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </CardBody>
            <CardFooter className="flex items-center justify-center p-6 border-t border-gray-200">
                <Typography variant="small" color="teal" className="font-normal">
                    Page 1 of 10
                </Typography>
                <div className="flex gap-4 ml-auto">
                    <Button variant="outlined" size="sm">
                        Previous
                    </Button>
                    <Button variant="outlined" size="sm">
                        Next
                    </Button>
                </div>
            </CardFooter>
        </Card>
        </div>
    );
}

export default GetCallRequest;
