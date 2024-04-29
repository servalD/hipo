import React from 'react';
import Navbar from "./component/Navbar";
import TableCo from "./component/Table";
import Form from "./component/Form";
import Form_up from "./component/Form_up";

function App() {
let url = document.documentURI.split("/")[3];
  return (
    <div className="App">
      <header className="App-header">
        <Navbar />
          {url === "company" ?
              <>
                  <TableCo type="company"/>
                  <div style={{display: "flex", gap: "30px"}}>
                  <Form type="company"/>
                  <Form_up type="company"/>
                      </div>
              </>

              :
              <>
                  <TableCo type="vehicle"/>
                  <div style={{display: "flex", gap: "30px"}}>
                      <Form type="vehicle"/>
                      <Form_up type="vehicle"/>
                  </div>
              </>
          }
      </header>
    </div>
  );
}

export default App;
