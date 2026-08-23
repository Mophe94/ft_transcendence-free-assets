import { ChatColor } from "../constants/Colors"

interface SepProps {
  color?: ChatColor;
  className?: string
}

export default function Sep({color= ChatColor.ORANGE, className=''}: SepProps) {
  const separatorAttr = `border-s-[${color}]`
    return (
        <hr className={`${separatorAttr} w-6/10 ${color} ${className}`}/>
    )

}