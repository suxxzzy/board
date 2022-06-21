import axios from 'axios';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import styled from 'styled-components';

const Container = styled.section`
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
    #attachmentfiles {
        border: 1px solid gray;
        padding: 1rem 0rem;
        #find {
            background-color: gray;
            color: white;
        }
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
    const [preview, setPreview] = useState('');
    const [singleFile, setSingleFile] = useState(null);
    const [attachmentfiles, setAttachmentFiles] = useState([]);

    const handleChangeTitle = (e) => {
        setTitle(e.target.value);
    };

    const handleChangeContent = (e) => {
        setContent(e.target.value);
    };

    const goBack = () => {
        navigate(-1);
    };

    //파일 첨부시 업로드 할 수 있는 url서버에 요청
    //=> 성공시 s3 url에 즉시 업로드
    const handleUploadFile = (e) => {
        console.log('파일 업로드 실행됨');
        //인풋창에 파일명.확장자 띄우기
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        console.log('e.target.files[0] : ', e.target.files[0]);
        reader.onload = () => {
            console.log('reader', reader);
            setPreview(e.target.files[0].name);
        };

        //서버로 보낼 파일 준비
        setSingleFile(e.target.files[0]);

        let formData = new FormData();
        formData.append('file', singleFile);

        //서버에 presignedurl 요청
        axios
            .get(
                `${process.env.REACT_APP_API_URL}/board/presignedurl?filename=${e.target.files[0].name}`,
            )
            .then((res) => {
                console.log(res.data.data.signedUrl);
                const presignedurl = res.data.data.signedUrl;
                //presignedurl로 put 요청을 보낸다. 즉, 업로드를 한다.
                axios.put(presignedurl, { body: singleFile }).then((res) => {
                    //파일 업로드 성공. 파일의 주소를 반환받아야 한다.
                    console.log(res, '응답..');
                    setAttachmentFiles([
                        ...attachmentfiles,
                        {
                            FILENAME: e.target.files[0].name.split('.')[0],
                            EXT: e.target.files[0].name.split('.')[1],
                            FILEPATH: '',
                            SIZE: e.target.files[0].size,
                        },
                    ]);
                });
            });
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
                {
                    title,
                    content,
                    attachmentfiles:
                        attachmentfiles.length === 0
                            ? undefined
                            : attachmentfiles,
                },
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
                    <section id="attachmentfiles">
                        <label htmlFor="file">첨부파일</label>
                        <input
                            type="text"
                            id="file"
                            value={preview}
                            readOnly="true"
                        ></input>
                        <input
                            type="file"
                            id="fileupload"
                            style={{ display: 'none' }}
                            onChange={handleUploadFile}
                        ></input>
                        <label htmlFor="fileupload" id="find">
                            찾아보기
                        </label>
                        {/*첨부한 파일 목록 미리 띄우기*/}
                        <ul>
                            {attachmentfiles.map((attachmentfile, idx) => {
                                return (
                                    <a key={idx} href={attachmentfile.FILEPATH}>
                                        <li>{`${attachmentfile.FILENAME}.${attachmentfile.EXT}`}</li>
                                        <span onClick={handleDelete}>X</span>
                                    </a>
                                );
                            })}
                        </ul>
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
