import { Color } from "../constants/Colors"

interface SepProps {
  color?: Color;
  className?: string
}

export default function Sep({color= Color.ORANGE, className=''}: SepProps) {
  const separatorAttr = `border-s-[${color}]`
    return (
        <hr className={`${separatorAttr} w-6/10 ${color} ${className}`}/>
    )

}