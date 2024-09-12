import { getSavedJobs } from "@/api/ApiJobs";
import JobCards from "@/components/JobCards";
import useFetch from "@/hook/Usefetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";

const Savejob = () => {

    const { isLoaded } = useUser();

    const {
        loading: loadingSavedJobs,
        data: savedJobs,
        fn: fnSavedJobs,
    } = useFetch(getSavedJobs);

    useEffect(() => {
        if (isLoaded) {
            fnSavedJobs();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded]);

    if (!isLoaded || loadingSavedJobs) {
        return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
    }

    return (
        <div>
            <h1 className="gradient_title font-extrabold text-6xl sm:text-7xl text-center pb-8">
                Saved Jobs
            </h1>

            {loadingSavedJobs === false && (
                <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedJobs?.length ? (
                        savedJobs?.map((saved) => {
                            return (
                                <JobCards
                                    key={saved.id}
                                    job={saved?.job}
                                    onJobAction={fnSavedJobs}
                                    savedInit={true}
                                />
                            );
                        })
                    ) : (
                        <div className="">No Saved Jobs Yet👀</div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Savejob