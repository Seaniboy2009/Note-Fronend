import axios from 'axios'
import { APIURL } from '../api/APIURL';
import React, { useEffect, useState } from 'react'
import style from '../styles/ListPage.module.css'
import { useParams } from "react-router-dom"

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';

const ListDetailPage = () => {
    const { id } = useParams()
    const [list, setList] = useState({ results: []})
    const [items, setItems] = useState({ results: []})
    const [listItems, setListItems] = useState({ results: []})
    const [hasLoaded, setHasLoaded] = useState(false)

    useEffect(() => {
        const getLists = async () => {
            console.log('Get list detail called')
            const [ {data: list}, {data: items}, {data: listitems}] = await Promise.all([
                axios.get(`${APIURL}/api/list/${id}`),
                axios.get(`${APIURL}/api/listitem/`),
                axios.get(`${APIURL}/api/listitem/?list=${id}`)
            ])
            console.log(list, items, listitems)
            setList(list)
            setItems(items)
            setListItems(listitems)
            setHasLoaded(true)
        }

        const timer = setTimeout(() => {
            getLists()
        }, 1000)

        setHasLoaded(false)
    

        return () => {
            clearTimeout(timer)
        }

    }, [])

  return (
    <div>
        {hasLoaded ? (
            <>
            {console.log(list, items, listItems)}
            <p>{list.id}</p>
            <p>{list.title}</p>
            {items.results.map((item, index) => (
                <>
                <p>{item.id}</p>
                <p>{item.content}</p>
                </>
            ))}
            {/* <Row key={list.results.id} className={style.List}>
                <Col>
                    <h3 className={style.ListDetails}># {list.results.id}</h3>
                </Col>
                <Col>
                    <h3 className={style.ListDetails}>List: {list.results.id}</h3>
                </Col>
                <Col>
                    <i className='fa-solid fa-bars'/>
                </Col>
            </Row> */}
            </>
        ) : ('Not loaded')}


    </div>
  )
}

export default ListDetailPage