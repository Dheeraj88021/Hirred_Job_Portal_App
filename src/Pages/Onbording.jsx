import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/clerk-react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { BarLoader } from "react-spinners"

const Onbording = () => {
    const { user, isLoaded } = useUser()
    const navigate = useNavigate()
    const handleRoleSelection = async (role) => {
        await user.update({
            unsafeMetadata: { role },
        }).then(() => {
            navigate(role === 'recruiter' ? "/post-jobs" : "/jobs")
        }).catch((err) => {
            console.log("error while updating the role..", err)

        })
    }
    useEffect(() => {
        if (user?.unsafeMetadata?.role) {
            navigate(user?.unsafeMetadata?.role === 'recruiter' ? "/post-jobs" : "/jobs")
        }
    }, [user])

    if (!isLoaded) {
        return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
    }
    return (
        <div className="flex flex-col items-center justify-center mt-32 ">
            <h2 className="gradient_title font-extrabold text-7xl sm:text-8xl tracking-tighter">I am a..</h2>
            <div className="mt-16 grid grid-cols-2 gap-4 w-full md:px-40">
                <Button variant='blue' className="h-36 text-4xl" onClick={() => handleRoleSelection("candidate")}>Candidate</Button>
                <Button variant='destructive' className="h-36 text-4xl" onClick={() => handleRoleSelection("recruiter")}>Recruiter</Button>

            </div>

        </div>
    )
}

export default Onbording