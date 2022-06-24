import axios from "axios";
import { useState, useEffect } from "react";
import SingleContent from "../../Components/SingleContent/SingleContent";
import CustomPagination from "../../Components/Pagination/CustomPagination.js";
import "./WatchList.css";

const listID = "8175745";
const api_host = "https://api.themoviedb.org";
const accessToken = process.env.REACT_APP_ACCESS_TOKEN;

const WatchList = () => {
  const [content, setContent] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const options = {
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-Type": "application/json"
    }
  };

  const getList = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      const { data } = await axios.get(
        `${api_host}/4/list/${listID}?&page=${page}`,
        options
      );
      setContent(data.results);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    window.scroll(0, 0);
    getList();
    //eslint-disable-next-line
  }, [page]);

  return (
    <div>
      <div className="pageTitle">WatchList</div>
      <div className="watchlist">
        {content.length > 0 ? (
          content.map((c) => (
            <SingleContent
              key={c.id}
              id={c.id}
              poster={c.poster_path}
              title={c.title || c.name}
              date={c.first_air_date || c.release_date}
              media_type={c.media_type}
              vote_average={c.vote_average}
            />
          ))
        ) : (
          <h3>Watchlist empty</h3>
        )}
      </div>
      {totalPages > 1 && (
        <CustomPagination setPage={setPage} numOfPages={totalPages} />
      )}
    </div>
  );
};

export default WatchList;
