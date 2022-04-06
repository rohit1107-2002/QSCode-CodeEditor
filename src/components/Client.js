import React from 'react'

const Client = ({username}) => {
  return (
    <div className='client'>
        <p className='userName'>&#9679;&nbsp;{username}</p>
    </div>
  ) 
}

export default Client;