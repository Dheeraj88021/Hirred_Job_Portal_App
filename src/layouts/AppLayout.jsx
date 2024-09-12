import Headers from "@/components/Headers"
import { Outlet } from "react-router-dom"

const AppLayout = () => {
    return (
        <div>
            <div className="grid_background"></div>
            <main className="min-h-screen container">
                <Headers />
                <Outlet />
            </main>
            <div className="p-10 text-center bg-slate-700 mt-10">All rights reserved Made 💙 by Dheeraj Verma 👍</div>
        </div>
    )
}

export default AppLayout