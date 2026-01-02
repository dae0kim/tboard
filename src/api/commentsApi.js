// commentsApi.js
import { api } from './api';

// 댓글 조회
export async function fetchComments(postId) {
    const res = await api.get(`/api/posts/${postId}/comments`);
    return res.data;
}

// 댓글 작성
export async function createComment(postId, payload) {
    const res = await api.post(`/api/posts/${postId}/comments`, payload);
    return res.data;
}

// 댓글 수정
export async function updateComment(postId, commentId, payload) {
    const res = await api.put(`/api/posts/${postId}/comments/${commentId}`, payload);
    return res.data;
}

// 댓글 삭제
export async function deleteComment(postId, commentId) {
    await api.delete(`/api/posts/${postId}/comments/${commentId}`);
}