import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useState } from 'react';
import { SignInput } from '../components/Input';
import { ValidateMessage, ErrorMessage } from '../components/validateMsg';
import { SignButton } from '../components/Button';
import {
    isValidID,
    isValidPassword,
    isSamePassword,
} from '../modules/validator';

const Container = styled.div`
    // border: 1px solid black;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 90%;
    > label {
        // border: 1px solid blue;
        width: 400px;
    }
    > div {
        // border: 1px solid blue;
        width: 400px;
        text-align: center;
    }
`;

function Signup() {
    const navigate = useNavigate();
    const [showMessage, setShowMessage] = useState(false);
    const [IDMessage, setIDMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [signupInfo, setSignupInfo] = useState({
        id: '',
        password: '',
        retype: '',
    });

    const handleBlur = (e) => {
        setShowMessage(true);
        // 아이디 유효성 검사 진행
        if (e.target.id === 'userid') {
            handleIDCheck(e.target.value);
        }
    };

    const handleIDCheck = async (id) => {
        if (!isValidID(id)) {
            setIDMessage('형식에 맞지 않는 아이디입니다');
            return false;
        }
        let isValid = false;
        await axios
            .post(`${process.env.REACT_APP_API_URL}/user/userid`, { id })
            .then((res) => {
                setIDMessage('사용가능한 아이디입니다');
                isValid = true;
            })
            .catch((error) => {
                if (error.response) {
                    const { data } = error.response;
                    setIDMessage(data.message);
                }
            });
        return isValid;
    };

    const handleSignupInputValue = (key) => (e) => {
        setSignupInfo({ ...signupInfo, [key]: e.target.value });
    };

    const handleSignup = async () => {
        const is_Valid_ID = await handleIDCheck(signupInfo.id);
        if (
            !is_Valid_ID ||
            !isValidPassword(signupInfo.password) ||
            !isSamePassword(signupInfo.password, signupInfo.retype)
        ) {
            setErrorMessage('회원가입에 필요한 정보를 바르게 입력해주세요');
            return;
        } else {
            axios
                .post(`${process.env.REACT_APP_API_URL}/user/signup`, {
                    id: signupInfo.id,
                    password: signupInfo.password,
                    retype: signupInfo.retype,
                })
                .then((res) => {
                    alert('회원가입 되었습니다');
                    //회원가입 성공하였음. 로그인 페이지로 이동함
                    navigate('/');
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
        <Container>
            <h2>회원가입</h2>
            <label htmlFor="userid">아이디</label>
            <SignInput
                id="userid"
                type="text"
                value={signupInfo.id}
                onChange={handleSignupInputValue('id')}
                onBlur={handleBlur}
            />
            {showMessage ? (
                <ValidateMessage
                    color={
                        IDMessage === '사용가능한 아이디입니다' ? 'green' : null
                    }
                >
                    {IDMessage}
                </ValidateMessage>
            ) : null}
            <label htmlFor="password">비밀번호</label>
            <SignInput
                id="password"
                type="password"
                value={signupInfo.password}
                onChange={handleSignupInputValue('password')}
                onBlur={handleBlur}
            />
            {showMessage ? (
                <ValidateMessage
                    color={
                        isValidPassword(signupInfo.password) ? 'green' : null
                    }
                >
                    {isValidPassword(signupInfo.password, 'msg')}
                </ValidateMessage>
            ) : null}
            <label htmlFor="retype">비밀번호 재입력</label>
            <SignInput
                id="retype"
                type="password"
                value={signupInfo.retype}
                onChange={handleSignupInputValue('retype')}
                onBlur={handleBlur}
            />
            {showMessage ? (
                <ValidateMessage
                    color={
                        isSamePassword(signupInfo.password, signupInfo.retype)
                            ? 'green'
                            : null
                    }
                >
                    {isSamePassword(
                        signupInfo.password,
                        signupInfo.retype,
                        'msg',
                    )}
                </ValidateMessage>
            ) : null}
            {errorMessage !== '' ? (
                <ErrorMessage>{errorMessage}</ErrorMessage>
            ) : null}
            <SignButton onClick={handleSignup}>회원가입</SignButton>
        </Container>
    );
}

export default Signup;
