import { useEffect, useState } from "react";
import Post from "../components/Posts";
import { ToastContainer, toast } from 'react-toastify';
import zeraServer from "../backendUrl"
import "./Home.css";
export default function Home(){
    const [posts, setPosts] = useState({})
    
    useEffect(() => {
     fetch(`${zeraServer}/posts`)
         .then(res => res.json()).then(data => setPosts(data))
             .catch(error => toast.error(`${error}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              }))
    }, [])
    return(
        <div className="blogsPage">
            <ToastContainer />
            <h2>Latest Blogs</h2>
            {posts.length > 0 && posts.map(post => (
                    <Post {...post}/>
            ))}
            
        </div>
    )
}