import React, { useContext } from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Store, User, TeamId } from "../types";
import { useSelector } from "react-redux";
import { NEON_GREEN, NEON_PINK, PALETTE_PURPLE } from "../theme";
import ParticipantCall from "./ParticipantCall";
import JitsiContext from "../contexts/JitsiContext";

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
  },
  avatarsContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    position: "relative",
  },
  userAvatarBox: {
    position: "absolute",
    top: 0,
    right: 0,
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
}

const CallInterface: React.FC<IProps> = ({ teamId }) => {
  const gameUsers = useSelector((state: Store) => state.game.users);
  const computerUsers = useSelector((state: Store) => state.computer.users);
  const classes = useStyles({ teamId });

  const [jitsi, existingTracksIds] = useContext(JitsiContext);

  const usersByJitsyIds = gameUsers
    .filter((us) => computerUsers.indexOf(us.id) < 0)
    .filter((user) => !!user.jitsyId)
    .reduce((acc: any, u) => {
      if (u.jitsyId && acc[u.jitsyId]) {
        acc[u.jitsyId].push(u);
      } else if (u.jitsyId) {
        acc[u.jitsyId] = [u];
      }
      return acc;
    }, {});

  return (
    <Box className={classes.container}>
      <Box className={classes.avatarsContainer}>
        {Object.keys(usersByJitsyIds).map((key: string) => {
          const usersOnOneJitsy = usersByJitsyIds[key];
          return (
            <Box>
              {usersOnOneJitsy.map((u: User) => (
                <Box className={classes.userAvatarBox}>
                  <Typography component="span" variant="h3">
                    {u.name.charAt(0)}
                  </Typography>
                </Box>
              ))}
              {existingTracksIds[key] &&
                jitsi &&
                jitsi.remoteTracks &&
                jitsi.remoteTracks[key] && (
                  <ParticipantCall jitsyId={key} j={jitsi} />
                )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default CallInterface;
