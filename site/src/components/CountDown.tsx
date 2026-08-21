import { useEffect, useState } from "react";

interface CountDownProps {
  initialTime: number;
  onComplete: () => void;
}


export default function CountDown({ initialTime = 3, onComplete =() => {}}: CountDownProps ){
  const [count, setCount] = useState(initialTime);
  useEffect(() => {
    if (count === 0) {
      onComplete();
      return;
    }
    const timer = setInterval(() => {
      setCount((prev)=> prev -1);
    }, 1000)
    return () => clearInterval(timer);

  }, [count, onComplete]);

  return (
    
    <div className="
      absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
      text-[clamp(20rem,30vw,40rem)] font-rocker text-dark-blood [-webkit-text-stroke:3px_black] text-center"> {count}
    </div>
  );
}
