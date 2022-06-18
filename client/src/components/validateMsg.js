import styled from 'styled-components';
import {
    isValidID,
    isValidPassWord,
    isSamePassword,
} from '../modules/validator';

const Message = styled.div`
    font-size: 0.7rem;
    color: ${(props) => props.color || 'red'};
`;

const compareValue = document.querySelector('#password');
console.log(compareValue.value);

function ValidateMsg({ type, content }) {
    if (type === 'userid') {
        return (
            <Message color={isValidID(content) ? 'green' : null}>
                {isValidID(content)
                    ? '사용가능한 id입니다'
                    : '영문, 숫자 최소 4~20자로 만들어주세요'}
            </Message>
        );
    }
    if (type === 'password') {
        return (
            <Message color={isValidPassWord(content) ? 'green' : null}>
                {isValidPassWord(content)
                    ? '사용가능한 비밀번호입니다'
                    : '영문, 숫자, 특수문자 최소 1자씩 8~20자로 만들어주세요'}
            </Message>
        );
    }
    if (type === 'retype') {
        return (
            <Message
                color={
                    isSamePassword(compareValue.value, content) ? 'green' : null
                }
            >
                {isSamePassword(compareValue.value, content)
                    ? '비밀번호가 일치합니다'
                    : '비밀번호가 일치하지 않습니다'}
            </Message>
        );
    }
}

export default ValidateMsg;

//아이디 유효성 검사
//비밀번호 유효성 검사
//비밀번호 일치 유효성 검사

//불통시 빨간색, 통과시 초록색
