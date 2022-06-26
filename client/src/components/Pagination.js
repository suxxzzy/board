import styled from 'styled-components';
import React, { useState } from 'react';

const Pagination = ({ totalPosts, currentPage, setCurrentPage }) => {
    //페이지 시작정보
    const [start, setStart] = useState(currentPage - ((currentPage % 4) - 1));

    //페이지 번호 채우기
    const pageNumbers = [];
    for (
        let i = start;
        i <= Math.min(start + 3, Math.ceil(totalPosts / 10));
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

    //다음의 페이지 보여주는 함수
    const gotoNext = () => {
        const totalPages = Math.ceil(totalPosts / 10);
        //전체 페이지수가 4개 이하
        //전체 페이지수가 4의 배수이고 시작 페이지 위치가 전체페이지 -3일때
        //전체 페이지가 4의 배수가 아닐 때:
        if (
            totalPages <= 4 ||
            start === totalPages - 3 ||
            start === totalPages - (totalPages % 4) + 1
        ) {
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
                    {totalPosts !== 0 ? (
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

export default Pagination;
