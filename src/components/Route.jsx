import { createBrowserRouter } from "react-router-dom";
import { Homepage } from "../pages/Homepage";
import { Createpost } from "../pages/Createpost";
import { Loginpage } from "../pages/Loginpage";
import PostDetail from "../components/PostDetail";
import AuthGuard from "../guard/AuthGuard";
import NotFound from "./NotFound";
import ExplorePost from "./ExplorePost";
import Manageuser from "../pages/Manageuser";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Loginpage />,
  },
  {
    path: "/",
    element: <AuthGuard />,
    children: [
      { path: "/", 
        element: <Homepage />
     },
    {
        path: "/newpost",
         element: <Createpost />
     },
     {
         path: "/Manageuser", 
         element: <Manageuser />
    },
    { path: "/Explorepost", 
        element: <ExplorePost />
     },
    { path: "/posts/:PostId",
        element: <PostDetail /> 
    },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
