import ReactDOM from "react-dom"
import App from "./App"
import {mergeStyles} from "@fluentui/react"

import {initializeIcons} from "@fluentui/font-icons-mdl2"
import { HashRouter } from "react-router-dom"
initializeIcons()

// Inject some global styles
mergeStyles({
  ":global(body,html,#root)": {
    margin: 0,
    padding: 0,
    height: "100vh",
  },
})

ReactDOM.render(<HashRouter><App /></HashRouter>, document.getElementById("root"))
