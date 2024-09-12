import { getCompanies } from "@/api/ApiCompany"
import { getJobs } from "@/api/ApiJobs"
import JobCards from "@/components/JobCards"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useFetch from "@/hook/Usefetch"
import { useUser } from "@clerk/clerk-react"
import { State } from "country-state-city"
import { useEffect, useState } from "react"
import { BarLoader } from "react-spinners"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

const JobListing = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [location, setLocations] = useState("")
    const [company_id, setCompany_Id] = useState("")
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 2; // Set the number of jobs per page

    const { isLoaded } = useUser()

    const { fn: fnJobs, data: Jobs, loading: loadingJobs } = useFetch(getJobs, {
        location, company_id, searchQuery
    })
    const { fn: fnCompanies, data: companies } = useFetch(getCompanies)

    const ClearFilter = () => {
        setCompany_Id("")
        setLocations("")
        setSearchQuery("")
        setCurrentPage(1);
    }

    useEffect(() => {
        if (isLoaded) fnCompanies()
    }, [isLoaded])

    useEffect(() => {
        if (isLoaded) fnJobs();
    }, [isLoaded, location, company_id, searchQuery])


    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = Jobs?.slice(indexOfFirstJob, indexOfLastJob);
    const totalPages = Math.ceil(Jobs?.length / jobsPerPage);

    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // add search filter here 
    const HandleSearch = (e) => {
        e.preventDefault();
        let fromData = new FormData(e.target)
        const query = fromData.get("search-Query")
        if (query) setSearchQuery(query)
        setCurrentPage(1)
    }

    if (!isLoaded) {
        return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
    }

    return (
        <div>
            <h1 className="gradient_title font-extrabold text-6xl sm:text-7xl text-center pb-8">Latest Jobs</h1>

            <form onSubmit={HandleSearch} className="h-14 flex w-full gap-2 items-center mb-3">
                <Input type="text" placeholder="Search Job by Title.." name="search-Query"
                    className="h-full flex-1 px-4 text-md" variant="blue" />
                <Button type="submit" className="h-full sm:w-28 text-xl bg-blue-600" variant="blue" >Search</Button>
            </form>

            <div className="mb-6 flex flex-col sm:flex-row gap-2">
                <Select value={location} onValueChange={(value) => setLocations(value)}>
                    <SelectTrigger >
                        <SelectValue placeholder="Filters by the location" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {
                                State.getStatesOfCountry("IN").map(({ name }) => {
                                    return (
                                        <SelectItem key={name} value={name}>{name}</SelectItem>
                                    )
                                })}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Select value={company_id} onValueChange={(value) => setCompany_Id(value)}>
                    <SelectTrigger >
                        <SelectValue placeholder="Filters by the Companies" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {
                                companies?.map(({ name, id }) => {
                                    return (
                                        <SelectItem key={name} value={id}>{name}</SelectItem>
                                    )
                                })
                            }
                            {/* <SelectItem >Amazon</SelectItem> */}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Button onClick={ClearFilter} className="sm:w-1/2" variant="destructive" >Clear Filters</Button>
            </div>

            {loadingJobs && (
                <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
            )}

            {loadingJobs === false && (
                <div className="mt:8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentJobs?.length ? (
                        currentJobs.map((job) => {
                            return <JobCards key={job.id} job={job} SavedInitial={job?.saved?.length > 0} />
                        })
                    ) : (
                        <div className="flex items-center">
                            No Jobs Found 😊 Yet..
                        </div>
                    )
                    }
                </div>
            )
            }

            {totalPages > 1 && (
                <Pagination className="mt-4">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={() => handleClick(currentPage - 1)}
                                disabled={currentPage === 1}
                            />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, index) => (
                            <PaginationItem key={index}>
                                <PaginationLink
                                    href="#"
                                    isActive={currentPage === index + 1}
                                    onClick={() => handleClick(index + 1)}
                                >
                                    {index + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={() => handleClick(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}

        </div>
    )
}

export default JobListing