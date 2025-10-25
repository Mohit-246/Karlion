import { useState } from "react";
import "./App.css";
import Hero from "./components/Hero";
import Header from "./components/Header";


function App() {
  return (
    <>
    <div>
        <Header />
        <main>
          <Hero />
        </main>
        </div>
    </>
  );
}

export default App;
