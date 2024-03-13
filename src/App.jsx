import { useState } from "react"
import { getDatabase, push, ref, set } from "firebase/database";  


function App() {
  let [text,setText] = useState("")
  const db = getDatabase();

  let HandleInput = (e) => {
    setText(e.target.value)
  }
  let HandleSubmit = () => {
    if (text !== '') {
      set(push(ref(db, 'names' )), {
        Ourtext: text,
      });
      set(push(ref(db, 'new_name' )), {
        Ourtext: text,
      });
    } else {
      console.log("please enter your text");
    }
    console.log(text);
  }
  return (
    <>
      <input onChange={HandleInput} type="text" placeholder="enter text" />
      <button onClick={HandleSubmit}>Submit</button>
    </>
  )
}

export default App
