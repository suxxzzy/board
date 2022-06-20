import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

function Write() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const goBack = () => {
        navigate(-1);
    };

    //제목, 내용, 작성 시각, 첨부파일(여러개 일 수 있음)
    const handlePost = () => {};

    return (
        <Container>
            <h2>게시글 등록</h2>
            <label htmlFor="title">제목</label>
            <input
                id="title"
                type="text"
                placeholder="제목을 입력해주세요"
            ></input>
            <label htmlFor="content">내용</label>
            <textarea id="content" placeholder="내용을 입력해주세요"></textarea>
            <section>
                <label>첨부파일</label>
                <input type="file"></input>
            </section>
            <section id="button">
                <button onClick={goBack}>작성취소</button>
                <button onClick={handlePost}>작성완료</button>
            </section>
        </Container>
    );
}

export default Write;
