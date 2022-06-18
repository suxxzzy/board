import axios from 'axios';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Input from '../components/Input';
import Button from '../components/Button';

const Container = styled.div`
    //border: 3px solid green;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 90%;
    > label {
        //border: 1px solid blue;
        width: 400px;
    }
    > div {
        // border: 1px solid blue;
        width: 400px;
        text-align: center;
    }
`;

function Login() {
    const handleLogin = () => {
        //두 값 모두 유효성 검사 통과한 경우에만 서버에 요청을 보낸다.
        axios
            .post(`${process.env.REACT_APP_API_URL}/user/login`, {
                id,
                password,
            })
            .then((res) => {
                //로컬스토리지에 아이디 저장
                window.localStorage.setItem('userID', res.data.data.userid);
            });
    };
    return (
        <Container>
            <Input id="userid" type="text" htmlFor="userid" label="아이디" />
            <Input
                id="password"
                type="password"
                htmlFor="userid"
                label="비밀번호"
            />
            <Button onClick={handleLogin}>로그인</Button>
            <Link to="/signup">
                <div>회원가입</div>
            </Link>
        </Container>
    );
}

export default Login;
