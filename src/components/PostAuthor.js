import React from 'react'
import { allUsers } from '../store/usersSlice'
import { useSelector } from 'react-redux/es/exports'

export default function PostAuthor({userId}) {

    const users = useSelector(allUsers)
    const author = users.find(user => user.id == userId)
  return (
    <div>
        Author: {author?.name ?? 'Unknown'}
    </div>
  )
}
