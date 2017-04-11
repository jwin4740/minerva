// Include the Main React Dependencies
var React = require("react");
var ReactDOM = require("react-dom");

// Include the Header Component
var Header = require("./components/Header");
var Paragraph = require("./components/Paragraph");

ReactDOM.render(

  // Here we deploy the header component as though it were any other HTML element
  <Header />,
  document.getElementById("app")
);

// ReactDOM.render(

//   // Here we deploy the header component as though it were any other HTML element
//   <Paragraph />,
//   document.getElementById("app")
// );

