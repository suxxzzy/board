import axios from 'axios';
import { useState } from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.section`
    border: 1px solid red;
    display: flex;
    flex-direction: column;
    padding: 3rem;
    > label {
        font-weight: bold;
    }
    #title {
        width: 90%;
        height: 30px;
    }
    #content {
        width: 90%;
        height: 300px;
        display: flex;
        resize: none;
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

function Modify() {
    const location = useLocation();
    const navigate = useNavigate();
    //수정 전 내용 받아와 저장
    const [title, setTitle] = useState(location.state.post.title);
    const [content, setContent] = useState(location.state.post.content);

    const handleChangeTitle = (e) => {
        setTitle(e.target.value);
    };

    const handleChangeContent = (e) => {
        setContent(e.target.value);
    };

    //수정 요청
    const handleModify = () => {
        axios
            .patch(
                `${process.env.REACT_APP_API_URL}/board/${location.state.post.id}`,
                { title, content },
                { withCredentials: true },
            )
            .then((res) => {
                alert('수정되었습니다');
                navigate(`/board/${location.state.post.id}`, {
                    state: {
                        postID: location.state.post.id,
                    },
                });
            });
    };

    //수정 취소
    const goBack = () => {
        navigate(-1);
    };

    return (
        <>
            {!window.localStorage.getItem('userID') ? (
                <Navigate replace to="/" />
            ) : (
                <Container>
                    <h2>게시글 수정</h2>
                    <label htmlFor="title">제목</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={handleChangeTitle}
                    ></input>
                    <label htmlFor="content">내용</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={handleChangeContent}
                    ></textarea>
                    <section>
                        <label>첨부파일</label>
                        <input type="file"></input>
                    </section>
                    <section id="button">
                        <button onClick={goBack}>수정취소</button>
                        <button onClick={handleModify}>수정완료</button>
                    </section>
                </Container>
            )}
        </>
    );
}

export default Modify;
