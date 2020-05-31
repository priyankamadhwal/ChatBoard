import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import ReactEmoji from "react-emoji";

const WhiteTextTypography = withStyles({
  root: {
    color: "#fafbfc",
    fontSize: "0.9em",
  },
})(Typography);

const Copyright = () => {
  return (
    <Box mt={5}>
      <WhiteTextTypography variant='body2' align='center'>
        {"Built with "}
        {ReactEmoji.emojify("<3")}{" "}
        <Link color='inherit' href='/'>
          PM
        </Link>{" "}
        {" © "}
        {new Date().getFullYear()}
      </WhiteTextTypography>
    </Box>
  );
};

export default Copyright;
