import { Footer, Header } from "@components/containers/layout";
import { Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";

type Props = {
  url: string;
};

const Redirect: React.FC<Props> = ({ url }) => {
  const location = useLocation();

  const fullURL = url + location.pathname + location.search + location.hash;

  return (
    <div className="comp-app-container">
      <Header />

      <div className="redirect-container">
        <i
          className="bi bi-globe"
          style={{ fontSize: "x-large" }}
        ></i>
        &nbsp;
        <i
          className="bi bi-chevron-right"
          style={{ fontSize: "large" }}
        ></i>
        <p>We've moved to a new web address</p>
        <p>Please visit the new location and update your bookmarks.</p>
        <b>
          <Button
            variant="primary"
            size="sm"
            title="Go to the new NatComplaints site"
            onClick={() => {
              window.location.href = fullURL;
            }}
          >
            <i className="bi bi-box-arrow-up-right"></i>
            <span>Go to the new NatComplaints site</span>
          </Button>
        </b>
      </div>

      <Footer />
    </div>
  );
};

export default Redirect;
