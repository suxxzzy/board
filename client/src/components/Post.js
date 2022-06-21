import styled from 'styled-components';
import { timeConverter_Board } from '../modules/datetimeconverter';

const Row = styled.div`
    display: table-row;
`;

const Col = styled.div`
    display: table-cell;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    text-align: center;
`;

function Post({
    handleCheckChange,
    checkedPosts,
    onClick,
    bid,
    uid,
    title,
    author,
    createdAt,
    viewCount,
}) {
    return (
        <Row>
            <Col>
                <input
                    type="checkbox"
                    onChange={(e) => {
                        handleCheckChange(e.target.checked, bid, uid);
                    }}
                    checked={checkedPosts
                        .map((el) => el.BID)
                        .includes(Number(bid))}
                ></input>
            </Col>
            <Col>{bid}</Col>
            <Col onClick={onClick}>{title}</Col>
            <Col>{author}</Col>
            <Col>{timeConverter_Board(createdAt)}</Col>
            <Col>{viewCount}</Col>
        </Row>
    );
}

export default Post;
