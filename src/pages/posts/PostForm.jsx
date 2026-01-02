import { useEffect, useState } from 'react';
import { Box, Paper, Stack, Typography } from '@mui/material'
import PostFormFields from '../../components/posts/PostFormFields'
import PostFormImage from '../../components/posts/PostFormImage'
import PostFormSubmit from '../../components/posts/PostFormSubmit'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPosts, fetchPostsDetail, updatePosts } from '../../api/postsApi';
import { Navigate, useNavigate, useParams } from 'react-router';
import Loader from '../../components/common/Loader'
import { uploadImage } from '../../api/fileApi';

// mode = create -> 새 글 작성
// mode = edit -> 글 수정
function PostForm({ mode }) {

    // true면 글 수정, false면 글 작성
    const isEdit = mode === 'edit';

    // Query 캐시 무효화
    const queryClient = useQueryClient();

    // 다른 페이지로 이동
    const navigate = useNavigate();

    // url 주소에 있는 id 값을 가져옴
    const { id } = useParams();
    // 가져온 파라미터는 문자열이므로 숫자로 형변환
    const postId = Number(id);

    // 폼 입력 값
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    // 이미지
    const [imageName, setImageName] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    // TanStack Query
    // 생성
    const createMutation = useMutation({
        // Api에서 선언했던 함수
        mutationFn: createPosts,
        // 등록에 성공했을 때 생성된 객체(create)를 받은 것
        onSuccess: (create) => {
            // 캐시 초기화, 무효화
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            // 방금 생성된 객체의 id를 받아서 상세 페이지로 이동
            navigate(`/posts/${create.id}`);
        },
        onError: () => {
            alert('게시글 등록에 실패했습니다.');
        }
    });

    // 글 수정할 때 수정 전 데이터 조회
    const { data: post, isLoading, isError } = useQuery({
        queryKey: ['post', postId],
        queryFn: () => fetchPostsDetail(postId),
        enabled: isEdit // true일때만 이 쿼리가 동작 -> false일때는 글 작성이므로 굳이 데이터 가져올 필요 없음
    })

    // 수정
    const updateMutation = useMutation({
        mutationFn: (payload) => updatePosts(postId, payload),
        onSuccess: (update) => {
            // 목록 캐시 무효화
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            // 상세 페이지 캐시 무효화
            queryClient.invalidateQueries({ queryKey: ['post', postId] });
            navigate(`/posts/${update.id}`);
        },
        onError: () => {
            alert('게시글 수정에 실패했습니다.');
        }
    });

    // 이미지 업로드 Mutation
    const uploadMutation = useMutation({
        mutationFn: (file) => uploadImage(file),
        onSuccess: (result) => {
            setImageUrl(result.imageUrl);
        },
        onError: () => {
            alert('이미지 업로드에 실패했습니다.');
        }
    })

    // side effect: 랜더링 된 후 정해진 변수의 상태에 따라 실행
    // useEffect(콜백함수, [변수])
    // useEffect(() => {}, []); 한 번만 실행됨
    useEffect(() => {
        if (isEdit && post) {
            setTitle(post.title);
            setContent(post.content);
            setImageUrl(post.imageUrl || null);
        }
    }, [isEdit, post]); // 수정모드이고, 데이터가 바뀌면 실행

    // 이벤트 핸들러
    // 이미지 업로드
    const handleImage = (evt) => {
        // Files 객체
        const file = evt.target.files?.[0];
        if (!file) return;

        setImageName(file.name);

        if (file.size > 1024 * 1024 * 5) {
            alert('이미지 크기는 5MB 이하만 가능');
            evt.target.value = "";
            return;
        }

        uploadMutation.mutate(file);
        evt.target.value = "";
    }

    // 폼 전송
    const handleSubmit = (evt) => {
        // 페이지 새로고침 방지
        evt.preventDefault();

        const payload = {
            title: title.trim(),
            content: content.trim(),
            imageUrl: imageUrl || null
        }

        // 필수값 검증
        if (!title.trim() || !content.trim()) {
            alert('제목과 내용은 필수입니다.');
            return;
        }

        // 이미지 업로드 중이면 폼 전송 중지
        if (updateMutation.isPending) {
            alert('이미지 업로드 중');
            return;
        }

        // props에 따라 mutation 호출(생성/수정)
        if (isEdit) {
            updateMutation.mutate(payload); // 수정
        } else {
            createMutation.mutate(payload);
        }
    }

    if (isEdit && isLoading) return <Loader />
    if (isEdit && isError) return <ErrorMessage message='불러오지 못함' />

    return (
        <Box sx={{ px: 2, py: 6 }}>
            <Paper sx={{ width: '100%', borderRadius: 3, px: 4, py: 3, boxShadow: '0 16px 45px rgba(0,0,0,0.06)' }}>
                {/* 제목 */}
                <Typography variant='h6' sx={{ fontWeight: 700, mb: 3 }}>
                    {isEdit ? '게시글 수정' : '새 글 작성'}
                </Typography>

                <Box component='form' onSubmit={handleSubmit}>
                    <Stack spacing={2.5}>
                        {/* 입력 필드 */}
                        <PostFormFields
                            title={title}
                            content={content}
                            onChangeTitle={setTitle}
                            onChangeContent={setContent}
                        />

                        {/* 이미지 업로드 */}
                        <PostFormImage
                            imageName={imageName}
                            uploading={updateMutation.isPending}
                            onChangeImage={handleImage}
                        />

                        {/* 등록 or 수정 버튼 */}
                        <PostFormSubmit isEdit={isEdit} />
                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
}

export default PostForm;