import axios from 'axios';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingIndicator from '../components/LoadingIndicator';
import PostList from '../components/PostList';
import Pagination from '../components/Pagination';
import Searchbar from '../components/Searchbar';
// import SignButton from '../components/Button';

const Container = styled.div`
    border: 1px solid black;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    height: 90%;
    > h3 {
        border: 1px solid red;
    }
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

    const paginationHandler = (currentPage) => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/board?page=${currentPage}`)
            .then((response) => {
                console.log(response.data.data, '응답');
                setLoadedArticles(response.data.data.board);
                setTotalArticles(response.data.data.count);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        console.log('useEffect 호출');
        setIsLoading(true);
        paginationHandler(currentPage);
    }, [currentPage]);
    return (
        <Container>
            <h3>게시판</h3>
            <Table>
                <RowHeader>
                    <Col>
                        <input type="checkbox"></input>
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
                    <PostList list={loadedArticles} />
                )}
            </Table>
            <ButtonList>
                <button>삭제</button>
                <button>등록</button>
            </ButtonList>
            <Pagination
                totalArticles={totalArticles}
                setCurrentPage={setCurrentPage}
            ></Pagination>
            <Searchbar
                currentPage={currentPage}
                setLoadedArticles={setLoadedArticles}
                setTotalArticles={setTotalArticles}
            />
        </Container>
    );
}

export default Board;
