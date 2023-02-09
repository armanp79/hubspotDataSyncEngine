import {useState} from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import axios from 'axios'
const serverURL = 'http://localhost:4000'


interface ContactProps {
    data: {
        id : string,
        archived: boolean,
        createdAt: string,
        properties : {
            createdate: string,
            email: string,
            firstname: string,
            hs_object_id: string,
            lastmodifieddate: string,
            lastname: string,
        },
        updatedAt: string
    }
}


function Contact(props: ContactProps){
    var contactInfo = props.data
    return (
        <div style={{margin: "10px", padding: "5px", background: 'grey'}}>
            <p style={{color: 'black'}}><b>id:</b> {contactInfo.id}</p>
            <p style={{color: 'black'}}><b>First Name:</b> {contactInfo.properties.firstname}</p>
            <p style={{color: 'black'}}><b>Last Name:</b> {contactInfo.properties.lastname}</p>
            <p style={{color: 'black'}}><b>Email:</b> {contactInfo.properties.email}</p>
            <p style={{color: 'black'}}><b>Archived:</b> {contactInfo.archived.toString()}</p>
            <p style={{color: 'black'}}><b>Created At:</b> {contactInfo.createdAt}</p>
            <p style={{color: 'black'}}><b>Created Date:</b> {contactInfo.properties.createdate}</p>
            <p style={{color: 'black'}}><b>Last Modified Date:</b> {contactInfo.properties.lastmodifieddate}</p>
            <p style={{color: 'black'}}><b>Updated At:</b> {contactInfo.updatedAt}</p>
            <p style={{color: 'black'}}><b>hs_object_id:</b> {contactInfo.properties.hs_object_id}</p>
        </div>
    )

}




export default function Home() {
    const [name, setName] = useState('');
    const [userInfo, setUserInfo] = useState([]);

    var onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        axios.get(serverURL + `/user/info/${name}`)
            .then((response) => {
                setUserInfo(response.data)
            })
            .catch((err) => {console.log('Error fetching user information: ', err)})
    }

    var onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setName(event.target.value)
    }

    
    var contacts = userInfo.length ? userInfo.map((el, index) => <Contact key={index} data={el} />) : <div>Once you search for a user, their Hubspot contacts will appear here!</div>
    return (
        <>
        <Head>
            <title>Data Sync Engine</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
            <h1>Enter User's Name To View Hubspot Contacts</h1>
            <form onSubmit={onSubmit}>
                <div>
                    <input
                        name='name'
                        id='name'
                        type='text'
                        placeholder='name'
                        onChange={onChange}
                        required
                    />
                    <button type='submit'>Search</button>
                </div>
            </form>
            <div style={{display: "flex"}}>
                {
                    contacts
                }
            </div>
        </main>
        </>
    )
}
