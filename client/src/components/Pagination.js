import React from 'react';
import styled from 'styled-components';

const PageUl = styled.ul`
    margin-top: 20px;
    float: left;
    list-style: none;
    text-align: center;
    color: white;
    padding: 1px;
    background-color: #a3cca3;
`;

const PageLi = styled.li`
    display: inline-block;
    font-size: 17px;
    font-weight: 600;
    padding: 5px;
    width: 30px;
    &:hover {
        cursor: pointer;
        color: white;
        background-color: #688268;
    }
    &:focus::after {
        color: white;
        background-color: #688268;
    }
`;

const PageSpan = styled.span`
    &:hover::after,
    &:focus::after {
        color: white;
        background-color: #688268;
    }
`;

const Pagination2 = ({ totalArticles, currentPage, setCurrentPage }) => {
    const pageNumbers = ['<'];
    //상위 컴포넌트로부터 현재 페이지 정보 전달받는다
    //시작 페이지 정보
    const startPage = currentPage - ((currentPage % 4) - 1);
    //마지막 페이지 정보
    //startPage의 첫 게시물부터 시작해 1-40개의 게시물을 받아오므로, 이에 따라 달라짐
    const endPage = startPage + Math.ceil(totalArticles / 10) - 1;
    //페이지 번호 채우기
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }
    pageNumbers.push('>');

    return (
        <div>
            <nav>
                <PageUl className="pagination">
                    {totalArticles !== 0 ? (
                        pageNumbers.map((page) => (
                            <PageLi
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className="page-item"
                                style={{
                                    backgroundColor:
                                        page === currentPage ? 'green' : 'gray',
                                }}
                            >
                                <PageSpan className="page-link">
                                    {page}
                                </PageSpan>
                            </PageLi>
                        ))
                    ) : (
                        <PageLi
                            key={1}
                            onClick={() => setCurrentPage(1)}
                            className="page-item"
                        >
                            <PageSpan className="page-link">1</PageSpan>
                        </PageLi>
                    )}
                </PageUl>
            </nav>
        </div>
    );
};

//페이지 하단의 1-10까지 탐색할 수 있는 바.
const Pagination = ({ totalArticles, currentPage, setCurrentPage }) => {
    const pageNumbers = ['<'];
    for (let i = 1; i <= Math.ceil(totalArticles / 10); i++) {
        pageNumbers.push(i);
    }
    pageNumbers.push('>');
    return (
        <div>
            <nav>
                <PageUl className="pagination">
                    {totalArticles !== 0 ? (
                        pageNumbers.map((page) => (
                            <PageLi
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className="page-item"
                                style={{
                                    backgroundColor:
                                        page === currentPage ? 'green' : 'gray',
                                }}
                            >
                                <PageSpan className="page-link">
                                    {page}
                                </PageSpan>
                            </PageLi>
                        ))
                    ) : (
                        <PageLi
                            key={1}
                            onClick={() => setCurrentPage(1)}
                            className="page-item"
                        >
                            <PageSpan className="page-link">1</PageSpan>
                        </PageLi>
                    )}
                </PageUl>
            </nav>
        </div>
    );
};

export default Pagination;
