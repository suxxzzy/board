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

function Write() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [preview, setPreview] = useState('');
    const [attachmentfiles, setAttachmentFiles] = useState([]);

    const handleChangeTitle = (e) => {
        setTitle(e.target.value);
    };

    const handleChangeContent = (e) => {
        setContent(e.target.value);
    };

    //작성 취소
    const goBack = () => {
        //등록했던 첨부파일이 존재한다면, s3상에서 삭제해야 한다.
        //여러개를 첨부했을 수 있으니 한번에 삭제
        //주어진 배열에서 파일의 키 이름만 추출
        const deletes = attachmentfiles.map((attachmentfile) => {
            return {
                Key: attachmentfile.FILEPATH,
            };
        });

        axios
            .post(
                `${process.env.REACT_APP_API_URL}/attachmentfile`,
                { deletes },
                {
                    withCredentials: true,
                },
            )
            .then((res) => {
                alert('작성을 취소했습니다');
                navigate(-1);
            });
    };

    //파일 첨부시 업로드 할 수 있는 url서버에 요청
    //=> 성공시 s3 url에 즉시 업로드: 이때, 파일을 다운로드 받을 수 있는 링크를 받아와야 한다.!!

    //화면상에 렌더링하고, 바로 s3에 올리지는 않는다.
    const handleUploadFile = (e) => {
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);

        //파일명 미리보기 띄우기
        reader.onload = () => {
            setPreview(e.target.files[0].name);
        };

        //업로드할 파일 목록 업데이트하기
        setAttachmentFiles([...attachmentfiles, e.target.files[0]]);

        //업로드를 위한 presignedurl 요청
        axios
            .get(
                `${process.env.REACT_APP_API_URL}/attachmentfile/presignedurl?filename=${e.target.files[0].name}`,
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

    //업로드한 파일 삭제(버킷에 있는 파일 삭제 요청): db에는 올리지 않았으니, s3에서만 삭제하면 된다.
    const handleDeleteFile = (idx) => {
        console.log('삭제요청');

        //어짜피 s3에 안 올렸으니까, 그냥 배열에서만 삭제하면 된다.
        setAttachmentFiles(
            attachmentfiles.filter(
                (attachmentfile, fileidx) => fileidx !== idx,
            ),
        );

        //굳이..
        // axios
        //     .post(
        //         `${process.env.REACT_APP_API_URL}/attachmentfile`,
        //         { deletes: [{ Key }] },
        //         {
        //             withCredentials: true,
        //         },
        //     )
        //     .then((res) => {
        //         alert('삭제완료');
        //         setAttachmentFiles(
        //             attachmentfiles.filter((file) => file.FILEPATH !== Key),
        //         );
        //     });
    };

    //게시물 등록
    const handlePost = () => {
        //첨부파일 없을 수도 있음
        //단 제목과 내용은 입력 필수
        if (!title || !content || attachmentfiles === undefined) {
            alert('제목과 내용 모두 입력해주세요');
        }

        //서버에 axios 요청 보내기
        axios
            .post(
                `${process.env.REACT_APP_API_URL}/board`,
                {
                    title,
                    content,
                    attachmentfiles, //첨부파일이 존재하지 않을 경우 빈 배열로 전달됨
                },
                { withCredentials: true },
            ) //
            .then((res) => {
                //새로 생성된 게시글 페이지로 이동.....새로 생성한 게시물의 개수===화면에서 보일 no.는 어떻게 알아내지? 백엔드에서 계산해줘야함
                alert('등록되었습니다');
                console.log(res.data.data, '<Write>');
                navigate(`/board/${res.data.data.No}`, {
                    state: {
                        No: res.data.data.No,
                        BID: res.data.data.BID,
                    },
                });
            });
    };

    console.log(attachmentfiles, '<Write>에서의 첨부파일 상태');

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
                </Container>
            )}
        </>
    );
}

export default Write;
