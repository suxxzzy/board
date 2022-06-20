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
//페이지 하단의 1-10까지 탐색할 수 있는 바.
const Pagination = ({ totalArticles, setCurrentPage }) => {
    console.log('페이지네이션 컴포넌트 총 게시글 수', totalArticles);
    if (totalArticles === 0) return null;
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalArticles / 10); i++) {
        pageNumbers.push(i);
    }
    console.log(pageNumbers);
    return (
        <div>
            <nav>
                <PageUl className="pagination">
                    {pageNumbers.map((page) => (
                        <PageLi
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className="page-item"
                        >
                            <PageSpan className="page-link">{page}</PageSpan>
                        </PageLi>
                    ))}
                </PageUl>
            </nav>
        </div>
    );
};

export default Pagination;
