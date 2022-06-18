import Post from './Post';

function PostList({ list = [] }) {
    if (list.length === 0) {
        return <div>목록이 없습니다</div>;
    }
    return list.map((post, idx) => {
        return (
            <Post
                key={post.BID}
                no={idx}
                title={post.TITLE}
                author={post.UID_user.USERID}
                createdAt={post.CRTIME}
                viewCount={post.VIEWCOUNT}
            />
        );
    });
}

export default PostList;
