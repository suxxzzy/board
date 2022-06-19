import styled from 'styled-components';

export const SignButton = styled.button`
    border: none;
    width: 6rem;
    height: 40px;
    margin: 20px 5px;
    &:hover {
        background-color: gray;
        color: white;
    }
`;

// function Button({ children, handleLogin }) {
//     return <ButtonContainer onClick={handleLogin}>{children}</ButtonContainer>;
// }

// export default Button;
