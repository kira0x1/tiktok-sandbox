import MenuBtn from './Button'

function MenuBar(): JSX.Element {
  // const [showCookies, setCookies] = React.useState(false)

  return (
    <div className="menu-bar">
      <MenuBtn label="Cookies" />
      <MenuBtn label="Login" />
      <MenuBtn label="Settings" />
    </div>
  )
}

export default MenuBar
