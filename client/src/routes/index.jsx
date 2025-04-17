import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";


const routes = [
    {
      path: "/",
      element: <DashboardLayout />,
      children: [
        { index: true, element: <Home /> },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ];
  
  export default routes;
