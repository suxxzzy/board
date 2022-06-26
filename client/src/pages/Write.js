import styled from 'styled-components';
import axios from 'axios';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

function Write() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [preview, setPreview] = useState('');
    const [tempAttachmentfiles, setTempAttachmentfiles] = useState([]); //s3에 올라갈 파일 그 자체
    const [attachmentfiles, setAttachmentfiles] = useState([]); //실질적으로 db에 올릴 파일정보

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
        //첨부 개수 제한
        if (tempAttachmentfiles.length + 1 > 5) {
            alert('최대 5개까지만 첨부 가능합니다');
            setTempAttachmentfiles(tempAttachmentfiles.slice(0, 5));
            return;
        }
        //파일은 최대 5개까지만 첨부가능하고, 용량은 1개당 최대 50mb까지만 허용하기
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
        };

        //업로드할 파일 목록 업데이트하기
        setTempAttachmentfiles([...tempAttachmentfiles, e.target.files[0]]);
    };

    //업로드한 파일 삭제:  어짜피 s3에 안 올렸으니까, 그냥 배열에서만 삭제하면 된다.
    const handleDeleteFile = (idx) => {
        //만약 1개 남은 상태서 삭제시
        if (tempAttachmentfiles.length === 1) {
            setPreview('');
        }

        setTempAttachmentfiles(
            tempAttachmentfiles.filter((_, fileidx) => fileidx !== idx),
        );
    };

    //게시물 등록
    const handlePost = async () => {
        if (!title || !content || attachmentfiles === undefined) {
            alert('제목과 내용 모두 입력해주세요');
            return;
        }
        //첨부파일이 빈 배열인 경우 바로 axios 요청 보낸다.
        if (tempAttachmentfiles.length === 0) {
            //서버에 axios 요청 보내기
            return axios
                .post(
                    `${process.env.REACT_APP_API_URL}/board`,
                    {
                        title,
                        content,
                        attachmentfiles, //첨부파일이 존재하지 않을 경우 빈 배열로 전달됨
                    },
                    { withCredentials: true },
                )
                .then((res) => {
                    //새로 생성된 게시글 페이지로 이동.....새로 생성한 게시물의 개수===화면에서 보일 no.는 어떻게 알아내지? 백엔드에서 계산해줘야함
                    alert('등록되었습니다');
                    navigate(`/board/${res.data.data.No}`, {
                        state: {
                            No: res.data.data.No,
                            BID: res.data.data.BID,
                        },
                    });
                });
        }
        //첨부파일이 빈 배열이 아닌 경우
        //s3에 파일을 업로드한다.
        const filePromise = [];
        for (let i = 0; i < tempAttachmentfiles.length; i++) {
            //업로드를 위한 presignedurl 요청
            const uploadPromise = axios
                .get(
                    `${process.env.REACT_APP_API_URL}/attachmentfile/presignedurl?filename=${tempAttachmentfiles[i].name}`,
                    { withCredentials: true },
                )
                .then(async (res) => {
                    //첨부파일 업로드
                    const presignedurl = res.data.data.signedUrl;

                    const res_1 = await axios.put(
                        presignedurl,
                        tempAttachmentfiles[i],
                        {
                            headers: {
                                'Content-Type': tempAttachmentfiles[i].type,
                            },
                        },
                    );
                    //버킷의 키 알아내기
                    const key = `${
                        res_1.config.url.split('/')[3].split('-')[0]
                    }-${tempAttachmentfiles[i].name}`;
                    return {
                        FILENAME: tempAttachmentfiles[i].name.split('.')[0],
                        EXT: tempAttachmentfiles[i].name.split('.')[1],
                        FILEPATH: key,
                        SIZE: tempAttachmentfiles[i].size,
                    };
                });
            filePromise.push(uploadPromise);
        }

        Promise.all(filePromise).then((res) => {
            //s3에 파일이 정상적으로 업로드되었다면 DB에 파일 정보를 저장하면 된다.
            //서버에 axios 요청 보내기
            axios
                .post(
                    `${process.env.REACT_APP_API_URL}/board`,
                    {
                        title,
                        content,
                        attachmentfiles: res,
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
                            style={{ display: 'none' }}
                            onChange={handleUploadFile}
                        ></input>
                        <label htmlFor="fileupload" id="find">
                            찾아보기
                        </label>
                        {/*첨부한 파일 목록 미리 띄우기*/}
                        <ul>
                            {tempAttachmentfiles.map((attachmentfile, idx) => {
                                return (
                                    <li key={idx}>
                                        <div>{attachmentfile.name}</div>
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
