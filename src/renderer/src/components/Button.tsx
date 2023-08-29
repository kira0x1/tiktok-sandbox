interface Props {
  label: string
}

function Button({ label }: Props): JSX.Element {
  function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault()
  }
  return (
    <button className="px-16 py-3 rounded-sm bg-slate-500 mx-1 text-slate-100 hover:bg-slate-400" onClick={handleClick}>
      <div className="text-xl">{label}</div>
    </button>
  )
}

export default Button
