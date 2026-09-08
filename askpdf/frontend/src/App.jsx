import React, { useState } from 'react'
import './App.css'

function App() {
   const [file,setFile] = useState(null);
   function handleChange(e){
    const selectedFile = e.target.files[0];
    if(!selectedFile) return;
    if(selectedFile.type !== "application/pdf"){
      alert("send a pdf file");
      return;
    }
    setFile(selectedFile);  
  }
  async function handleUpload(){
    if(!file){
      alert("Please select a PDF file first");
      return;
    }
    const formData = new FormData();
    formData.append("pdf",file);
    try{
    const response = await fetch("http://localhost:8000/upload", {
       method: "POST",
       body: formData
      });
     const data = await response.json();
    console.log(data);
    }
    catch(error){
      console.log("error occured",error);
    }
  }
  return (
    <div className="app">
      <h1>AskPDF</h1>
      <h3>Upload PDF and Ask Doubts.</h3>
      <input type="file" className='file' onChange={handleChange} accept='.pdf'/>
      { file && (
        <div>
          <p>FileName: {file.name}</p>
          <p>FileSize: {(file.size/(1024*1024)).toFixed(2)}MB</p>
          <button onClick={handleUpload}>Upload Pdf</button>
        </div>
      )
       }
    </div>
  )
}

export default App