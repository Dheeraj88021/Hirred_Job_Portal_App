import { getApplications } from "@/api/apiApplications";
import useFetch from "@/hook/Usefetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import ApplicationCard from "./ApplicationCard";
// import { Trash2Icon } from "lucide-react";
// import { deleteJobs } from "@/api/ApiJobs";

const CreatedApplications = () => {

    const { user } = useUser();

    const {
        loading: loadingApplications,
        data: applications,
        fn: fnApplications,
    } = useFetch(getApplications, {
        user_id: user.id,
    });



    // const { loading: loadingDelete, fn: fnDeleteJob } = useFetch(deleteJobs, {
    //     job_id: job?.id,

    // })

    // const handleDeleteJobs = async () => {
    //     await fnDeleteJob()
    //     onJobSaved()
    // }


    useEffect(() => {
        fnApplications();
    }, []);

    if (loadingApplications) {
        return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
    }

    return (
        <div className="flex flex-col gap-2">
            {
                applications?.map((application) => {
                    return <ApplicationCard
                        key={application.id}
                        application={application}
                        isCandidate

                    />
                })}

        </div >

    )

}
export default CreatedApplications