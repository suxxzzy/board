import axios from 'axios';
import { useState } from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
//import * as fs from 'fs/promises';

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

    console.log(
        location.state.board.ATTACHMENTFILES,
        '<Modify>의 초기 첨부파일 상태',
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
                    .put(presignedurl, e.target.files[0], {
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
                                FILEPATH: key,
                                SIZE: e.target.files[0].size,
                            },
                        ]);
                    });
            });
    };

    //업로드한 파일 삭제(버킷에 있는 파일 삭제 요청): 수정 취소할 경우를 대비해서, 렌더링만 처리한다. :
    const handleDeleteFile = (Key) => {
        console.log('삭제요청');
        const deletes = [{ Key }];
        axios
            .post(
                `${process.env.REACT_APP_API_URL}/attachmentfile`,
                { deletes },
                {
                    withCredentials: true,
                },
            )
            .then((res) => {
                alert('삭제완료');

                setAttachmentFiles(
                    attachmentfiles.filter((file) => file.FILEPATH !== Key),
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
                navigate(`/board/${location.state.board.No}`, {
                    state: {
                        No: location.state.board.No,
                        BID: location.state.board.BID,
                    },
                });
            });
    };

    //수정 취소
    const goBack = () => {
        //수정 페이지 열고 첨부했던 파일들은 s3상에서 삭제해야 한다.
        //새롭게 추가한 첨부파일들의 key를 추출한다
        //첨부파일을 수정하지 않은 경우
        //파일을 추가한 경우
        //파일을 삭제한 경우 원복....
        const deletes = [];
        axios
            .post(
                `${process.env.REACT_APP_API_URL}/attachmentfile`,
                { deletes },
                {
                    withCredentials: true,
                },
            )
            .then((res) => {
                console.log('삭제됨');
                navigate(-1);
            });
    };
    console.log(attachmentfiles, '첨부파일 목록');
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
                                            href={`${process.env.REACT_APP_API_URL}/attachmentfile/object?key=${attachmentfile.FILEPATH}`}
                                            download={`${attachmentfile.FILENAME}.${attachmentfile.EXT}`}
                                        >{`${attachmentfile.FILENAME}.${attachmentfile.EXT}`}</a>
                                        <button
                                            onClick={() =>
                                                handleDeleteFile(
                                                    attachmentfile.FILEPATH,
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
