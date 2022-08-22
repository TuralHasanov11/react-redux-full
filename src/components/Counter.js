import React from 'react'
import { decrement, increment, reset, incrementByAmount } from '../store/slice'
import { useDispatch, useSelector } from "react-redux";

export default function Counter() {
    
    const count = useSelector(state => state.counter.count)
    const dispatch = useDispatch()


  return (
    <section>
        <h5>{count}</h5>
        <button onClick={()=>dispatch(increment())}>
            +
        </button>
        <button onClick={()=>dispatch(incrementByAmount(5))}>
            + 5
        </button>
        <button onClick={()=>dispatch(decrement())}>
            -
        </button>
        <button onClick={()=>dispatch(reset())}>
            Reset
        </button>
    </section>
  )
}
