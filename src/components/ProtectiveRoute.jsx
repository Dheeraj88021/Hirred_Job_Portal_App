import { useUser } from "@clerk/clerk-react"
import { Navigate, useLocation } from "react-router-dom"

const ProtectiveRoute = ({ children }) => {
    const { isSignedIn, isLoaded, user } = useUser();
    const { pathname } = useLocation();

    if (isLoaded && !isSignedIn && isSignedIn !== undefined) {
        return <Navigate to="/?sign-in=true" />;
    }
    if (user !== undefined && !user?.unsafeMetadata?.role && pathname !== "/onbording") return <Navigate to="/onbording" />
    return children;
}

export default ProtectiveRoute;