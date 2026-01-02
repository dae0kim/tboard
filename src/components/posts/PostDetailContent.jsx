import { Box, Divider, Typography } from '@mui/material';
import React from 'react';

function PostDetailContent({ post, apiBase }) {
    const { content, imageUrl, title } = post;
    const imageSrc = imageUrl ? `${apiBase}${imageUrl}` : null;

    return (
        <>
            {imageSrc && (
                <Box sx={{ mb: 1.5 }}>
                    <img src={imageSrc} alt={title} style={{ maxWidth: 400, display: 'block' }} />
                </Box>
            )}
            <Typography sx={{ lineHeight: 1.6, p: 1.8 }}>
                {content}
            </Typography>

            <Divider sx={{ mb: 2.5 }} />
        </>
    );
}

export default PostDetailContent;