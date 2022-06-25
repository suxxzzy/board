import { Row, Col } from './Div';
import { timeConverter_Board } from '../modules/datetimeconverter';

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
