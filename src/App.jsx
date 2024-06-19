import { useEffect, useState } from "react"
import { getDatabase, push, ref, set,onValue,remove, update } from "firebase/database"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { IoIosAddCircle } from "react-icons/io";
import { GrUpdate } from "react-icons/gr";


function App() {
  let [text,setText] = useState("")
  let [arr,setArr] = useState([])
  const[isBtn,setIsBtn] = useState(true)
  const[allInfo,setAllInfo] =useState("")
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
      toast.error('Please enter your text', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
    }
    console.log(text);
  }

  // firebase read operation

  useEffect(()=>{

    const TodoRef = ref(db, 'new_name' );
    onValue(TodoRef, (snapshot) => {
      let array = []
      snapshot.forEach((item) => {              // item.val()= firebase er value return korbe
        array.push({...item.val(), id: item.key})  // item.key = firebase er unique id gula always key er modde pabo
      })
      setArr(array);
    });
  },[])
  
  // firebase remove operation
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
  
  // firebase Edit operation
  let HandleEdit = (Editinfo) => {
    setText(Editinfo.myText)
    setIsBtn(false)
    setAllInfo(Editinfo);
  }
  // firebase Update operation
  let handleUpdate = () => {
    setIsBtn(true)
    update(ref(db,'new_name/' + allInfo.id),{
      myText:text,
    }).then(()=>{
      toast.success('Replace successfully', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
        setText("")
    })
  }
  return (
    <div className="main">
      <ToastContainer />
      <h1>Todo List</h1>
      <div className="text_area">
        <input onChange={HandleInput} type="text" name="text" value={text} placeholder="enter text" />
        { isBtn 
          ?
          <button onClick={HandleSubmit}> <IoIosAddCircle /> </button>
          :
          <button onClick={handleUpdate}> <GrUpdate /> </button>
        }
      </div>
      <div className="ouput">
        <ul>
          {arr.map((item,index) => (
            <li key={index}>{item.myText} <button onClick={() => HanldeRemove (item.id)}>Remove</button> <button onClick={()=> HandleEdit (item)}>Edit</button></li>
          ))}
        </ul>
      </div>
      
    </div>
  )
}

export default App
