import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from "@/components/ui/button";

function App() {

  return (
    <>
      <div>
          <h1 class="bg-red-500 text-3xl font-bold underline">
           Hello world!
          </h1>
          <Button variant="default">Let’s go ✨</Button>
      </div>
    </>
  )
}

export default App
