

export default function Button({pd, bg, color, text}: {pd:string, bg:string, color:string, text:string}) {
    return (
        <>
        <button className={`shadow-lg rounded-md w-40 active:shadow-sm hover:cursor-pointer ${pd} ${bg} ${color}`}>
            {text}
        </button>
        </>
    )
}