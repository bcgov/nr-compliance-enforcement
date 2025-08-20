import { Footer, Header } from "@components/containers/layout";
import { Link, useLocation } from "react-router-dom";

type Props = {
  url: string;
};

const Redirect: React.FC<Props> = ({ url }) => {
  const location = useLocation();

  const fullURL = url + location.pathname + location.search + location.hash;

  return (
    <div className="comp-app-container">
      <Header />

      <div className="error-container">
        <div>
          <p>Our application has moved to a new server.</p>
          <p>Please update your bookmarks and visit us at our new location:</p>
          <b>
            <Link
              to={fullURL}
              style={{ marginLeft: "2em" }}
            >
              Click here to go to the new site
            </Link>
          </b>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Redirect;
