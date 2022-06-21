import React, { useState } from 'react';
import styled from 'styled-components';

const PageUl = styled.ul`
    margin-top: 20px;
    float: left;
    list-style: none;
    text-align: center;
    color: white;
    padding: 1px;
    background-color: #a3cca3;

    .currentPage {
        background-color: green;
    }

    .page {
        background-color: #a3cca3;
    }
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

const Pagination = ({ totalArticles, currentPage, setCurrentPage }) => {
    //페이지 시작정보
    const [start, setStart] = useState(currentPage - ((currentPage % 4) - 1));

    //페이지 번호 채우기
    const pageNumbers = [];
    for (
        let i = start;
        i <= Math.min(start + 3, Math.ceil(totalArticles / 10));
        i++
    ) {
        pageNumbers.push(i);
    }

    //이전의 4페이지 보여주는 함수
    const gotoPrev = () => {
        //만약에 시작 인덱스가 1이면, 작동하지 않는다
        if (start === 1) {
            return;
        }
        setStart(start - 4);
        setCurrentPage(start - 4);
    };

    //다음의 페이지 보여주는 함수. 꼭 4페이지씩 안 나올수도 있다.
    const gotoNext = () => {
        if (pageNumbers.length < 4) {
            return;
        }

        setStart(start + 4);
        setCurrentPage(start + 4);
    };

    return (
        <div>
            <nav>
                <PageUl className="pagination">
                    <PageLi onClick={gotoPrev}>&lt;&lt;</PageLi>
                    {totalArticles !== 0 ? (
                        pageNumbers.map((page) => (
                            <PageLi
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={
                                    page === Number(currentPage)
                                        ? 'currentPage'
                                        : 'page'
                                }
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
                    <PageLi onClick={gotoNext}>&gt;&gt;</PageLi>
                </PageUl>
            </nav>
        </div>
    );
};

export default Pagination;
