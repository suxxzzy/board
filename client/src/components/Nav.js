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

function Login() {
    return (
        <NavComponent>
            <ul>
                <Link to="/">
                    <li>로그인</li>
                </Link>
                <Link to="/board">
                    <li>게시판</li>
                </Link>
            </ul>
        </NavComponent>
    );
}

export default Login;
