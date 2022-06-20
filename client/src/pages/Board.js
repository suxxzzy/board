import axios from 'axios';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingIndicator from '../components/LoadingIndicator';
import PostList from '../components/PostList';
import Pagination from '../components/Pagination';
import Searchbar from '../components/Searchbar';

const Container = styled.div`
    border: 1px solid black;
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
    const [loadedArticles, setLoadedArticles] = useState([]);
    const [totalArticles, setTotalArticles] = useState(0);
    const [checkedPosts, setCheckedPosts] = useState(
        loadedArticles.map((el) => el.BID),
    );

    console.log(typeof loadedArticles.map((el) => el.BID)[0]);

    useEffect(() => {
        console.log('useEffect 호출');
        setIsLoading(true);
        paginationHandler(currentPage);
    }, [currentPage]);

    const paginationHandler = (currentPage) => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/board?page=${currentPage}`)
            .then((response) => {
                setLoadedArticles(response.data.data.board);
                setTotalArticles(response.data.data.count);
                setIsLoading(false);
            });
    };

    //전체 체크
    const handleAllCheck = (checked) => {
        if (checked) {
            setCheckedPosts(loadedArticles.map((el) => el.BID));
        } else {
            setCheckedPosts([]);
        }
    };

    //개별 체크
    const handleCheckChange = (checked, id) => {
        if (checked) {
            setCheckedPosts([...checkedPosts, id]);
        } else {
            setCheckedPosts(checkedPosts.filter((el) => el.BID !== id));
        }
    };

    return (
        <Container>
            <h3>게시판</h3>
            <Table>
                <RowHeader>
                    <Col>
                        <input
                            type="checkbox"
                            checked={checkedPosts.length === 10 ? true : false}
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
                        list={loadedArticles}
                        handleCheckChange={handleCheckChange}
                        checkedPosts={checkedPosts}
                    />
                )}
            </Table>
            {/*로그인 한 상태에서만 보이도록*/}
            {window.localStorage.getItem('userID') ? (
                <ButtonList>
                    <button>삭제</button>
                    <Link to="/write">
                        <button>등록</button>
                    </Link>
                </ButtonList>
            ) : null}
            <Pagination
                totalArticles={totalArticles}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
            <Searchbar
                currentPage={currentPage}
                setLoadedArticles={setLoadedArticles}
                setTotalArticles={setTotalArticles}
            />
        </Container>
    );
}

export default Board;
