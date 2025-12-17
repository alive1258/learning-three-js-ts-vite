import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/Main";
import Animationloop from "../components/Dashboard/Animationloop/Animationloop";
import Dashboard from "../components/Dashboard/Dashboard/Dashboard";
import Geometries from "../components/Dashboard/Geometries/Geometries";
import Camera from "../components/Dashboard/Camera/Camera";
import Materials from "../components/Dashboard/Materials/Materials";
import CommonMaterials from "../components/Dashboard/CommonMaterials/commonMaterials";

const router = createBrowserRouter([
  // admin

  {
    path: "/",
    element: <MainLayout />,

    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "/dashboard/animationloop",
        element: <Animationloop />,
      },
      {
        path: "/dashboard/geometries",
        element: <Geometries />,
      },
      {
        path: "/dashboard/camera",
        element: <Camera />,
      },
      {
        path: "/dashboard/materials",
        element: <Materials />,
      },
      {
        path: "/dashboard/common-materials",
        element: <CommonMaterials />,
      },
    ],
  },
]);

export default router;
