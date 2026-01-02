import { Box, Button, Stack, Typography } from '@mui/material';
import React from 'react';

function PostFormImage({ imageName, onChangeImage, uploading }) {
    return (
        <Box>
            <Stack direction='row' alignItems='center' spacing={2} mb={1}>
                <Button variant='outlined' component='label' disabled={uploading}>
                    이미지 선택
                    <input type='file' hidden accept='image/*' onChange={onChangeImage} />
                </Button>

                {!uploading && imageName && (
                    <Typography variant='body2' color='#666'>
                        {imageName}
                    </Typography>
                )}
            </Stack>
        </Box >
    );
}

export default PostFormImage;