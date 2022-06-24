import "./Header.css";

const Header = () => {
  return (
    <span className="header" onClick={() => window.scroll(0, 0)}>
      <span className="emoji" role="img" aria-label="movie">
        ️️️️️️📽️
      </span>
      <span style={{ padding: "12px" }}>Movie Tracker</span>
      <span className="emoji" role="img" aria-label="popcorn">
        ️️️️️️🍿
      </span>
    </span>
  );
};

export default Header;
