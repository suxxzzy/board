import styled from 'styled-components';
import axios from 'axios';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { SignInput } from '../components/Input';
import { ErrorMessage } from '../components/validateMsg';
import { SignButton } from '../components/Button';

function Login() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [loginInfo, setLoginInfo] = useState({
        id: '',
        password: '',
    });

    const handleLoginInputValue = (key) => (e) => {
        console.log('working');
        setLoginInfo({ ...loginInfo, [key]: e.target.value });
    };

    const handleLogin = () => {
        //두 값 모두 유효성 검사 통과한 경우에만 서버에 요청을 보낸다.
        if (loginInfo.id === '' || loginInfo.password === '') {
            setErrorMessage('아이디와 비밀번호 모두 입력하세요');
            return;
        } else {
            axios
                .post(
                    `${process.env.REACT_APP_API_URL}/user/login`,
                    {
                        id: loginInfo.id,
                        password: loginInfo.password,
                    },
                    { withCredentials: true },
                )
                .then((res) => {
                    window.localStorage.setItem('userID', res.data.data.userid);
                    alert('로그인 되었습니다');
                    navigate('/board');
                })
                .catch((error) => {
                    if (error.response) {
                        const { data } = error.response;
                        setErrorMessage(data.message);
                    }
                });
        }
    };
    return (
        <>
            {window.localStorage.getItem('userID') ? (
                <Navigate replace to="/board" />
            ) : (
                <Layout>
                    <label htmlFor="userid" onClick={() => alert('hello')}>
                        아이디
                    </label>
                    <SignInput
                        id="userid"
                        type="text"
                        value={loginInfo.id}
                        onChange={handleLoginInputValue('id')}
                    />
                    <label htmlFor="password">비밀번호</label>
                    <SignInput
                        id="password"
                        type="password"
                        value={loginInfo.password}
                        onChange={handleLoginInputValue('password')}
                    />
                    {errorMessage !== '' ? (
                        <ErrorMessage>{errorMessage}</ErrorMessage>
                    ) : null}
                    <SignButton onClick={handleLogin}>로그인</SignButton>
                    <Link to="/signup">
                        <div>회원가입</div>
                    </Link>
                </Layout>
            )}
        </>
    );
}

const Layout = styled.div`
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

export default Login;
