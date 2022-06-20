import axios from 'axios';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NavComponent = styled.nav`
    //border: 3px solid blue;
    padding: 1rem;
    display: flex;
    justify-content: flex-end;
    height: 10%;
    > ul {
        display: flex;
        list-style-type: none;
        padding-left: 0;
        margin: 0;
        > a {
            > li {
                // border: 1px solid green;
                margin: 0 10px;
                font-weight: bold;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
        }
    }
`;
//로컬스토리지에 userid가 있으면 로그아웃, 게시판 메뉴 보이기. 새로고침!!
function Nav() {
    const handleLogout = () => {
        axios
            .post(
                `${process.env.REACT_APP_API_URL}/user/logout`,
                {},
                { withCredentials: true },
            )
            .then((res) => {
                window.localStorage.removeItem('userID');
                window.location.reload();
            });
    };
    return (
        <NavComponent>
            <ul>
                {window.localStorage.getItem('userID') ? (
                    <>
                        <li onClick={handleLogout}>로그아웃</li>
                        <Link to="/board">
                            <li>게시판</li>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to="/signup">
                            <li>회원가입</li>
                        </Link>
                        <Link to="/">
                            <li>로그인</li>
                        </Link>
                        <Link to="/board">
                            <li>게시판</li>
                        </Link>
                    </>
                )}
            </ul>
        </NavComponent>
    );
}

export default Nav;
