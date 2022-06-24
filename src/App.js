import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Container } from "@material-ui/core";
import Header from "./Components/Header/Header.js";
import SimpleBottomNavigation from "./Components/MainNav.js";
import Trending from "./Pages/Trending/Trending.js";
import Search from "./Pages/Search/Search.js";
import WatchList from "./Pages/WatchList/WatchList.js";
import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <div className="app">
        <Container>
          <Routes>
            <Route path="/welcome" element={<Trending />} />
            <Route path="/search" element={<Search />} />
            <Route path="/watchlist" element={<WatchList />} />
          </Routes>
        </Container>
      </div>
      <SimpleBottomNavigation />
    </BrowserRouter>
  );
};

export default App;
