import { Link, useSearchParams } from "react-router-dom"
import { Button } from "./ui/button"
import { SignedIn, SignedOut, SignIn, UserButton, useUser } from "@clerk/clerk-react"
import { BriefcaseBusiness, Heart, PenBox } from "lucide-react"
import { useEffect, useState } from "react"

const Headers = () => {
    const [showSign, setShowSign] = useState(false)
    const [search, setSearch] = useSearchParams()
    const { user } = useUser()
    useEffect(() => {
        if (search.get("sign-in")) {
            setShowSign(true)
        }
    }, [search])

    const handleOverLay = (e) => {
        if (e.target == e.currentTarget) {
            setShowSign(false)
            setSearch({})
        }
    }
    return (
        <>
            <nav className="py-4 flex justify-between items-center">
                <Link>
                    <img src="https://github.com/piyush-eon/job-portal/blob/master/public/logo.png?raw=true" className="h-20" />
                </Link>

                <div className="flex gap-4">
                    <SignedOut>
                        <Button variant="outline" onClick={() => setShowSign(true)}>Login</Button>
                    </SignedOut>
                    <SignedIn>
                        {

                            user?.unsafeMetadata?.role === "recruiter" && (
                                <Link to="/post-jobs">
                                    <Button variant="destructive" className="rounded-full">
                                        <PenBox size={20} className="mr-2" />
                                        Post a Job
                                    </Button>

                                </Link>
                            )
                        }
                        <UserButton appearance={{
                            elements: {
                                avatarBox: "w-12 h-12"
                            }
                        }} >
                            <UserButton.MenuItems>
                                <UserButton.Link label="My Jobs"
                                    labelIcon={<BriefcaseBusiness size={15} />}
                                    href="/my-jobs"
                                />
                                <UserButton.Link label="Saved Jobs"
                                    labelIcon={<Heart size={15} />}
                                    href="/saved-jobs"
                                />


                            </UserButton.MenuItems>
                        </UserButton>
                    </SignedIn>
                </div>
            </nav >

            {
                showSign && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                        onClick={handleOverLay}>
                        <SignIn
                            signUpFallbackRedirectUrl="/onbording"
                            fallbackRedirectUrl="/onbording" >
                        </SignIn>
                    </div>
                )
            }
        </>
    )
}

export default Headers