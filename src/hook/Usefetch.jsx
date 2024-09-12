import { useSession } from "@clerk/clerk-react";
import { useState } from "react"

const useFetch = (cb, options = {}) => {
    const [data, setdata] = useState(undefined);
    const [loading, setloading] = useState(null);
    const [error, setErorr] = useState(null)

    const { session } = useSession()
    const fn = async (...args) => {
        setloading(true)
        setErorr(null)
        try {
            const supabaseToken = await session.getToken({
                template: "supabase",
            });
            const response = await cb(supabaseToken, options, ...args)
            setdata(response)
            setErorr(null)
        } catch (error) {
            setErorr(error)
            console.log(error)
        } finally {
            setloading(false)
        }

    }
    return { fn, data, loading, error }
}

export default useFetch