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

const setPageNumbers = () => {
    const pageNumbers = [];
};

//페이지 하단의 1-10까지 탐색할 수 있는 바.
const Pagination = ({ totalArticles, currentPage, setCurrentPage }) => {
    //한번에 보여줄 페이지 개수를 제한할 것.
    const maxPages = 4;

    let startPage = currentPage;
    // 4배수 미만인 경우
    let endPage;
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
