import { format } from 'date-fns';
import {Link} from 'react-router-dom';
import { MdEdit} from 'react-icons/md';
export default function Post(props){
    const {author} = props;
    const userName = author ? author.name.split(" ")[0] + " " + author.name.split(" ")[1] : '';
    return(
        <Link to={`/post/${props._id}`}>
      <div>
        <div className="posted-blog">
            <h2 className="author"> <MdEdit />{userName}</h2>
            <div className="blog">
                    <div className="blog-image">
                        <img src={`https://blog-one-sandy-79.vercel.app/${props.image}`} alt="blog" height='100' width='100'/>
                    </div>
                    <div className="blog-text">
                        <h3><span>{props.title}</span></h3>
                        <p className="date">{format(new Date(props.createdAt), "MMM d, yyyy     k:m  bbb")}</p>
                        <p className="summary">{props.summary}</p>
                    </div>
                </div>
            </div>
        </div>
        </Link>
    )
}