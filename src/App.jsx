import { useEffect, useState } from "react"
import { getDatabase, push, ref, set,onValue,remove } from "firebase/database"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 


function App() {
  let [text,setText] = useState("")
  let [arr,setArr] = useState([])
  const db = getDatabase();

  let HandleInput = (e) => {
    setText(e.target.value)
  }

  // firebase write operation

  let HandleSubmit = () => {
    if (text !== '') {
      set(push(ref(db, 'names' )), {
        myText: text,
      });
      setText("")
      set(push(ref(db, 'new_name' )), {
        myText: text,
      }).then(()=>{
        toast.success('Item create successfully', {
          position: "top-right",
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
    console.log(text);
  }

  // firebase read operation

  useEffect(()=>{

    const TodoRef = ref(db, 'new_name' );
    onValue(TodoRef, (snapshot) => {
      let array = []
      snapshot.forEach((item)=>{              // item.val()= firebase er value return korbe
        array.push({...item.val(), id: item.key})  // item.key = firebase er unique id gula always key er modde pabo
      })
      setArr(array);
    });
  },[])
  
  let HanldeRemove = (Removeid)=> {
    remove(ref(db,'new_name/' + Removeid)).then(()=>{
      toast.error('Item remove successfully', {
        position: "top-right",
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
  let HandleEdit = (Editinfo) =>{
    setText(Editinfo.myText)
    // console.log(Editinfo.myText.value);
  }
  return (
    <>
      <ToastContainer />
      <input onChange={HandleInput} type="text" name="text" value={text} placeholder="enter text" />
      <button onClick={HandleSubmit}>Submit</button>
      <ul>
        {arr.map((item,index)=>(
          <li key={index}>{item.myText} <button onClick={()=>HanldeRemove (item.id)}>Remove</button> <button onClick={()=> HandleEdit (item)}>Edit</button></li>
        ))}
      </ul>
      
    </>
  )
}

export default App
