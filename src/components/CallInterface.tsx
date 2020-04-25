import React from "react";
import { Box, Typography } from "@material-ui/core";
import { Phone } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import { Store, User, TeamId } from "../types";
import { useSelector } from "react-redux";
import { NEON_GREEN, NEON_PINK, PALETTE_PURPLE } from "../theme";

const useStyles = makeStyles({
  container: {
    position: "fixed",
    bottom: 0,
    right: ({ teamId }) => (teamId === "1" ? "auto" : 0),
    left: ({ teamId }) => (teamId === "1" ? 0 : "auto"),
    zIndex: 500,
  },
  iconContainer: {
    height: "50px",
    width: "50px",
    backgroundColor: PALETTE_PURPLE,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: (props: IProps) => (props.teamId === "1" ? NEON_GREEN : NEON_PINK),
  },
  avatarsContainer: {
    padding: "5px",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  userAvatarBox: {
    border: "2px solid white",
    borderRadius: "100%",
    height: "40px",
    width: "40px",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: (props: IProps) =>
      props.teamId === "1" ? NEON_GREEN : NEON_PINK,
    color: "white",
  },
});

interface IProps {
  teamId?: TeamId;
  jitsy: any;
}

const CallInterface: React.FC<IProps> = ({ teamId, jitsy }) => {
  const gameUsers = useSelector((state: Store) => state.game.users);
  const classes = useStyles({ teamId, jitsy });
  return (
    <Box className={classes.container}>
      <Box className={classes.iconContainer}>
        <Phone />
      </Box>
      <Box className={classes.avatarsContainer}>
        {gameUsers.map((u: User) => {
          return (
            <Box className={classes.userAvatarBox}>
              <Typography component="span" variant="h3">
                {u.name.charAt(0)}
              </Typography>
              <Box id={`${u.id}-jitsy`}></Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default CallInterface;
