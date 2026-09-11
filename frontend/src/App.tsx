import { Route, Routes } from "react-router-dom"

import { HomePage } from "./pages/Home/HomePage"
import { RestaurantPage } from "./pages/Restaurant/RestaurantPage"
import { CartPage } from "./pages/Cart/CartPage"

export function App() {

  return(
    <Routes>
      <Route path="/"  element={<HomePage/>}/>
      <Route path="/restaurants/:id" element={<RestaurantPage/>}/>
      <Route path="/cart" element={<CartPage/>} />
    </Routes>
  )
}