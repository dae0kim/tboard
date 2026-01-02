import { Button, Stack, Typography } from '@mui/material'
import { Link } from 'react-router';

function PostPagination({ page, totalPages, onPrev, onNext, logined }) {
    return (
        <Stack direction="row" justifyContent={'space-between'} sx={{ mt: 3 }}>
            {/* 페이지내이션 */}
            <Stack direction="row" alignItems={'center'} spacing={2}>
                <Button variant='outlined' size='small' disabled={page === 0} onClick={onPrev}>
                    이전
                </Button>
                <Typography>
                    {page + 1} / {totalPages}
                </Typography>
                <Button variant='outlined' size='small' disabled={page + 1 >= totalPages} onClick={onNext}>
                    다음
                </Button>
            </Stack>

            {/* 새 글 작성 버튼 */}
            {
                logined && (
                    <Button component={Link} to='/posts/new' variant='container' size='small' sx={{ borderRadius: 999, px: 3, fontWeight: 500 }}>
                        새 글 작성
                    </Button>
                )
            }

        </Stack>
    );
}

export default PostPagination;