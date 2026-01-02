import { Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Link } from 'react-router'
import dayjs from 'dayjs'

function PostTable({ posts }) { // props.posts로 사용해야하는걸 구조분해해서 posts로 사용

    // 받아온 데이터 없을 경우 처리
    const lists = posts ? posts : [];

    return (
        <TableContainer>
            <Table>
                {/* 테이블 머릿말 */}
                <TableHead>
                    <TableRow sx={{
                        '& th': { // th 요소에도 스타일 적용
                            fontSize: 14,
                            fontWeight: 600,
                            letterSpacing: '0.3rem'
                        }
                    }}>
                        <TableCell align='center' width='80'>번호</TableCell>
                        <TableCell align='center'>제목</TableCell>
                        <TableCell align='center' width='160'>작성자</TableCell>
                        <TableCell align='center' width='160'>조회수</TableCell>
                        <TableCell align='center' width='160'>작성일</TableCell>
                    </TableRow>
                </TableHead>
                {/* 테이블 본문 */}
                <TableBody>
                    {lists.map(({ id, title, readCount, createAt, author }) => (
                        <TableRow key={id} hover>
                            <TableCell align='center'>{id}</TableCell>
                            <TableCell>
                                <Typography component={Link} to={`/posts/${id}`}
                                    sx={{
                                        textDecoration: 'none', color: 'inherit',
                                        '&:hover': { color: 'blue' }
                                    }}>
                                    {title}
                                </Typography>
                            </TableCell>
                            {/* 작성자 */}
                            <TableCell align='center'>
                                {author?.nickname && author.nickname !== '작성자' ? (
                                    <Chip label={author.nickname} size='small'
                                        sx={{
                                            background: 'blue', borderRadius: 999, px: 2,
                                            fontWeight: 500, color: '#fff', height: 30
                                        }} />
                                ) : (
                                    <Typography sx={{ fontSize: 14 }}>{author?.nickname || '??'}</Typography>
                                )}
                            </TableCell>
                            <TableCell align='center'>{readCount}</TableCell>
                            <TableCell align='center'>
                                {/* {new Date(createAt).toLocaleDateString()} */}
                                {dayjs(createAt).format('YY년 MM월 DD일 HH:mm')}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default PostTable;