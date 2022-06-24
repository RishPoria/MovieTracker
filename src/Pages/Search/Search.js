import { Tab, Tabs, TextField, ThemeProvider } from "@material-ui/core";
import { createTheme } from "@material-ui/core/styles";
import "./Search.css";
import { useEffect, useState } from "react";
import axios from "axios";
import CustomPagination from "../../Components/Pagination/CustomPagination";
import SingleContent from "../../Components/SingleContent/SingleContent";

const Search = () => {
  const [type, setType] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [content, setContent] = useState([]);
  const [numOfPages, setNumOfPages] = useState();

  const darkTheme = createTheme({
    palette: {
      type: "dark",
      primary: {
        main: "#fff"
      }
    }
  });

  const fetchSearch = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!searchText) {
      setContent([]);
      setNumOfPages(0);
      return;
    }
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/search/${type ? "tv" : "movie"}?api_key=${
          process.env.REACT_APP_API_KEY
        }&language=en-US&query=${searchText}&page=${page}&include_adult=false`
      );
      setContent(data.results);
      setNumOfPages(data.total_pages);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    window.scroll(0, 0);
    fetchSearch();
    // eslint-disable-next-line
  }, [searchText, type, page]);

  return (
    <div>
      <ThemeProvider theme={darkTheme}>
        <form className="search" onSubmit={(e) => fetchSearch(e)}>
          <TextField
            className="searchBox"
            label="Search"
            variant="outlined"
            onChange={(e) => setSearchText(e.target.value.trim())}
          />
        </form>
        <Tabs
          value={type}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          onChange={(event, newValue) => {
            setType(newValue);
            setPage(1);
          }}
          style={{ paddingBottom: 5 }}
        >
          <Tab style={{ width: "50%" }} label="Search Movies" />
          <Tab style={{ width: "50%" }} label="Search TV Series" />
        </Tabs>
      </ThemeProvider>
      <div className="trending">
        {content.length > 0 &&
          content.map((c) => (
            <SingleContent
              key={c.id}
              id={c.id}
              poster={c.poster_path}
              title={c.title || c.name}
              date={c.first_air_date || c.release_date}
              media_type={type ? "tv" : "movie"}
              vote_average={c.vote_average}
            />
          ))}
        {searchText && content.length === 0 && (
          <h3>No {type ? "TV Series" : "Movies"} found</h3>
        )}
      </div>
      {numOfPages > 1 && (
        <CustomPagination setPage={setPage} numOfPages={numOfPages} />
      )}
    </div>
  );
};

export default Search;
