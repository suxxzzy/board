import axios from 'axios';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingIndicator from '../components/LoadingIndicator';
import PostList from '../components/PostList';
import Pagination from '../components/Pagination';
import Searchbar from '../components/Searchbar';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    height: 90%;
`;

const Table = styled.div`
    display: table;
    width: 80%;
    margin: 1rem;
    border: 1px solid gray;
`;

const RowHeader = styled.div`
    display: table-row;
`;

const Col = styled.div`
    display: table-cell;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    text-align: center;
    padding: 5px 0px;
`;

const ButtonList = styled.div`
    // border: 1px solid red;
    width: 80%;
    display: flex;
    justify-content: flex-end;
`;

function Board() {
    const navigate = useNavigate();
    //1회만 새로고침
    window.onload = function () {
        if (!window.location.hash) {
            window.location = window.location + '#loaded';
            window.location.reload();
        }
    };
    window.onload();
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [loadedPosts, setLoadedPosts] = useState([]);
    const [totalPosts, setTotalPosts] = useState(0);
    const [checkedPosts, setCheckedPosts] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        paginationHandler(currentPage);
    }, [currentPage]);

    const paginationHandler = (currentPage) => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/board?page=${currentPage}`)
            .then((res) => {
                setLoadedPosts(res.data.data.board);
                setTotalPosts(res.data.data.count);
                setIsLoading(false);
            });
    };

    //전체 체크
    const handleAllCheck = (checked) => {
        if (checked) {
            setCheckedPosts(
                loadedPosts.map((el) => {
                    return { BID: el.BID, UID: el.UID };
                }),
            );
        } else {
            setCheckedPosts([]);
        }
    };

    //개별 체크
    const handleCheckChange = (checked, BID, UID) => {
        console.log(checked, BID, UID);
        if (checked) {
            setCheckedPosts([...checkedPosts, { BID, UID }]);
        } else {
            setCheckedPosts(checkedPosts.filter((el) => el.BID !== BID));
        }
    };

    //삭제 요청
    const handleDelete = () => {
        console.log('삭제요청');
        //??
        // if (!window.localStorage.getItem('userID')) {
        //     alert('로그인이 필요합니다');
        //     return;
        // }

        //아무것도 체크가 안되어있으면 삭제할 게시물을 선택해주세요 띄우기
        if (checkedPosts.length === 0) {
            alert('삭제할 게시물을 선택하세요');
            return;
        }

        //만일 다른 사용자의 id가 포함되어 있다면, 한꺼번에 삭제할 수 없음
        if (
            checkedPosts
                .map((post) => post.UID)
                .filter(
                    (el) =>
                        el !== Number(window.localStorage.getItem('userID')),
                ).length
        ) {
            alert(
                `다른 사람의 게시물이 포함되어 있습니다. 확인 후 다시 삭제해주세요`,
            );
            //체크된 다른 사람의 게시물 체크 취소하기: 체크된 것 중 내가 쓴 것만 체크되게 설정.
            setCheckedPosts(
                checkedPosts.filter(
                    (el) =>
                        el.UID ===
                        Number(window.localStorage.getItem('userID')),
                ),
            );
            return;
        }
        //이후 삭제 요청.(페이지 번호 받아서 서버에 요청. 페이지 번호는 배열에 담는다)
        axios
            .patch(
                `${process.env.REACT_APP_API_URL}/board`,
                { deletes: checkedPosts },
                {
                    withCredentials: true,
                },
            )
            .then((res) => {
                //삭제 성공
                alert('삭제되었습니다');
                navigate('/board');
            })
            .catch((error) => {
                //삭제 실패 메세지 띄우기
                if (error.response) {
                    const { data } = error.response;
                    alert(data.message);
                }
            });
    };

    return (
        <Container>
            <h3>게시판</h3>
            <Table>
                <RowHeader>
                    <Col>
                        <input
                            type="checkbox"
                            checked={
                                checkedPosts.length === loadedPosts.length
                                    ? true
                                    : false
                            }
                            onChange={(e) => handleAllCheck(e.target.checked)}
                        ></input>
                    </Col>
                    <Col>No.</Col>
                    <Col>제목</Col>
                    <Col>게시자</Col>
                    <Col>게시일</Col>
                    <Col>조회수</Col>
                </RowHeader>
                {isLoading ? (
                    <LoadingIndicator />
                ) : (
                    <PostList
                        totalPosts={totalPosts}
                        currentPage={currentPage}
                        list={loadedPosts}
                        handleCheckChange={handleCheckChange}
                        checkedPosts={checkedPosts}
                    />
                )}
            </Table>
            {/*로그인 한 상태에서만 보이도록*/}
            {window.localStorage.getItem('userID') ? (
                <ButtonList>
                    <button onClick={handleDelete}>삭제</button>
                    <Link to="/write">
                        <button>등록</button>
                    </Link>
                </ButtonList>
            ) : null}
            <Pagination
                totalPosts={totalPosts}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
            <Searchbar
                currentPage={currentPage}
                setLoadedPosts={setLoadedPosts}
                setTotalPosts={setTotalPosts}
            />
        </Container>
    );
}

export default Board;
