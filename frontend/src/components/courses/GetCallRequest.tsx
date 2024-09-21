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
    const [page,setPage]=useState<number>(1)
    const [totalPage,setTotalPage]=useState<number>(1)
    const limit=4

    useEffect(() => {
        if (courseId) {
            fetchCallRequest(courseId,limit,page);
        }
    }, [courseId,limit,page]);

    const fetchCallRequest = async (courseId: string,limit:number,paage:number) => {
        try {
            const response = await api.get('/backend/contact/getCallRequest', {
                headers: {
                    'X-Token-Type': 'tutor',
                },
                params: {
                    courseId: courseId,
                    limit:limit,
                    page:page
                },
            });
            dispatch(setCallRequests(response.data.getAllCallRequest));
            setTotalPage(response.data.totalPages)
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
    
const handelPrevious=()=>{
    setPage(page-1)
}
const handleForward=()=>{
    setPage(page+1)
}

    return (
        <div className="min-h-screen">
        <Card className="w-[90%] mx-auto my-20 shadow-lg rounded-3xl"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <CardHeader
                    floated={false}
                    shadow={false}
                    className="rounded-lg bg-custom-gradient p-6 flex flex-col items-center" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}            >
                <Typography variant="h4" color="white" className="font-bold mb-2 text-center"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                            }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined}                    />
                </div>
                <div className="flex items-center gap-3 text-white">
                    <Typography variant="small" className="font-normal" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        Total Requests: {filteredRequests.length}
                    </Typography>
                    <Button variant="filled" size="sm" className="bg-white text-red-400"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        Add Request
                    </Button>
                </div>
            </CardHeader>

            <CardBody className="overflow-x-auto px-4 py-6"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <table className="w-full table-auto text-left bg-white rounded-xl">
                    <thead>
                        <tr>
                            {TABLE_HEAD.map((head) => (
                                <th
                                    key={head}
                                    className="p-4 text-teal-900 border-b-2 border-teal-600"
                                >
                                    <Typography variant="small" color="teal" className="font-semibold" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                                            <Avatar src={profilePic} alt={name} size="sm" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                            <div>
                                                <Typography variant="small" color="teal" className="font-semibold"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                                    {name}
                                                </Typography>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 border-b border-gray-200">
                                        <Typography variant="small" color="gray" className="font-normal"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                            {email}
                                        </Typography>
                                    </td>
                                    <td className="p-4 border-b border-gray-200">
                                        <Typography variant="small" color="gray" className="font-normal" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                                        <Typography variant="small" color="gray" className="font-normal"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                                        <Typography variant="small" color="gray" className="font-normal"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                            {dayjs(createdAt).format('MMM D, YYYY h:mm A')}
                                        </Typography>
                                    </td>
                                    <td className="p-4 border-b border-gray-200 text-right flex gap-2">
    {status === 'pending' || status === 'rejected' ? (
        <Tooltip content="Approve Request">
            <IconButton onClick={() => handleApprove(_id)} variant="text"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <CheckIcon className="h-4 w-4 text-green-500" />
            </IconButton>
        </Tooltip>
    ) : status === 'completed' ? (
        <span className="text-blue-900 font-bold mt-1">Done</span> // Display "Completed" text or any other custom content
    ) : (
        <Button onClick={() => handleView(_id)} size="sm" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>View</Button>
    )}
</td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={TABLE_HEAD.length} className="p-4 text-center">
                                    <Typography variant="small" color="gray" className="font-normal"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                        No Request found
                                    </Typography>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </CardBody>
            <CardFooter className="flex items-center justify-center p-6 border-t border-gray-200"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <Typography variant="small" color="teal" className="font-normal"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    Page {page} out of {totalPage}
                </Typography>
                <div className="flex gap-4 ml-auto">
                    <Button disabled={page === 1} onClick={handelPrevious} variant="outlined" size="sm"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        Previous
                    </Button>
                    <Button disabled={page === totalPage} onClick={handleForward} variant="outlined" size="sm"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        Next
                    </Button>
                </div>
            </CardFooter>
        </Card>
        
        </div>
    );
}

export default GetCallRequest;
