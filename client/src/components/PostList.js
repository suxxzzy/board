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
    const [No, setNo] = useState(0);
    const [BID, setBID] = useState(0);
    const [isNavigate, setIsNavigate] = useState(false);

    const handlePostDetail = (No, BID) => {
        setNo(No);
        setBID(BID);
        setIsNavigate(true);
    };

    useEffect(() => {
        if (isNavigate) {
            navigate(`/board/${No}`, {
                state: {
                    No,
                    BID,
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
                    onClick={() =>
                        handlePostDetail(
                            totalPosts - 10 * (currentPage - 1) - idx,
                            post.BID,
                        )
                    }
                    No={totalPosts - 10 * (currentPage - 1) - idx}
                    BID={post.BID}
                    UID={post.UID}
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
