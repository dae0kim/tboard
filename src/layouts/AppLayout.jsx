// header + menu + Outlet
import { Link, Outlet, useNavigate } from 'react-router'
import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from '@mui/material'
import { BiSolidPlanet } from "react-icons/bi"
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMe } from '../hooks/useMe';
import { clearAuth } from '../api/authApi';

function AppLayout() {

    const queryClient = useQueryClient();
    const { data: me, isLoading: meIsLoading } = useMe();
    const navigate = useNavigate();

    // 로그아웃 이벤트 핸들러
    const handleLogout = () => {
        clearAuth();
        queryClient.setQueryData(["me"], null); // 즉시 업데이트
        navigate('/posts');
    }

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#b6b1b168' }}>
            <AppBar position='fixed'>
                <Container maxWidth='md'>
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box component={Link} to="/posts" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#fff' }}>
                            {/* font-icon */}
                            <Box sx={{
                                width: 40, height: 40,
                                borderRadius: '50%',
                                bgcolor: '#000',
                                display: 'grid',        // 바둑판 형태의 레이아웃 스타일
                                placeItems: 'center',   // grid일때만 적용 가능한 x,y 중앙 정렬
                                mr: 1.5
                            }}>
                                <BiSolidPlanet style={{ color: '#f2de08ff', fontSize: 20, backgroundColor: '#000' }} />
                            </Box>
                            <Typography variant='h6' component="h1" sx={{ fontWeight: 700 }}>
                                게시판
                            </Typography>
                        </Box>
                        {/* 회원가입 / 로그인 */}
                        <Stack direction="row" alignItems="center">
                            {!meIsLoading && me ? (
                                <Button variant='text' sx={{ color: '#fff' }} onClick={handleLogout}>로그아웃</Button>
                            ) : (
                                <>
                                    <Button component={Link} to="/auth/login" variant='text'
                                        sx={{ color: '#fff' }}>로그인</Button>
                                    <Button component={Link} to="/auth/register" variant='text'
                                        sx={{ color: '#fff' }}>회원가입</Button>
                                </>
                            )}
                        </Stack>
                    </Toolbar>
                </Container>
            </AppBar>

            <Container component="main" maxWidth='md' sx={{ pt: 10, mb: 4 }}>
                <Outlet />
            </Container>
        </Box>
    );
}

export default AppLayout;