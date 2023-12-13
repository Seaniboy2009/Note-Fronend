import React, { useEffect, useState, useContext } from 'react'
import style from '../../styles/ListDetailPage.module.css'
import { useParams, useNavigate } from "react-router-dom"
import appStyle from '../../styles/App.module.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import {axiosInstance} from '../../api/axiosDefaults';
import Modal from 'react-bootstrap/Modal';
import Loader from '../../components/Loader';
import AuthContext from '../../contexts/AuthContext'
import { useTheme } from '../../utils/ThemeSelection';
import ListItem from '../../components/ListItem';

const ListDetailPage = () => {
    
    const navigate = useNavigate()
    const { id } = useParams()
    const [list, setList] = useState({ results: []})
    const [items, setItems] = useState({ results: []})
    const [hasLoaded, setHasLoaded] = useState(false)
    const [show, setShow] = useState(false);
    const [edit, setEdit] = useState(false)

    let {user} = useContext(AuthContext)
    const {isDarkMode} = useTheme()

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [formData, setFormData] = useState({
        list: '',
        content: '',
    });

    const { content } = formData

    const getLists = async () => {
        console.log('Get list detail called')
        const [ {data: list}, {data: items}] = await Promise.all([
            axiosInstance.get(`/api/lists/${id}`),
            axiosInstance.get(`/api/listitems/?list=${id}`)
        ])
        setList(list)
        setItems(items)
        setHasLoaded(true)
    }

    const handleCreateItem = async () => {

        const formData  = new FormData()
        formData.append('content', content)
        formData.append('list', list.id)
  
        try {
            await axiosInstance.post(`/api/listitems/`, formData)
            setFormData(prevData => ({...prevData, list: ''}))
            getLists()
            const textArea = document.getElementById("textInput")
            textArea.value = ""
        } catch (error) {
            console.log(error)
        }
    }

    const handleChange = (event) => {
        console.log('Handle change called')
        setFormData({...formData, content: event.target.value})
    }

    const handleDelete = async (e) => {
        console.log('Handle delete called')
        try {
            await axiosInstance.delete(`/api/lists/${list.id}`)
            navigate('/lists/')
        } catch (error) {
            
        }
    }

    const handleDeleteItem = async (itemToDelete) => {
        console.log('Handle delete item called')
        try {
            await axiosInstance.delete(`/api/listitems/${itemToDelete.id}`)
            getLists()
        } catch (error) {
            
        }
    }

    const toggleEditMode = () => {
        setEdit(!edit);
    }

    useEffect(() => {

        const timer = setTimeout(() => {
            getLists()
        }, 1000)

        setHasLoaded(false)

        return () => {
            clearTimeout(timer)
        }

    }, [])

    const modelShow = (
        <>
        <Modal show={show} onHide={handleClose} className={style.Modal}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>Please confirm you want to delete this list</Modal.Body>
          <Modal.Footer>
            <button className={appStyle.Button} onClick={handleClose}>
              Cancel
            </button>
            <button className={appStyle.Button} onClick={handleDelete}>
              Delete
            </button>
          </Modal.Footer>
        </Modal>
      </>
    )

  return (
    <Container className={appStyle.Container}>
        <>
            {modelShow}
        </>
    {hasLoaded ? (
        <>
            <Row>
                <Col>
                    <Link to={'/lists/'}><i className="fa-solid fa-arrow-left" /></Link>
                </Col>
                <Col xs={7}>
                    <h5>{list.title}</h5>
                </Col>
                <Col xs={2}>
                    <button onClick={handleShow} className={appStyle.Button}><i className="fa-solid fa-trash" /></button>
                    <button onClick={toggleEditMode} className={`${appStyle.Button} fa-solid fa-pen-to-square`}></button>
                    {/* <input className={isDarkMode ? appStyle.TextTest : appStyle.TextRed} type="checkbox" checked={edit} onChange={toggleEditMode} /> */}
                </Col>
            </Row>
            {edit ? (
                <Row className={style.ListContainer}>
                    <Col>
                        <textarea id="textInput" onChange={handleChange} className={style.InputArea} autofocus placeholder="Type here" rows="1"></textarea>
                    </Col>
                    <Col xs={3}>
                    <button onClick={handleCreateItem} className={appStyle.Button}>Add</button>
                    </Col>
                </Row>
            ) : null}
            {items?.results?.map((item, index) => (
                <ListItem getLists={getLists} key={index} {...item} edit={edit}/>
            ))}
        </>
        ) : (
            <Loader spinner text='Loading lists, please wait' />
        )}
    </Container>
  )
}

export default ListDetailPage