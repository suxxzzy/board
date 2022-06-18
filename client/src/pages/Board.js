import axios from 'axios';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import LoadingIndicator from '../components/LoadingIndicator';
import PostList from '../components/PostList';
import Button from '../components/Button';

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
    const [isLoading, setIsLoading] = useState(true);
    const [board, setBoard] = useState([]);
    useEffect(() => {
        console.log('useEffect 호출');
        setIsLoading(true);
        axios
            .get(`${process.env.REACT_APP_API_URL}/board?page=${1}`)
            .then((res) => {
                console.log('받아온 게시물들', res.data.data.board);
                setBoard(res.data.data.board);
                setIsLoading(false);
            });
    }, []);
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
                {isLoading ? <LoadingIndicator /> : <PostList list={board} />}
            </Table>
            <ButtonList>
                <Button>삭제</Button>
                <Button>등록</Button>
            </ButtonList>
        </Container>
    );
}

export default Board;
