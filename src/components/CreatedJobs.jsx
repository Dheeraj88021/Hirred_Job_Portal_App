import { getMyJobs } from "@/api/ApiJobs";
import useFetch from "@/hook/Usefetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import JobCards from "./JobCards";

const CreatedJobs = () => {

    const { user } = useUser();

    const {
        loading: loadingCreatedJobs,
        data: createdJobs,
        fn: fnCreatedJobs,
    } = useFetch(getMyJobs, {
        recruiter_id: user.id,
    });

    useEffect(() => {
        fnCreatedJobs();
    }, []);

    return (
        <div>
            {loadingCreatedJobs ? (
                <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
            ) : (
                <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {createdJobs?.length ? (
                        createdJobs.map((job) => {
                            return (
                                <JobCards
                                    key={job.id}
                                    job={job}
                                    onJobSaved={fnCreatedJobs}
                                    isMyJob
                                />
                            );
                        })
                    ) : (
                        <div className="flex items-center">No Jobs Found 😢</div>
                    )}
                </div>
            )}
        </div>
    )
}

export default CreatedJobs