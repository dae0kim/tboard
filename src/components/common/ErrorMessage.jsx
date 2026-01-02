export default function ErrorMessage({ message = '오류 발생' }) {
    return <p style={{ color: 'red' }}>{message}</p>
}