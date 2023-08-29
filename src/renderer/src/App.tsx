import CookiesView from './components/CookiesView'
import MenuBar from './components/MenuBar'

function App(): JSX.Element {
  return (
    <div className="container">
      <MenuBar />
      <CookiesView />
    </div>
  )
}

export default App
