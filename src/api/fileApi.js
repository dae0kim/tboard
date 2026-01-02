import { api } from "./api";

/*
이미지 업로드 API

사용자 이미지 입력: <input type="file" /> -> 서버로 전송 -> 이미지 업로드
서버에서 생성된 URL을 다시 프론트로 전송
-> 게시글 작성, 수정시 그 URL 포함 서버로 전송
*/

export async function uploadImage(file) {

    // 브라우저에서 바이너리 데이터 전송시 반드시 FormData 사용해서 전송해야함
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.post('/api/files/image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return res.data;
}