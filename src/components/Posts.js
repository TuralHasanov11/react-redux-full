import { formatDistanceToNow, parseISO } from 'date-fns';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addPost, allPosts, createPost, fetchPosts, postsError, postsStatus, reactionAdded } from '../store/postsSlice'
import { allUsers } from '../store/usersSlice';
import PostAuthor from './PostAuthor';

const reactionEmoji = {
    thumbsUp: '👍',
    wow: '😮',
    heart: '❤️',
    rocket: '🚀',
    coffee: '☕'
}

export default function Posts() {

    const posts = useSelector(allPosts)
    const users = useSelector(allUsers)
    const status = useSelector(postsStatus)
    const error = useSelector(postsError)
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [userId, setUserId] = useState('')
    const [addRequestStatus, setAddRequestStatus] = useState('idle')
    const dispatch = useDispatch()

    useEffect(()=>{
        if(status === 'idle'){
            dispatch(fetchPosts())
        }
    }, [status, dispatch])

    const formIsValid = [title, body, userId].every(Boolean) && addRequestStatus === 'idle'

    function onFormSubmit(e){
        e.preventDefault()

        if(formIsValid){
            try {
                setAddRequestStatus('pending')
                dispatch(createPost({title, body, userId})).unwrap()
                setTitle('')
                setBody('')
                setUserId('')
            } catch (error) {
                console.log('error')
            } finally{
                setAddRequestStatus('idle')
            }
        }
    }

    let result = ''
    if(status === 'loading'){
        result = <p>"Loading..."</p>;
    }else if (status === 'succeeded') {
        const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))
        result = orderedPosts.map(post =>   
            <div key={'post'+post.id}>
            <h5>{post.title}</h5>
            <h6><PostAuthor userId={post.userId}/></h6>
            <h6>{formatDistanceToNow(parseISO(post?.date)) + ' ago' ?? ''}</h6>
            {
                Object.entries(reactionEmoji).map(([name, emoji]) => (<button
                    key={'emoji'+name}
                    type="button"
                    className="reactionButton"
                    onClick={() =>
                        dispatch(reactionAdded({ postId: post.id, reaction: name }))
                    }
                >
                    {emoji} {post.reactions[name]}
                </button>)) 
            }
            <p>{post.body.substring(0, 100)}...</p>
        </div>)
    } else if (status === 'failed') {
        result = <p>{error}</p>;
    }

  return (
    <section>
        <h3>Posts</h3>

        <form onSubmit={onFormSubmit}>
            <fieldset>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
                <input type="text" value={body} onChange={e => setBody(e.target.value)} />
                <select value={userId} onChange={e => setUserId(e.target.value)}>
                    <option value=""></option>
                    {users.map(user => 
                        <option key={'user'+user.id} value={user.id}>
                            {user.name}
                        </option>
                    )}
                </select>
                <button type='submit'>Add</button>
            </fieldset>
        </form>
        
        {result}
    </section>
  )
}
