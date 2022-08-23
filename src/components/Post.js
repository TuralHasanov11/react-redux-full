import React from 'react'
import { postSingle } from '../store/postsSlice'
import { useSelector } from "react-redux";
import PostAuthor from './PostAuthor';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Link, useParams } from 'react-router-dom';

export default function Post() {

    const {postId} = useParams()

    const post = useSelector(state => postSingle(state, Number(postId)))
    if (!post) {
        return (
            <section>
                <h2>Post not found!</h2>
            </section>
        )
    }

    return (
        <article>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <div className="postCredit">
                <Link to={`/posts/${post.id}/edit`}>Edit Post</Link>
                <PostAuthor userId={post.userId} />
                <h6>{formatDistanceToNow(parseISO(post?.date)) + ' ago' ?? ''}</h6>
            </div>
        </article>
    )
}
