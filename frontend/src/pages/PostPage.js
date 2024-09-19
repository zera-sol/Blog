import React, { useEffect, useState } from 'react';
import { MdEdit, MdDelete} from 'react-icons/md';
import { useParams, Link, useNavigate} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { format } from 'date-fns';
import zeraServer from "../backendUrl"
import './PostPage.css';

export default function PostPage() {
    const [post, setPost] = useState({});
    const [isAuthor, setIsAuthor] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate()

    useEffect(() => {
        fetch(`${zeraServer}/posts/${id}`, {
            method: 'GET',
            credentials: 'include', // Include credentials to ensure cookies are sent
        })
            .then(res => res.json())
            .then(data => {
                setPost(data);
                // Check if the logged-in user is the author
                if (data.author?._id === data.userId) {
                    setIsAuthor(true);
                } else {
                    setIsAuthor(false);
                }
            })
            .catch(error => console.log(error));
    }, [id]); // Depend on `id` to refetch when `id` changes


    const showDeleteContainer = () => {
        setDeleted(true)
    }
    const hideDeleteContainer = () => {
        setDeleted(false)
    }
    
    const deletePost = () => {
        fetch(`${zeraServer}/posts/delete-post/${id}`, {
            method: 'DELETE',
            credentials: 'include', // Include credentials to ensure cookies are sent
        })
            .then(res => res.json())
            .then(data => {
                    toast.success(`${data.message}`);
                    setTimeout(() => {
                        navigate("/")
                    }, 2000)
            })
            .catch(error => {
                console.log(error)
                toast.error(`${error}`)
            })
    }
    if (!post || !post.createdAt) {
        return <h1>Loading...</h1>;
    }

    const formattedDate = () => {
        try {
            const date = new Date(post.createdAt);
            if (isNaN(date.getTime())) {
                throw new Error('Invalid date');
            }
            return format(date, "MMM d, yyyy     k:m  bbb");
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid date';
        }
    };

    return (
        <div className="post-container">
            <ToastContainer />
            <h1 className="post-title">{post.title}</h1>
            <div className='time-author'>
                <p>{formattedDate()}</p>
                <p className='author'>@ {post.author?.name}</p>
            </div>
            <div className='edit-delete-buttons'>
            {isAuthor && <button className='delete-button' onClick={showDeleteContainer}><MdDelete /> Delete Post</button>}
            <Link to={`/edit-post/${post._id}`}>{isAuthor && <button><MdEdit /> Edit Post</button>}</Link>
            </div>
            <div className='image-box'>
                <img className="post-image" src={`${zeraServer}/${post.image}`} alt="Placeholder" />
            </div>
            <div dangerouslySetInnerHTML={{ __html: post.fullText }} className='full-Text'/>
            {
            deleted &&             
                    <div className='delete-ok'>
                        <p>Are you sure You want to Delete this Post? </p>
                        <button className='yes' onClick={deletePost}>Yes </button>
                        <button className='no' onClick={hideDeleteContainer}>No </button>
                    </div>
            }
        </div>
    );
}
