import styled from 'styled-components';

//회원가입
export const ValidateMessage = styled.div`
    font-size: 0.7rem;
    color: ${(props) => props.color || 'red'};
`;

//로그인, 회원가입 버튼 누른 후
export const ErrorMessage = styled.div`
    width: 300px;
    border: 1px solid red;
    background-color: pink;
    text-align: center;
`;
