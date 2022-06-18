import { useState } from 'react';
import styled from 'styled-components';
import ValidateMsg from '../components/validateMsg';
const Container = styled.section`
    //border: 1px solid red;
    display: flex;
    flex-direction: column;
    > label {
    }
    > input {
        width: 400px;
        height: 40px;
        margin: 10px 0px;
        font-size: 1rem;
        &:focus {
            outline: none;
        }
    }
`;

function Input({ label, htmlFor, id, type }) {
    const [isWriteMode, setIsWriteMode] = useState(false);
    const [userInput, setUSerInput] = useState('');
    const handleFocus = () => {
        setIsWriteMode(true);
    };
    const handleBlur = () => {
        setIsWriteMode(false);
    };
    const handleChange = (e) => {
        setUSerInput(e.target.value);
    };

    const location = window.location.href.split('3000/')[1] === 'signup';
    return (
        <Container>
            <label htmlFor={htmlFor}>{label}</label>
            <input
                id={id}
                type={type}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
                value={userInput}
            ></input>
            {location && isWriteMode ? (
                <ValidateMsg type={id} content={userInput} />
            ) : null}
        </Container>
    );
}

export default Input;
