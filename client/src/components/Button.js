import styled from 'styled-components';

const ButtonContainer = styled.button`
    border: none;
    width: 6rem;
    height: 40px;
    margin: 20px 5px;
    &:hover {
        background-color: gray;
        color: white;
    }
`;

function Button({ children }) {
    return <ButtonContainer>{children}</ButtonContainer>;
}

export default Button;
