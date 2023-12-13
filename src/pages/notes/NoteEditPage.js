import React, { useEffect } from 'react'
import {axiosInstance} from '../../api/axiosDefaults';
import { useParams } from "react-router-dom"

const NoteEditPage = () => {

    const { id } = useParams()

    useEffect(() => {
        const handleGet = async () => {
            try {
                const {data} = await axiosInstance.get(`/api/lists/${id}`)
                console.log(data)
            } catch (error) {
                
            }
        }
    
    })

  return (
    <div>NoteEditPage</div>
  )
}

export default NoteEditPage