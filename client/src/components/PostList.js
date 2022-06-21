import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Post from './Post';

function PostList({
    totalPosts,
    currentPage,
    list = [],
    handleCheckChange,
    checkedPosts,
}) {
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
                    key={post.BID}
                    handleCheckChange={handleCheckChange}
                    checkedPosts={checkedPosts}
                    onClick={() => handlePostDetail(post.BID)}
                    No={totalPosts - 10 * (currentPage - 1) - idx}
                    BID={post.BID}
                    UID={Number(post.UID)}
                    TITLE={post.TITLE}
                    USERID={post.UID_user.USERID}
                    CRTIME={post.CRTIME}
                    VIEWCOUNT={post.VIEWCOUNT}
                />
            );
        })
    );
}

export default PostList;
