import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Post from './Post';

function PostList({ list = [] }) {
    const navigate = useNavigate();
    const [postID, setPostID] = useState(0);
    const [isNavigate, setIsNavigate] = useState(false);

    const handlePostDetail = (id) => {
        setPostID(id);
        setIsNavigate(true);
    };

    useEffect(() => {
        if (isNavigate) {
            navigate(`/board/${postID}`, {
                state: {
                    postID: postID,
                },
            });
            setIsNavigate(false);
        }
    }, [isNavigate]);

    return list.length === 0 ? (
        <div>게시물이 없습니다</div>
    ) : (
        list.map((post, idx) => {
            return (
                <Post
                    onClick={() => handlePostDetail(post.BID)}
                    key={post.BID}
                    no={idx + 1}
                    title={post.TITLE}
                    author={post.UID_user.USERID}
                    createdAt={post.CRTIME}
                    viewCount={post.VIEWCOUNT}
                />
            );
        })
    );
}

export default PostList;
