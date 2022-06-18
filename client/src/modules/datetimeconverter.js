module.exports = (date) => {
    //주어진 날짜를 slice
    const yyyymmdd = date.slice(0, 8);
    //현재 시각정보를 위 형식으로
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day =
        currentDate.getDate().length === 2
            ? currentDate.getDate()
            : `0${currentDate.getDate()}`;

    //만약에 오늘 날짜에 작성된 게시물이라면 시와 분만 표시
    if (yyyymmdd === `${year}${month}${day}`) {
        return `${date.slice(8, 10)}:${date.slice(10, 12)}`;
    }
    // 그외의 경우는 yyyy-mm-dd형식으로 표시
    return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
};
