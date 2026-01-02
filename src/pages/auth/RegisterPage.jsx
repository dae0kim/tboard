import { Container, TextField, Paper, Typography, Box, Stack, Button } from '@mui/material'
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { register } from '../../api/authApi';
import { useNavigate } from 'react-router';

function RegisterPage() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        nickname: "",
        password: "",
        rePassword: ""
    });

    const registerMutation = useMutation({
        mutationFn: register,
        onSuccess: () => navigate("/posts")
    });

    // 이벤트 핸들러
    const handleChange = (evt) => {
        const { name, value } = evt.target;
        // 이전 상태 복사 후 변경된 필드만 업데이트
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    const handleSubmit = (evt) => {
        evt.preventDefault();

        if (form.password !== form.rePassword) {
            alert("비밀번호 재확인");
            return;
        }

        registerMutation.mutate({
            email: form.email.trim(),
            password: form.password,
            nickname: form.nickname.trim()
        });
    }

    return (
        <Container maxWidth="small">
            <Paper sx={{ width: '100%', borderRadius: 3, px: 4, py: 3, boxShadow: '0 16px 45px rgba(0,0,0,0.06)' }}>
                {/* 상단 제목 */}
                <Typography variant='h5' sx={{ fontWeight: 600, fontSize: 24 }}>
                    회원가입
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField type="email" name="email" label="이메일" size='small'
                            fullWidth placeholder='abc@test.com' required
                            value={form.email} onChange={handleChange} />
                        <TextField type="text" name="nickname" label="별명"
                            size='small' fullWidth placeholder='별명' required
                            value={form.nickname} onChange={handleChange} />
                        <TextField type="password" name="password" label="비밀번호" size='small'
                            fullWidth required value={form.password} onChange={handleChange} />
                        <TextField type="password" name="rePassword" label="비밀번호 확인" size='small'
                            fullWidth required value={form.rePassword} onChange={handleChange} />

                        {
                            registerMutation.isError && (
                                <Typography variant='body2' color='error'>
                                    회원가입 실패
                                </Typography>
                            )
                        }


                        <Button type='submit' variant='contained'
                            sx={{ mt: 2, py: 1.2, borderRadius: 2, textTransform: "none", "&:hover": { backgroundColor: "#999" } }}
                            disabled={registerMutation.isPending}>
                            {registerMutation.isPending ? "회원가입 중..." : "회원가입"}</Button>
                    </Stack>
                </Box>
            </Paper>
        </Container>
    );
}

export default RegisterPage;