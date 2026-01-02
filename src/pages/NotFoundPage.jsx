import { Box, Button, Container, Typography } from '@mui/material';
import { Link } from 'react-router';

function NotFoundPage() {
    return (
        <Container maxWidth='small'>
            <Box sx={{ m: 4 }}>
                <Typography variant='h2' sx={{ fontSize: '3rem', fontWeight: 700, color: 'maroon' }}>
                    페이지를 찾을 수 없습니다.
                </Typography>
                <Button component={Link} to="/posts" variant='contained'>홈으로 이동</Button>
            </Box>
        </Container>
    );
}

export default NotFoundPage;