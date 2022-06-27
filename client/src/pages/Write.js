import styled from 'styled-components';
import axios from 'axios';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { fileSizeConverter } from '../modules/fileSizeConverter';
import { getPresignedUrl } from '../modules/getPresignedUrl';

function Write() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [preview, setPreview] = useState('');
    const [attachmentfiles, setAttachmentfiles] = useState([]); //s3에 올라갈 파일 그 자체

    const handleChangeTitle = (e) => {
        setTitle(e.target.value);
    };

    const handleChangeContent = (e) => {
        setContent(e.target.value);
    };

    //작성 취소
    const goBack = () => {
        navigate(-1);
    };

    //화면상에 렌더링하고, 바로 s3에 올리지는 않는다.
    const handleUploadFile = (e) => {
        //console.log(e.target.files[0].name, '파일정보');

        //첨부 개수 제한
        if (attachmentfiles.length + 1 > 5) {
            alert('최대 5개까지만 첨부 가능합니다');
            setAttachmentfiles(attachmentfiles.slice(0, 5));
            return;
        }
        //용량은 1개당 최대 50mb까지만 허용하기
        if (e.target.files[0].size > 50 * 1048576) {
            alert('1개당 최대 50mb까지만 첨부가능합니다');
            setPreview('');
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);

        //파일명 미리보기 띄우기
        reader.onload = () => {
            setPreview(e.target.files[0].name);
            //같은 파일도 올릴 수 있도록.
            e.target.value = '';
        };

        //업로드할 파일 목록 업데이트하기
        setAttachmentfiles([...attachmentfiles, e.target.files[0]]);
    };

    //업로드한 파일 삭제:  어짜피 s3에 안 올렸으니까, 그냥 배열에서만 삭제하면 된다.
    const handleDeleteFile = (idx) => {
        //만약 1개 남은 상태서 삭제시
        if (attachmentfiles.length === 1) {
            setPreview('');
        }

        setAttachmentfiles(
            attachmentfiles.filter((_, fileidx) => fileidx !== idx),
        );
    };

    //게시물 등록
    const handlePost = async () => {
        if (!title || !content) {
            alert('제목과 내용 모두 입력해주세요');
            return;
        }
        //첨부파일이 빈 배열인 경우 바로 axios 요청 보낸다.
        if (attachmentfiles.length === 0) {
            //서버에 axios 요청 보내기
            return axios
                .post(
                    `${process.env.REACT_APP_API_URL}/board`,
                    {
                        title,
                        content,
                        attachmentfiles: [], //첨부파일이 존재하지 않을 경우 빈 배열로 전달됨
                    },
                    { withCredentials: true },
                )
                .then((res) => {
                    //새로 생성된 게시글 페이지로 이동
                    alert('등록되었습니다');
                    navigate(`/board/${res.data.data.No}`, {
                        state: {
                            No: res.data.data.No,
                            BID: res.data.data.BID,
                        },
                    });
                });
        }

        Promise.all(getPresignedUrl(attachmentfiles)).then((fileInfo) => {
            //s3에 파일이 정상적으로 업로드되었다면 DB에 파일 정보를 저장하면 된다.
            //서버에 axios 요청 보내기
            axios
                .post(
                    `${process.env.REACT_APP_API_URL}/board`,
                    {
                        title,
                        content,
                        attachmentfiles: fileInfo,
                    },
                    { withCredentials: true },
                )
                .then((res) => {
                    alert('등록되었습니다');
                    navigate(`/board/${res.data.data.No}`, {
                        state: {
                            No: res.data.data.No,
                            BID: res.data.data.BID,
                        },
                    });
                });
        });
    };

    return (
        <>
            {!window.localStorage.getItem('userID') ? (
                <Navigate replace to="/" />
            ) : (
                <Layout>
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
                            readOnly={true}
                            placeholder="개당 최대 50mb, 최대 5개까지 첨부가능"
                        ></input>
                        <input
                            type="file"
                            id="fileupload"
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
                                        <div>{`${
                                            attachmentfile.name
                                        } [${fileSizeConverter(
                                            attachmentfile.size,
                                        )}mb]`}</div>
                                        <button
                                            onClick={() =>
                                                handleDeleteFile(idx)
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
                        <button onClick={goBack}>작성취소</button>
                        <button onClick={handlePost}>작성완료</button>
                    </section>
                </Layout>
            )}
        </>
    );
}

const Layout = styled.section`
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
        #file {
            border: 1px solid gray;
            background-color: aliceblue;
            width: 300px;
            height: 30px;
            &:focus {
                outline: none;
            }
        }
        #fileupload {
            display: none;
        }
        #find {
            background-color: gray;
            color: white;
            height: 30px;
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

export default Write;
