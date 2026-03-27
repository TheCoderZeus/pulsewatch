export function Cursor({ color, name }: { color: string, name: string }) {
  return (
    <div className="relative inline-flex items-start pointer-events-none drop-shadow-md z-50">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
        <path d="M4 4L11.07 20.97L13.58 13.58L20.97 11.07L4 4Z" fill={color} stroke="white" strokeWidth="2" strokeLinejoin="round"/>
      </svg>
      <div 
        className="px-2.5 py-1 text-[11px] font-medium text-white rounded-full shadow-lg ml-1 mt-4 whitespace-nowrap" 
        style={{ backgroundColor: color }}
      >
        {name}
      </div>
    </div>
  )
}
