import axios from 'axios';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

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

//localstorage가 있을 경우에만 페이지 접근 가능케끔 한다
function Write() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleChangeTitle = (e) => {
        setTitle(e.target.value);
    };

    const handleChangeContent = (e) => {
        setContent(e.target.value);
    };

    const goBack = () => {
        navigate(-1);
    };

    //제목, 내용, 작성 시각, 첨부파일(여러개 일 수 있음)
    const handlePost = () => {
        //첨부파일 없을 수도 있음
        //단 제목과 내용은 입력 필수
        if (!title || !content) {
            alert('제목과 내용 모두 입력해주세요');
        }

        //서버에 axios 요청 보내기
        axios
            .post(
                `${process.env.REACT_APP_API_URL}/board`,
                { title, content },
                { withCredentials: true },
            ) //
            .then((res) => {
                //게시글 등록 성공
                //새로 생성된 게시글 페이지로 이동한다.
                navigate('/board');
            });
    };

    return (
        <>
            {!window.localStorage.getItem('userID') ? (
                <Navigate replace to="/" />
            ) : (
                <Container>
                    <h2>게시글 등록</h2>
                    <label htmlFor="title">제목</label>
                    <input
                        id="title"
                        type="text"
                        placeholder="제목을 입력해주세요"
                        value={title}
                        onChange={handleChangeTitle}
                    ></input>
                    <label htmlFor="content">내용</label>
                    <textarea
                        id="content"
                        placeholder="내용을 입력해주세요"
                        value={content}
                        onChange={handleChangeContent}
                    ></textarea>
                    <section>
                        <label>첨부파일</label>
                        <input type="file"></input>
                    </section>
                    <section id="button">
                        <button onClick={goBack}>작성취소</button>
                        <button onClick={handlePost}>작성완료</button>
                    </section>
                </Container>
            )}
        </>
    );
}

export default Write;
