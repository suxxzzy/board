import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { timeConverter_Post } from '../modules/datetimeconverter';

const Container = styled.section`
    border: 1px solid red;
    display: flex;
    flex-direction: column;
    height: 90%;
    padding: 3rem;
    > label {
        font-weight: bold;
    }
    #title {
        width: 90%;
        border-bottom: 1px solid black;
        display: flex;
        flex-direction: column;
    }
    #content {
        border-bottom: 1px solid black;
        width: 90%;
        height: 400px;
        padding: 1rem 0rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    #button {
        display: flex;
        justify-content: center;
    }
    > section {
        width: 90%;
        display: flex;
        > label {
            font-weight: bold;
        }
    }
`;

function Post() {
    const location = useLocation();
    const navigate = useNavigate();
    const [post, setPost] = useState({
        id: 0,
        title: '',
        userpk: '',
        userid: '',
        crtime: '',
        content: '',
        attachmentFiles: [],
    });

    useEffect(() => {
        getPost();
    }, []);

    const getPost = () => {
        axios
            .get(
                `${process.env.REACT_APP_API_URL}/board/${location.state.postID}`,
                {
                    withCredentials: true,
                },
            )
            .then((res) => {
                console.log(res.data.data, '게시물 상세 정보');
                setPost({
                    ...post,
                    id: res.data.data.post.BID,
                    title: res.data.data.post.TITLE,
                    userpk: res.data.data.post.UID,
                    userid: res.data.data.post.UID_user.USERID,
                    crtime: timeConverter_Post(res.data.data.post.CRTIME),
                    content: res.data.data.post.CONTENT,
                    attachmentFiles: res.data.data.post.attachmentfiles,
                });
            });
    };

    const goToBoard = () => {
        navigate('/board');
    };

    const handleModify = () => {
        if (!window.localStorage.getItem('userID')) {
            alert('로그인이 필요합니다');
            return;
        }
        navigate(`/board/${post.id}/modify`, {
            state: {
                post,
            },
        });
    };

    const handleDelete = () => {
        console.log('삭제요청');
        if (!window.localStorage.getItem('userID')) {
            alert('로그인이 필요합니다');
            return;
        }
        //이후 삭제 요청.(페이지 번호 받아서 서버에 요청. 페이지 번호는 배열에 담는다)
        axios
            .patch(
                `${process.env.REACT_APP_API_URL}/board`,
                { deletes: [{ UID: post.userpk, BID: post.id }] },
                {
                    withCredentials: true,
                },
            )
            .then((res) => {
                alert('삭제되었습니다');
                navigate('/board');
            })
            .catch((error) => {
                if (error.response) {
                    const { data } = error.response;
                    alert(data.message);
                }
            });
    };

    return (
        <Container>
            <h2>게시판</h2>
            <section id="title">
                <h3>{post.title}</h3>
                <div>{post.userid}</div>
                <div>{post.crtime}</div>
            </section>
            <section id="content">
                <article>{post.content}</article>
                <section>
                    <div>첨부파일</div>
                    {post.attachmentFiles.map((file, idx) => {
                        return (
                            <a
                                key={idx}
                                href={file.FILEPATH}
                            >{`${file.FILENAME}.${file.EXT}`}</a>
                        );
                    })}
                </section>
            </section>
            <section>
                <button onClick={goToBoard}>목록</button>
                {Number(window.localStorage.getItem('userID')) ===
                post.userpk ? (
                    <>
                        <button onClick={handleModify}>수정</button>
                        <button onClick={handleDelete}>삭제</button>
                    </>
                ) : null}
            </section>
        </Container>
    );
}

export default Post;
