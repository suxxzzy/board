import axios from 'axios';

export const getPresignedUrl = (newAttachmentfiles) => {
    const filePromise = [];
    for (let i = 0; i < newAttachmentfiles.length; i++) {
        //업로드를 위한 presignedurl 요청
        const uploadPromise = axios
            .get(
                `${process.env.REACT_APP_API_URL}/attachmentfile/presignedurl?filename=${newAttachmentfiles[i].name}`,
                { withCredentials: true },
            )
            .then(async (res) => {
                //첨부파일 업로드
                const presignedurl = res.data.data.signedUrl;

                const res_1 = await axios.put(
                    presignedurl,
                    newAttachmentfiles[i],
                    {
                        headers: {
                            'Content-Type': newAttachmentfiles[i].type,
                        },
                    },
                );
                //버킷의 키 알아내기
                const key = `${res_1.config.url.split('/')[3].split('-')[0]}-${
                    newAttachmentfiles[i].name
                }`;
                return {
                    FILENAME: newAttachmentfiles[i].name.split('.')[0],
                    EXT: newAttachmentfiles[i].name.split('.')[1],
                    FILEPATH: key,
                    SIZE: newAttachmentfiles[i].size,
                };
            });
        filePromise.push(uploadPromise);
    }
    return filePromise;
};
