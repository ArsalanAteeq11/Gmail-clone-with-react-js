import React, { useEffect, useState } from 'react'
import Message from './Message'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'
import { useDispatch, useSelector } from 'react-redux'
import { setEmails } from '../redux/appSlice'
import Sent from './Sent'

const Messages = () => {
  const {searchText,emails} = useSelector(store=>store.app)
  const [tempEmails,setTempEmails] = useState(emails)
  const dispatch = useDispatch()

  useEffect(()=>{
    const q = query(collection(db,"emails"),orderBy('createdAt','desc'))
    const unsubscribe = onSnapshot(q,(snapshot)=>{
      const allEmails = snapshot.docs.map((doc)=>({...doc.data(),id:doc.id}))
      dispatch(setEmails(allEmails))
    })

    return()=>{
      unsubscribe();
    }
  },[])

  useEffect(()=>{
    const FilteredEmails = emails?.filter((email)=>{
      return email?.subject?.toLowerCase().includes(searchText.toLowerCase()) || email?.recipients?.toLowerCase().includes(searchText.toLowerCase()) || email?.message?.toLowerCase().includes(searchText.toLowerCase())
    })
    setTempEmails(FilteredEmails)

  },[searchText,emails])
  return (
    <div>
      {tempEmails && tempEmails?.map((email)=><Message key={email.id} email={email}/>)}
      
    </div>
  )
}

export default Messages