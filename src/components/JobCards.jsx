import { useUser } from "@clerk/clerk-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Heart, HeartIcon, MapPinIcon, Trash2Icon } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { deleteJobs, savedJobs } from "@/api/ApiJobs"
import useFetch from "@/hook/Usefetch"
import { useEffect, useState } from "react"
import { BarLoader } from "react-spinners"


const JobCards = ({ job,
    isMyJob = false,
    SavedInitial = false,
    onJobSaved = () => { },
}) => {
    const [saved, setSaved] = useState(SavedInitial)


    const { fn: fnSavedJobs, data: SavedJob, loading: SavedloadingJobs } = useFetch(savedJobs, {
        alreadySaved: saved,
    })

    const { user } = useUser()
    const handleSavedJobs = async () => {
        await fnSavedJobs({
            user_id: user.id,
            job_id: job.id
        });
        onJobSaved()
    }


    const { loading: loadingDelete, fn: fnDeleteJob } = useFetch(deleteJobs, {
        job_id: job.id,

    })

    const handleDeleteJobs = async () => {
        await fnDeleteJob()
        onJobSaved()
    }
    useEffect(() => {
        if (SavedJob !== undefined) setSaved(SavedJob?.length > 0)
    }, [SavedJob])

    return (
        <Card className="flex flex-col">
            {
                loadingDelete && (
                    <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
                )
            }
            <CardHeader>
                <CardTitle className="flex justify-between font-bold">
                    {job.title}
                    {isMyJob && (<Trash2Icon fill="red" size={18} className="text-red-300 cursor-pointer"
                        onClick={handleDeleteJobs}
                    />)}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 flex-1">
                <div className="flex justify-between">
                    {
                        job.company && <img src={job.company.logo_url} className="h-6" />
                    }
                    <div className="flex gap-2 items-center">
                        <MapPinIcon size={15} />{job.location}
                    </div>
                </div>
                <hr />
                {job.description}
                {/* // agar description me {comma} aayega to isko ham short kr skte hai .substring(0, job.description.indexOf(".")) */}

            </CardContent>
            <CardFooter className="flex gap-2">
                <Link to={`/job/${job.id}`} className="flex-1">
                    <Button variant="secondary" className="w-full">More Details</Button>
                </Link>
                {
                    !isMyJob && (
                        <Button variant="outline" className="w-15" onClick={handleSavedJobs}
                            disabled={SavedloadingJobs} >
                            {saved ? (
                                < Heart size={20} stroke="red" fill="red" />

                            ) : (
                                <Heart size={20} />
                            )}

                        </Button>
                    )
                }
            </CardFooter>
        </Card>


    )
}

export default JobCards