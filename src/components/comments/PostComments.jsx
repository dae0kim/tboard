import { Alert, Box, Button, Divider, Paper, Stack, TextField, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { createComment, fetchComments, updateComment, deleteComment } from '../../api/commentsApi';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import { useMe } from '../../hooks/useMe';


function PostComments({ postId }) {

    const queryClient = useQueryClient();
    // 댓글 입력
    const [newComment, setNewComment] = useState("");
    // 수정
    const [editContent, setEditContent] = useState("");
    const [editId, setEditId] = useState(null); // true -> 수정상태, null -> 작성상태

    const { data: me, isLoading: meIsLoading } = useMe();
    const isMe = !meIsLoading && !!me;


    // TanStack Query
    // 조회
    const { data: comments = [], isLoading: isCommentsLoading, isError: isCommentsError } = useQuery({
        queryKey: ['postComments', postId],
        queryFn: () => fetchComments(postId)
    });

    const checkEdit = (authorId) => {
        return (
            !meIsLoading &&
            me?.id != null &&
            authorId != null &&
            Number(me.id) === Number(authorId)  // 로그인ID, 작성자ID 비교
        )
    }

    // 작성
    const createCommentMutation = useMutation({
        mutationFn: (content) => createComment(postId, { content }),
        onSuccess: () => {
            setNewComment("");
            queryClient.invalidateQueries({ queryKey: ['postComments', postId] });
        },
        onError: () => {
            alert('댓글 등록 실패');
        }
    });

    // 수정
    const updateCommentMutation = useMutation({
        mutationFn: ({ commentId, content }) => updateComment(postId, commentId, { content }),
        onSuccess: () => {
            setEditId(null);
            setEditContent("");
            queryClient.invalidateQueries({ queryKey: ['postComments', postId] });
        },
        onError: () => {
            alert('댓글 수정 실패');
        }
    });

    // 삭제
    const deleteCommentMutation = useMutation({
        mutationFn: (commentId) => deleteComment(postId, commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['postComments', postId] });
        },
        onError: () => {
            alert('댓글 삭제 실패');
        }
    });

    // 이벤트 핸들러
    // 작성
    const handleNewComment = (evt) => {
        evt.preventDefault();
        if (!isMe) return;
        if (!newComment.trim()) return;
        createCommentMutation.mutate(newComment.trim());
    }

    // 수정 모드 진입
    const handleStartEdit = ({ author, id, content }) => {
        if (!checkEdit(author?.id)) return;
        // 수정중으로 변경을 위한 변수 업데이트
        setEditId(id);
        // 기존 내용 출력
        setEditContent(content);
    };

    // 수정 취소
    const handleCancleEdit = () => {
        setEditId(null);
    };

    // 수정 저장
    const handleSaveEdit = (commentId) => {
        if (!editContent.trim()) return;
        updateCommentMutation.mutate({ commentId, content: editContent.trim() });
    };

    // 삭제
    const handleDeleteComment = (commentId) => {
        const comment = comments.find((elem) => elem.id === commentId);

        if (!comment) return;
        if (!checkEdit(comment.author?.id)) {
            alert('본인 댓글만 삭제 가능');
            return;
        }

        if (!window.confirm('댓글 삭제?')) return;
        deleteCommentMutation.mutate(commentId);
    };

    return (
        <Box>
            {/* 댓글 목록 */}
            <Typography variant='h6' sx={{ fontWeight: 600, mb: 1 }}>댓글</Typography>

            {isCommentsLoading && <Loader />}
            {isCommentsError && <ErrorMessage message='댓글 로딩 실패' />}

            {
                !isCommentsLoading && !isCommentsError &&
                comments.map((comment) => {
                    const { id, content, createdAt, author } = comment;

                    // 본인 댓글인지 체크
                    const loginedEdit = checkEdit(author?.id);

                    return (
                        <Paper key={id} variant='outlined' sx={{ p: 2, mb: 1.5 }}>
                            {
                                editId === id ? (
                                    <>
                                        {/* 댓글 수정 */}
                                        <TextField fullWidth value={editContent}
                                            onChange={(evt) => setEditContent(evt.target.value)} />

                                        <Stack direction='row' spacing={0.8} sx={{ mt: 1 }}>
                                            <button size='small' onClick={() => handleSaveEdit(id)}>저장</button>
                                            <button size='small' color='inherit' variant='outlined'
                                                onClick={handleCancleEdit}>취소</button>
                                        </Stack>
                                    </>
                                ) : (
                                    <>
                                        {/* 댓글 리스트 */}
                                        <Typography>
                                            {content}
                                        </Typography>
                                        <Stack direction='row' justifyContent='space-between' alignItems='flex-end'>
                                            <Typography variant='caption'>
                                                {author?.nickname} - {" "}
                                                {createdAt && new Date(createdAt).toLocaleString()}
                                            </Typography>
                                            {/* 본인 댓글일때만 버튼 표시 */}
                                            {
                                                loginedEdit && (
                                                    <Stack direction='row' spacing={0.6}>
                                                        <Button size='samll' onClick={() => handleStartEdit(comment)}>수정</Button>
                                                        <Button size='samll' color='error' onClick={() => handleDeleteComment(id)}>삭제</Button>
                                                    </Stack>
                                                )
                                            }
                                        </Stack>
                                    </>
                                )
                            }
                        </Paper>
                    )
                })
            }


            {/* 댓글 작성 - 로그인 사용자만 가능 */}
            {
                isMe ? (
                    <Box component="form" sx={{ my: 2 }} onSubmit={handleNewComment}>
                        <TextField label="댓글 작성" size='small' fullWidth multiline minRows={2}
                            value={newComment}
                            onChange={(evt) => setNewComment(evt.target.value)} />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button type='submit' variant='contained' size='small' sx={{ borderRadius: 999, px: 1.5, mt: 1 }}>댓글 등록</Button>
                        </Box>
                    </Box>
                ) : (
                    <Alert severity='info'>댓글 작성시 로그인 필요</Alert>
                )
            }
            <Divider sx={{ mb: 2 }} />
        </Box>
    );
}

export default PostComments;