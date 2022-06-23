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
    console.log(location.state, '수정 전 내용');
    const navigate = useNavigate();
    //수정 전 내용 받아와 저장
    const [title, setTitle] = useState(location.state.board.TITLE);
    const [content, setContent] = useState(location.state.board.CONTENT);
    const [preview, setPreview] = useState('');
    const [attachmentfiles, setAttachmentFiles] = useState(
        location.state.board.ATTACHMENTFILES,
    );

    const handleChangeTitle = (e) => {
        setTitle(e.target.value);
    };

    const handleChangeContent = (e) => {
        setContent(e.target.value);
    };

    const handleUploadFile = (e) => {
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);

        //파일명 미리보기 띄우기
        reader.onload = () => {
            setPreview(e.target.files[0].name);
        };

        let formData = new FormData();
        formData.append('Content-Type', e.target.files[0].type);
        formData.append('file', e.target.files[0]);

        console.log('파일 형식', e.target.files[0].type);

        //업로드를 위한 presignedurl 요청
        axios
            .get(
                `${process.env.REACT_APP_API_URL}/attachmentfile/presignedurl/?filename=${e.target.files[0].name}`,
                { withCredentials: true },
            )
            .then((res) => {
                //첨부파일 업로드
                const presignedurl = res.data.data.signedUrl;

                axios
                    .put(presignedurl, formData, {
                        headers: {
                            'Content-Type': e.target.files[0].type,
                        },
                    })
                    .then((res) => {
                        //버킷의 키 알아내기
                        const key = `${
                            res.config.url.split('/')[3].split('-')[0]
                        }-${e.target.files[0].name}`;

                        //파일 업로드 성공. 파일의 주소를 반환받아야 한다.
                        setAttachmentFiles([
                            ...attachmentfiles,
                            {
                                FILENAME: e.target.files[0].name.split('.')[0],
                                EXT: e.target.files[0].name.split('.')[1],
                                FILEPATH: `${process.env.REACT_APP_S3_BUCKET_URL}/${key}`,
                                SIZE: e.target.files[0].size,
                                KEY: key,
                            },
                        ]);
                    });
            });
    };

    //업로드한 파일 삭제(버킷에 있는 파일 삭제 요청)
    const handleDeleteFile = (key) => {
        console.log('삭제요청');
        axios
            .delete(
                `${process.env.REACT_APP_API_URL}/attachmentfile?filename=${key}`,
                {
                    withCredentials: true,
                },
            )
            .then((res) => {
                alert('삭제완료');

                setAttachmentFiles(
                    attachmentfiles.filter(
                        (file) => file.FILEPATH.split('/')[3] !== key,
                    ),
                );
            });
    };

    //게시물 수정
    const handleModify = () => {
        console.log(location.state, '상태값');
        axios
            .patch(
                `${process.env.REACT_APP_API_URL}/board/${location.state.board.BID}`,
                { title, content, attachmentfiles },
                { withCredentials: true },
            )
            .then((res) => {
                alert('수정되었습니다');
                navigate(`/board/${location.state.No}`, {
                    state: {
                        No: location.state.board.No,
                        BID: location.state.board.BID,
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
                    <section id="attachmentfiles">
                        <label htmlFor="file">첨부파일</label>
                        <input
                            type="text"
                            id="file"
                            value={preview}
                            readOnly={true}
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
                                    <li key={idx}>
                                        <a
                                            href={attachmentfile.FILEPATH}
                                        >{`${attachmentfile.FILENAME}.${attachmentfile.EXT}`}</a>
                                        <button
                                            onClick={() =>
                                                handleDeleteFile(
                                                    attachmentfile.FILEPATH.split(
                                                        '/',
                                                    )[3],
                                                )
                                            }
                                        >
                                            삭제
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
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
