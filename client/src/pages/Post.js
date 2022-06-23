import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { timeConverter_Post } from '../modules/datetimeconverter';

const Container = styled.section`
    display: flex;
    flex-direction: column;
    height: 90%;
    padding: 3rem;
    > label {
        font-weight: bold;
    }
    #title {
        width: 90%;
        border-bottom: 1px solid black;
        display: flex;
        flex-direction: column;
    }
    #content {
        border-bottom: 1px solid black;
        width: 90%;
        height: 400px;
        padding: 1rem 0rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
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

function Post() {
    const location = useLocation();
    const navigate = useNavigate();
    const [board, setBoard] = useState({
        NO: '',
        BID: 0,
        TITLE: '',
        UID: '',
        USERID: '',
        CRTIME: '',
        CONTENT: '',
        ATTACHMENTFILES: [],
    });

    useEffect(() => {
        getPost();
    }, []);

    console.log(location.state, '<Post>현재 값');
    const getPost = () => {
        axios
            .get(
                `${process.env.REACT_APP_API_URL}/board/${location.state.BID}`,
                {
                    withCredentials: true,
                },
            )
            .then((res) => {
                console.log(res.data.data, '게시물 상세 정보');
                setBoard({
                    ...board,
                    No: location.state.No,
                    BID: res.data.data.Board.BID,
                    TITLE: res.data.data.Board.TITLE,
                    UID: res.data.data.Board.UID,
                    USERID: res.data.data.Board.UID_user.USERID,
                    CRTIME: timeConverter_Post(res.data.data.Board.CRTIME),
                    CONTENT: res.data.data.Board.CONTENT,
                    ATTACHMENTFILES: res.data.data.Board.attachmentfiles,
                });
            });
    };

    const goToBoard = () => {
        navigate('/board');
    };

    const handleModify = () => {
        if (!window.localStorage.getItem('userID')) {
            alert('로그인이 필요합니다');
            return;
        }
        navigate(`/board/${location.state.No}/modify`, {
            state: {
                board,
            },
        });
    };

    const handleDelete = () => {
        console.log('삭제요청');
        // if (!window.localStorage.getItem('userID')) {
        //     alert('로그인이 필요합니다');
        //     return;
        // }
        //이후 삭제 요청.(페이지 번호 받아서 서버에 요청. 페이지 번호는 배열에 담는다)
        axios
            .patch(
                `${process.env.REACT_APP_API_URL}/board`,
                { deletes: [{ UID: board.UID, BID: board.BID }] },
                {
                    withCredentials: true,
                },
            )
            .then((res) => {
                alert('삭제되었습니다');
                navigate('/board');
            })
            .catch((error) => {
                if (error.response) {
                    const { data } = error.response;
                    alert(data.message);
                }
            });
    };

    console.log(board.ATTACHMENTFILES, '<Post>에서의 첨부파일 상태');

    return (
        <Container>
            <h2>게시판</h2>
            <section id="title">
                <h3>{board.TITLE}</h3>
                <div>{board.USERID}</div>
                <div>{board.CRTIME}</div>
            </section>
            <section id="content">
                <article>{board.CONTENT}</article>
                <section>
                    <div>첨부파일</div>
                    <ul>
                        {board.ATTACHMENTFILES.map((attachmentfile, idx) => {
                            return (
                                <li key={idx}>
                                    <a
                                        href={`${process.env.REACT_APP_API_URL}/attachmentfile/object?key=${attachmentfile.FILEPATH}`}
                                        download={attachmentfile.FILEPATH}
                                    >{`${attachmentfile.FILENAME}.${attachmentfile.EXT}`}</a>
                                </li>
                            );
                        })}
                    </ul>
                </section>
            </section>
            <section>
                <button onClick={goToBoard}>목록</button>
                {Number(window.localStorage.getItem('userID')) === board.UID ? (
                    <>
                        <button onClick={handleModify}>수정</button>
                        <button onClick={handleDelete}>삭제</button>
                    </>
                ) : null}
            </section>
        </Container>
    );
}

export default Post;
