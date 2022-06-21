export const timeConverter_Board = (date) => {
    //주어진 날짜를 slice
    const yyyymmdd = date.slice(0, 8);

    //현재 시각정보
    const currentDate = new Date();

    //연
    const year = currentDate.getFullYear();

    //월
    let month = currentDate.getMonth() + 1;
    month = String(month).length === 2 ? month : `0${month}`;

    //일
    let day = currentDate.getDate();
    day = String(day).length === 2 ? day : `0${day}`;

    //만약에 오늘 날짜에 작성된 게시물이라면 시와 분만 표시
    if (yyyymmdd === `${year}${month}${day}`) {
        return `${date.slice(8, 10)}:${date.slice(10, 12)}`;
    }
    // 그 외의 경우는 yyyy-mm-dd형식으로 표시
    return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
};

export const timeConverter_Post = (date) => {
    const yyyy = date.slice(0, 4);
    const mm = date.slice(4, 6);
    const dd = date.slice(6, 8);
    const hour = date.slice(8, 10);
    const min = date.slice(10, 12);
    const sec = date.slice(12, 14);
    return `${yyyy}-${mm}-${dd} ${hour}:${min}:${sec}`;
};
