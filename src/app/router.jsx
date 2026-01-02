import { createBrowserRouter, Navigate } from "react-router";
import AppLayout from "../layouts/AppLayout";
import PostList from "../pages/posts/PostList"
import PostForm from "../pages/posts/PostForm"
import PostDetail from "../pages/posts/PostDetail"
import RegisterPage from "../pages/auth/RegisterPage";
import LoginPage from "../pages/auth/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            {
                index: true,
                // 리다이렉트 컴포넌트. "/" 접근하면 "/posts"로 자동 이동
                element: <Navigate to="posts" replace />
            },
            {
                path: 'posts',
                element: <PostList />
            },
            {
                path: 'posts/new',
                element: <PostForm mode="create" />
            },
            {
                // :id -> 콜론 사용하여 동적 파라미터
                // 추후 useParams()을 통해 id 값을 가져다 작업할 수 있음
                path: 'posts/:id',
                element: <PostDetail />
            },
            {
                path: 'posts/:id/edit',
                element: <PostForm mode="edit" />
            },
            {
                // 로그인
                path: 'auth/login',
                element: <LoginPage />
            },
            {
                // 회원가입
                path: 'auth/register',
                element: <RegisterPage />
            },
            {
                path: '*',
                element: <NotFoundPage />
            }
        ]
    }
]);