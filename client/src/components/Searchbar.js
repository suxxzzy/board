import { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.section`
    display: flex;
`;

function Searchbar({ currentPage, setLoadedPosts, setTotalPosts }) {
    const [option, setOption] = useState('제목');

    const [keyword, setKeyword] = useState('');
    const handleKeyUp = (e) => {
        if (e.type === 'keyup' && e.code === 'Enter') {
            handleClick();
        }
    };

    //검색 요청
    const handleClick = () => {
        handleSearch(option, keyword);
    };

    //검색 조건 관리
    const handleOptionChange = (e) => {
        setOption(e.target.value);
    };

    //검색 키워드 입력칸
    const handleChange = (e) => {
        setKeyword(e.target.value);
    };

    //실제 검색 요청을 보내는 함수
    const handleSearch = (option, keyword) => {
        //키워드 없으면 리턴
        if (keyword === '') {
            alert('검색어를 입력하세요');
            return;
        }
        //옵션에 따라 엔드포인트가 달라짐
        const endpoint = `${
            process.env.REACT_APP_API_URL
        }/board/search?option=${
            option === '제목' ? 'title' : 'author'
        }&keyword=${keyword}&page=${currentPage}`;

        axios
            .get(endpoint)
            .then((res) => {
                //검색 결과를 잘 받아왔으면 전체 게시물 개수와 특정 페이지에 대한 게시물을 받아온다
                console.log(res.data.data, '요청한 검색결과');
                setLoadedPosts(res.data.data.board);
                setTotalPosts(res.data.data.count);
                setKeyword('');
            })
            .catch(() => {
                setLoadedPosts([]);
                setTotalPosts(0);
            });
    };

    return (
        <Container>
            <select onChange={handleOptionChange}>
                <option value="제목">제목</option>
                <option value="작성자">작성자</option>
            </select>
            <input
                type="text"
                placeholder="검색어를 입력하세요"
                onKeyUp={handleKeyUp}
                onChange={handleChange}
                value={keyword}
            ></input>
            <button onClick={() => handleClick()}>검색</button>
        </Container>
    );
}

export default Searchbar;
