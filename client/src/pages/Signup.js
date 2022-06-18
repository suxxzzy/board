import styled from 'styled-components';
import Input from '../components/Input';

import Button from '../components/Button';

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
    return (
        <Container>
            <h2>회원가입</h2>
            <Input id="userid" type="text" htmlFor="userid" label="아이디" />
            <Input
                id="password"
                type="password"
                htmlFor="userid"
                label="비밀번호"
            />
            <Input
                id="retype"
                type="password"
                htmlFor="retype"
                label="비밀번호 재입력"
            />
            <Button>회원가입</Button>
        </Container>
    );
}

export default Signup;
