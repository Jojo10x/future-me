"use client";
import { useEffect, useState } from "react";
import AppRouter from "./Router";

function App() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <AppRouter />;
}

export default App;
