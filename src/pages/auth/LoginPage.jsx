import { Container, TextField, Paper, Typography, Box, Stack, Button } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { login, register, setAuth } from '../../api/authApi';
import { useNavigate } from 'react-router';

function LoginPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: async (data) => {
            // localStorage에 토큰 저장
            setAuth(data);
            await queryClient.invalidateQueries({ queryKey: ["me"] });
            navigate("/posts");
        }
    });

    // 이벤트 핸들러
    const handleSubmit = (evt) => {
        evt.preventDefault();

        const fd = new FormData(evt.currentTarget);
        loginMutation.mutate({
            // String(fd.get("password")) => name이 password인 요소의 값을 가져옴
            email: String(fd.get("email")).trim(),
            password: String(fd.get("password"))
        })
    }

    return (
        <Container maxWidth="small">
            <Paper sx={{ width: '100%', borderRadius: 3, px: 4, py: 3, boxShadow: '0 16px 45px rgba(0,0,0,0.06)' }}>
                {/* 상단 제목 */}
                <Typography variant='h5' sx={{ fontWeight: 600, fontSize: 24 }}>
                    로그인
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField type="email" name="email" label="이메일" size='small'
                            fullWidth placeholder='abc@test.com' required />
                        <TextField type="password" name="password" label="비밀번호" size='small'
                            fullWidth required />

                        {
                            loginMutation.isError && (
                                <Typography variant='body2' color='error'>로그인에 실패했습니다.</Typography>
                            )
                        }

                        <Button type='submit' variant='contained'
                            sx={{ mt: 2, py: 1.2, borderRadius: 2, textTransform: "none", "&:hover": { backgroundColor: "#999" } }}
                            disabled={loginMutation.isPending}>
                            {loginMutation.isPending ? "로그인 중..." : "로그인"}</Button>
                    </Stack>
                </Box>
            </Paper>
        </Container>
    );
}

export default LoginPage;