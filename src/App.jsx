import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import AppLayout from "./layouts/AppLayout"
import LandingPage from './Pages/LandingPage';
import Onbording from './Pages/Onbording';
import JobListing from './Pages/JobListing';
import Job from './Pages/Job';
import PostJob from './Pages/PostJob';
import Savejob from './Pages/Savejob';
import MyJob from './Pages/MyJob';
import { ThemeProvider } from './components/theme-provider';
import ProtectiveRoute from './components/ProtectiveRoute';

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <LandingPage />
      },
      {
        path: '/onbording',
        element: (
          <ProtectiveRoute>
            <Onbording />
          </ProtectiveRoute>
        ),
      },
      {
        path: '/jobs',
        element: (<ProtectiveRoute>
          <JobListing />
        </ProtectiveRoute>),

      },
      {
        path: '/job/:id',
        element: (<ProtectiveRoute>
          <Job />
        </ProtectiveRoute>),

      },
      {
        path: '/post-jobs',
        element: (<ProtectiveRoute>
          <PostJob />
        </ProtectiveRoute>),

      },
      {
        path: '/saved-jobs',
        element: (<ProtectiveRoute>
          <Savejob />
        </ProtectiveRoute>),

      },
      {
        path: '/my-jobs',
        element: (<ProtectiveRoute>
          <MyJob />
        </ProtectiveRoute>),

      }
    ]
  }
])

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router}></RouterProvider>
    </ThemeProvider>
  )
}

export default App
