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
    No,
    BID,
    UID,
    TITLE,
    USERID,
    CRTIME,
    VIEWCOUNT,
}) {
    return (
        <Row>
            <Col>
                <input
                    type="checkbox"
                    onChange={(e) => {
                        handleCheckChange(e.target.checked, BID, UID);
                    }}
                    checked={checkedPosts
                        .map((post) => post.BID)
                        .includes(Number(BID))}
                ></input>
            </Col>
            <Col>{No}</Col>
            <Col onClick={onClick}>{TITLE}</Col>
            <Col>{USERID}</Col>
            <Col>{timeConverter_Board(CRTIME)}</Col>
            <Col>{VIEWCOUNT}</Col>
        </Row>
    );
}

export default Post;
