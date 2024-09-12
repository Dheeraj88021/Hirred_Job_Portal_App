import { getSingleJob, updateHiringStatus } from "@/api/ApiJobs"
import ApplicationCard from "@/components/ApplicationCard"
import AppplyJobDrawer from "@/components/Appply-job"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useFetch from "@/hook/Usefetch"
import { useUser } from "@clerk/clerk-react"
import MDEditor from "@uiw/react-md-editor"
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { BarLoader } from "react-spinners"

const Job = () => {
    const { isLoaded, user } = useUser()
    const { id } = useParams()

    const { loading: loadingJob, data: job, fn: fnJobs } = useFetch(getSingleJob, {
        job_id: id,
    })

    const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(updateHiringStatus, { job_id: id })

    const handleStatusChange = (value) => {
        const isOpen = value === "open";
        fnHiringStatus(isOpen).then(() => fnJobs())
    }

    useEffect(() => {
        if (isLoaded) fnJobs()
    }, [isLoaded])

    if (!isLoaded || loadingJob) return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />

    return (
        <div className="flex flex-col gap-8 mt-5">
            <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center ">
                <h1 className="gradient_title font-extrabold pb-3 text-4xl sm:text-6xl">{job?.title}</h1>
                <img src={job?.company?.logo_url} className="h-12" alt={job?.title} />
            </div>
            <div className="flex justify-between">
                <div className="flex gap-2">
                    <MapPinIcon />
                    {job?.location}
                </div>
                <div className="flex gap-2">
                    <Briefcase /> {job?.applications?.length} Applicants
                </div>
                <div className="flex gap-2">
                    {job?.isOpen ? (<>
                        <DoorOpen /> Open
                    </>
                    ) :
                        (
                            <>
                                <DoorClosed /> Closed</>
                        )}
                </div>
            </div>

            {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
            {
                job?.recruiter_id === user?.id &&

                <Select onValueChange={handleStatusChange}>
                    <SelectTrigger className={`w-full ${job?.isOpen ? "bg-green-950" : "bg-red-950"}`}>
                        <SelectValue placeholder={"Hiring Status " + (job?.isOpen ? " ( Open )" : " ( Closed )")} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="closed" >Closed</SelectItem>

                    </SelectContent>
                </Select>

            }
            <h2 className="text-2xl sm:text-3xl font-bold">About the Job Description's</h2>
            <p className="sm:text-lg">{job?.description}</p>
            <h2 className="text-2xl sm:text-3xl font-bold">What we are Looking for this Role</h2>

            <MDEditor.Markdown source={job?.requirrements} className="bg-transparent sm:text-lg" />


            {
                job?.recruiter_id !== user?.id && (
                    <AppplyJobDrawer
                        job={job}
                        user={user}
                        fetchJob={fnJobs}
                        applied={job?.applications?.find((ap) => ap.condidate_id === user.id)}

                    />
                )}

            {
                job?.applications?.length > 0 && job?.recruiter_id === user?.id && (
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl sm:text-3xl font-bold">Applications of the Candidate's</h2>
                        <hr />
                        {
                            job?.applications.map((application) => {
                                return (
                                    <ApplicationCard key={application.id} application={application} />
                                )
                            })
                        }
                    </div>
                )
            }
        </div>
    )
}

export default Job