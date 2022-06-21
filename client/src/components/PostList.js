import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Post from './Post';

function PostList({ list = [], handleCheckChange, checkedPosts }) {
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
                    handleCheckChange={handleCheckChange}
                    checkedPosts={checkedPosts}
                    onClick={() => handlePostDetail(post.BID)}
                    key={post.BID}
                    bid={Number(post.BID)}
                    uid={Number(post.UID)}
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
