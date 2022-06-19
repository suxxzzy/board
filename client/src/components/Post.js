import styled from 'styled-components';
import { timeConverter } from '../modules/datetimeconverter';

const Row = styled.div`
    display: table-row;
`;

const Col = styled.div`
    display: table-cell;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    text-align: center;
`;

function Post({ no, title, author, createdAt, viewCount }) {
    return (
        <Row>
            <Col>
                <input type="checkbox"></input>
            </Col>
            <Col>{no}</Col>
            <Col>{title}</Col>
            <Col>{author}</Col>
            <Col>{timeConverter(createdAt)}</Col>
            <Col>{viewCount}</Col>
        </Row>
    );
}

export default Post;
