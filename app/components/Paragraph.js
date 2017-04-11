// Include React
var React = require("react");

// Create the Header component
// Notice how the header uses React.createClass
// Notice how it uses a render function which specifies what will be displayed by the component
var Paragraph = React.createClass({
  render: function() {
    return (
      <p>Alexander Hamilton, the $10 founding father without a father!</p>
    );
  }
});

// Export the component back for use in other files
module.exports = Paragraph;
