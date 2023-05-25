import { FC } from "react";

import logo from "../../../../assets/images/branding/CE-Temp-Logo.svg";
import { NavDropdown, Badge } from "react-bootstrap";

export const Header: FC = () => {

  return (
    <div className="comp-header">
      <div className="comp-header-logo">
        <img className="logo-src" src={logo} alt="logo" />
      </div>

      <div className="comp-header-content">
        <div className="comp-header-left">
          {/* <!-- future left hand content --> */}
        </div>
        <div className="comp-header-right">
          <div className="header-btn-lg pr-0">
            <div className="widget-content p-0">
              <div className="widget-content-wrapper">
                <div className="widget-content-left">
                  {/* <!-- search --> */}
                </div>
                <div className="widget-content-left">
                  <div className="item1">
                    <i className="bi bi-bell"></i>
                    <Badge bg="danger" pill className="comp-badge">
                      4
                    </Badge>
                  </div>
                </div>
                <div className="widget-content-right">
                  {/* <!-- --> */}

                  <NavDropdown
                    title={
                      <div
                        data-initials="DF"
                        className="comp-profile-avatar"
                      ></div>
                    }
                  >
                    <NavDropdown.Item href="#action/3.1">
                      Action
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">
                      Another action
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">
                      Something
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">
                      Separated link
                    </NavDropdown.Item>
                  </NavDropdown>

                  {/* <!-- --> */}
                </div>
                {/* <div className="widget-content-left  ml-3 header-user-info">
                  <div className="widget-heading">Alina Mclourd</div>
                  <div className="widget-subheading">VP People Manager</div>
                </div> */}
                {/* <div className="widget-content-right header-user-info ml-3">
                  <button
                    type="button"
                    className="btn-shadow p-1 btn btn-primary btn-sm show-toastr-example"
                  >
                    <i className="fa text-white fa-calendar pr-1 pl-1"></i>
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// export const Header: FC = () => {
//   return (
//     <Navbar className="comp-header">
//       <Container fluid className="comp-header-content">
//         <div className="comp-header-logo">
//           <div className="comp-logo-src">
//             <img src={logo} alt="logo" />
//           </div>
//         </div>

//       </Container>
//     </Navbar>
//   );
// };

/*
//-- alert badge
<div className="item1">
            <i className="bi bi-bell"></i>
            <Badge bg="danger" pill className="comp-badge">
              4
            </Badge>
          </div>

//-- profile dropdown
<NavDropdown
              title={
                <div data-initials="MS" style={{ display: "inline" }}></div>
              }
            >
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
*/

// export const Header: FC = () => {
//   return (
//     <div className="comp-header">
//       <div className="comp-header-logo">
//         <div className="comp-logo-src">
//           <img src={logo} alt="logo" />
//         </div>
//       </div>
//       <div className="comp-header-content">
//         <div className="comp-left-content">
//           {/* left left navigation content here */}
//           cow
//         </div>

//         <div className="comp-right-contnet">
//           <Row>
//             <Col>
//               {" "}
//               <i className="bi bi-bell"></i>
// <Badge bg="danger" pill className="comp-badge">
//   4
// </Badge>
//             </Col>
//             <Col>
//               <NavDropdown
//                 title={
//                   <div data-initials="MS" className="comp-profile-avatar"></div>
//                 }
//                 id="nav-dropdown"
//               >
//                 <NavDropdown.Item eventKey="4.1">Action</NavDropdown.Item>
//                 <NavDropdown.Item eventKey="4.2">
//                   Another action
//                 </NavDropdown.Item>
//                 <NavDropdown.Item eventKey="4.3">
//                   Something else here
//                 </NavDropdown.Item>
//                 <NavDropdown.Divider />
//                 <NavDropdown.Item eventKey="4.4">
//                   Separated link
//                 </NavDropdown.Item>
//               </NavDropdown>
//             </Col>
//           </Row>
//         </div>
//       </div>
//     </div>
//   );
// };
