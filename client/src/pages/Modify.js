import styled from 'styled-components';
import axios from 'axios';
import { useState } from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';

function Modify() {
    const location = useLocation();
    const navigate = useNavigate();
    //수정 전 내용 받아와 저장
    const [title, setTitle] = useState(location.state.board.TITLE);
    const [content, setContent] = useState(location.state.board.CONTENT);
    const [preview, setPreview] = useState('');
    //s3에도 이미 등록되어 있는 첨부파일의 정보
    const [s3attachedfiles, sets3Attachedfiles] = useState(
        location.state.board.ATTACHMENTFILES,
    );
    //수정 페이지 접속 후 파일을 임시로 담을 상태값
    const [newAttachmentfiles, setNewAttachmentfiles] = useState([]); //s3에 올라갈 파일 그 자체

    const handleChangeTitle = (e) => {
        setTitle(e.target.value);
    };

    const handleChangeContent = (e) => {
        setContent(e.target.value);
    };

    //수정페이지 접속 후 파일 업로드
    const handleUploadFile = (e) => {
        const filenames = newAttachmentfiles.map((el) => el.name);
        const s3Filenames = s3attachedfiles.map((el) => el.NAME);
        //중복 첨부 제외
        if (
            filenames.includes(e.target.files[0].name) ||
            s3Filenames.includes(e.target.files[0].name)
        ) {
            alert('이미 첨부한 파일입니다');
            return;
        }
        //첨부 개수 제한
        if (newAttachmentfiles.length + s3attachedfiles.length + 1 > 5) {
            alert('최대 5개까지만 첨부 가능합니다');
            setNewAttachmentfiles(
                newAttachmentfiles.slice(0, newAttachmentfiles.length),
            );
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
        setNewAttachmentfiles([...newAttachmentfiles, e.target.files[0]]);
    };

    //수정페이지 접속 후 올린 파일을 삭제
    //(s3에 있는거나, 수정페이지 접속 후 올린걸 삭제하는 거나 똑같이 화면에서만 안보이게 하기)
    const handleDeleteNewFile = (idx) => {
        setNewAttachmentfiles(
            newAttachmentfiles.filter((_, fileidx) => fileidx !== idx),
        );
    };

    //수정 전 업로드한 파일 삭제
    //수정 취소할 경우를 대비해서, 렌더링만 처리한다
    const handleDeleteFileOnS3 = (idx) => {
        sets3Attachedfiles(
            s3attachedfiles.filter((_, fileidx) => fileidx !== idx),
        );
    };

    //게시물 수정완료
    const handleModify = async () => {
        if (!title || !content) {
            alert('제목과 내용 모두 입력해주세요');
            return;
        }

        //기존 파일의 키들
        const keys = location.state.board.ATTACHMENTFILES.map(
            (attachmentfile) => attachmentfile.FILEPATH,
        );

        //화면에서 보이는 기존 파일
        const s3filePath = s3attachedfiles.map((file) => file.FILEPATH);

        //기존의 파일에서 삭제한 내역 구하기
        const deletes = keys
            .filter((Key) => !s3filePath.includes(Key))
            .map((Key) => {
                return { Key };
            });

        //삭제할 파일이 존재하지 않는 경우
        if (deletes.length === 0) {
            //업로드할 파일이 존재하지 않는 경우
            if (newAttachmentfiles.length === 0) {
                return axios
                    .patch(
                        `${process.env.REACT_APP_API_URL}/board/${location.state.board.BID}`,
                        { title, content, attachmentfiles: [] },
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
            } else {
                //업로드할 파일이 존재하는 경우
                //S3에 파일 올리고 정보 받아온다음 디비에 저장
                const filePromise = [];
                for (let i = 0; i < newAttachmentfiles.length; i++) {
                    //업로드를 위한 presignedurl 요청
                    const uploadPromise = axios
                        .get(
                            `${process.env.REACT_APP_API_URL}/attachmentfile/presignedurl?filename=${newAttachmentfiles[i].name}`,
                            { withCredentials: true },
                        )
                        .then(async (res) => {
                            //첨부파일 업로드
                            const presignedurl = res.data.data.signedUrl;

                            const res_1 = await axios.put(
                                presignedurl,
                                newAttachmentfiles[i],
                                {
                                    headers: {
                                        'Content-Type':
                                            newAttachmentfiles[i].type,
                                    },
                                },
                            );
                            //버킷의 키 알아내기
                            const key = `${
                                res_1.config.url.split('/')[3].split('-')[0]
                            }-${newAttachmentfiles[i].name}`;
                            return {
                                FILENAME:
                                    newAttachmentfiles[i].name.split('.')[0],
                                EXT: newAttachmentfiles[i].name.split('.')[1],
                                FILEPATH: key,
                                SIZE: newAttachmentfiles[i].size,
                            };
                        });
                    filePromise.push(uploadPromise);
                }

                Promise.all(filePromise).then((res) => {
                    console.log(res, '결과값');
                    axios
                        .patch(
                            `${process.env.REACT_APP_API_URL}/board/${location.state.board.BID}`,
                            {
                                title,
                                content,
                                attachmentfiles: res,
                            },
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
                });
            }
        } else {
            //s3에 삭제할 파일이 존재하는 경우
            await axios.post(
                `${process.env.REACT_APP_API_URL}/attachmentfile`,
                {
                    deletes,
                },
                { withCredentials: true },
            );
            //업로드할 파일이 존재하지 않는 경우
            if (newAttachmentfiles.length === 0) {
                return axios
                    .patch(
                        `${process.env.REACT_APP_API_URL}/board/${location.state.board.BID}`,
                        { title, content, attachmentfiles: [] },
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
            } else {
                const filePromise = [];
                for (let i = 0; i < newAttachmentfiles.length; i++) {
                    //업로드를 위한 presignedurl 요청
                    const uploadPromise = axios
                        .get(
                            `${process.env.REACT_APP_API_URL}/attachmentfile/presignedurl?filename=${newAttachmentfiles[i].name}`,
                            { withCredentials: true },
                        )
                        .then(async (res) => {
                            //첨부파일 업로드
                            const presignedurl = res.data.data.signedUrl;

                            const res_1 = await axios.put(
                                presignedurl,
                                newAttachmentfiles[i],
                                {
                                    headers: {
                                        'Content-Type':
                                            newAttachmentfiles[i].type,
                                    },
                                },
                            );
                            //버킷의 키 알아내기
                            const key = `${
                                res_1.config.url.split('/')[3].split('-')[0]
                            }-${newAttachmentfiles[i].name}`;
                            return {
                                FILENAME:
                                    newAttachmentfiles[i].name.split('.')[0],
                                EXT: newAttachmentfiles[i].name.split('.')[1],
                                FILEPATH: key,
                                SIZE: newAttachmentfiles[i].size,
                            };
                        });
                    filePromise.push(uploadPromise);
                }

                Promise.all(filePromise).then((res) => {
                    axios
                        .patch(
                            `${process.env.REACT_APP_API_URL}/board/${location.state.board.BID}`,
                            {
                                title,
                                content,
                                attachmentfiles: res,
                            },
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
                });
            }
        }
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
                <Layout>
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
                        <ul>
                            {/*기존에 있었던 파일 목록*/}
                            {s3attachedfiles.map((attachmentfile, idx) => {
                                return (
                                    <li key={idx}>
                                        <div>{`${attachmentfile.FILENAME}.${attachmentfile.EXT}`}</div>
                                        <button
                                            onClick={() =>
                                                handleDeleteFileOnS3(idx)
                                            }
                                        >
                                            삭제
                                        </button>
                                    </li>
                                );
                            })}
                            {/*수정 페이지 접속 후 새로 등록한 파일 보여주기*/}
                            {newAttachmentfiles.map(
                                (tempAttachmentfile, idx) => {
                                    return (
                                        <li key={idx}>
                                            <div>{tempAttachmentfile.name}</div>
                                            <button
                                                onClick={() =>
                                                    handleDeleteNewFile(idx)
                                                }
                                            >
                                                삭제
                                            </button>
                                        </li>
                                    );
                                },
                            )}
                        </ul>
                    </section>
                    <section id="button">
                        <button onClick={goBack}>수정취소</button>
                        <button onClick={handleModify}>수정완료</button>
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

export default Modify;
