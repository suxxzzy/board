import styled from 'styled-components';

//게시판 테이블 틀 구성
export const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    height: 90%;
`;

export const Table = styled.div`
    display: table;
    width: 80%;
    margin: 1rem;
    border: 1px solid gray;
`;

export const RowHeader = styled.div`
    display: table-row;
`;

export const Col = styled.div`
    display: table-cell;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    text-align: center;
`;

export const ButtonList = styled.div`
    // border: 1px solid red;
    width: 80%;
    display: flex;
    justify-content: flex-end;
`;

//게시판 글 구성하는 요소
export const Row = styled.div`
    display: table-row;
`;
