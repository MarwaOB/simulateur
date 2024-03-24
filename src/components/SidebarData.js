// SidebarData.js
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faBook, faFileExport, faFileImport } from "@fortawesome/free-solid-svg-icons";
import './Navbar.css'; // Make sure to import your CSS file
import { RiGridFill } from "react-icons/ri";


export const SidebarData = [
  {
    id: 1,
    icon: <RiGridFill className="sidebar-icon" style={{ color: "white" ,  width : "1.5rem " }} />,

  },
  {
    id: 2,
    icon: <FontAwesomeIcon icon={faFileImport} className="sidebar-icon" style={{ color: "white" }} />,
  },
  {
    id: 3,
    icon: <FontAwesomeIcon icon={faFileExport} className="sidebar-icon" style={{ color: "white" , padding : "0px 0px 0px 3px"}} />,
  },
  {
    id: 4,
    icon: <FontAwesomeIcon icon={faBook} className="sidebar-icon" style={{ color: "white" , padding : "0px 0px 0px 3px" }} />,
  },
  {
    id: 5,
    icon: <FontAwesomeIcon icon={faArrowRightFromBracket} className="sidebar-icon mt-16" style={{ color: "white" , padding : "0px 0px 0px 3px"}} />,
  },
];
