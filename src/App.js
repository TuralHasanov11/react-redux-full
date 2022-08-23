import { Route, Routes, Navigate } from 'react-router-dom';
import Counter from './components/Counter';
import Layout from './components/Layout';
import Posts from './components/Posts';
import Post from './components/Post';
import PostEdit from './components/PostEdit';
import TodoList from './components/Todos';



function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<Posts />} />
        <Route path='todos' element={<TodoList />} />
        <Route path="posts">
          <Route path=":postId" element={<Post />} />
          <Route path=":postId/edit" element={<PostEdit />} />
        </Route>
        <Route path='*' element={<Navigate to="/" replace/>} />
      </Route>
    </Routes>
  );
}

export default App;
