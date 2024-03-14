import React, { useEffect, useState } from 'react'
import { getDatabase, push, ref, set,onValue,remove,} from "firebase/database";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const About = () => {
    let [write,setWrite] = useState("")
    let [array,setArray] = useState([])
    const db = getDatabase();
    

    let HandleInput = (e) =>{
        setWrite(e.target.value)
    }
    // firebase write operation
    let HandleSubmit = () => {
        console.log(write);
        if (write !== '') {
            set(push(ref(db, 'about')), {
                mytext: write,
            }).then(()=>{
                toast.success('Submit successfully', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            })
        } else {
            console.log("please enter your text");
        }
    }
    // firebase read operation
    useEffect(()=>{
        const todoRef = ref(db, 'about' );
        onValue(todoRef, (snapshot) => {
        let arr = []
        snapshot.forEach((item)=>{
            arr.push({...item.val(), id: item.key} );
        })
        setArray(arr);
        });
    },[])
    let HandleDelete = (Deleteid) => {
        remove(ref(db,'about/' + Deleteid)).then(()=>{
            toast('Delete Successfull', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                });
        })
    }
    let HandleEdit = (Editid)=> {
        setWrite(Editid.mytext)
        console.log(Editid.mytext);
        
    }

    return (
    <>
        <ToastContainer/>
        <input onChange={HandleInput} type="text" value={write}  placeholder='enter your text'/>
        <button onClick={HandleSubmit}>Submit</button>
        <ul>
            {array.map((item,index)=>(
                <li key={index}>{item.mytext}<button onClick={()=> HandleDelete (item.id)}>delete</button> <button onClick={()=> HandleEdit (item)}>Edit</button></li>
            ))}
        </ul>
    </>
  )
}

export default About