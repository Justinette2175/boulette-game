import React from "react";
import { Typography, useTheme, Box } from "@material-ui/core";

interface IProps {
  content: Array<Content>;
  keyPrefix: string;
}

const TextFormatter: React.FC<IProps> = ({ content, keyPrefix, ...rest }) => {
  const theme = useTheme();
  return (
    <Box {...rest}>
      {content &&
        content.map((item, i) => {
          const key = `content-item-${keyPrefix}-${i}`;
          if (item.type === "h1") {
            return (
              <Typography
                key={key}
                variant="h1"
                style={{
                  marginTop: i !== 0 && theme.spacing(6),
                  marginBottom: theme.spacing(4),
                }}
              >
                {item.data}
              </Typography>
            );
          }
          if (item.type === "h2") {
            return (
              <Typography
                key={key}
                variant="h2"
                style={{ marginTop: i !== 0 && theme.spacing(6) }}
              >
                {item.data}
              </Typography>
            );
          }
          if (item.type === "h3") {
            return (
              <Typography
                key={key}
                variant="h3"
                style={{
                  marginTop: i !== 0 && theme.spacing(3),
                  marginBottom: theme.spacing(2),
                }}
              >
                {item.data}
              </Typography>
            );
          }
          if (item.type === "h4") {
            return (
              <Typography
                key={key}
                variant="h4"
                style={{
                  marginTop: i !== 0 && theme.spacing(3),
                  marginBottom: theme.spacing(2),
                }}
              >
                {item.data}
              </Typography>
            );
          }
          if (item.type === "paragraph") {
            return (
              <Typography key={key} variant="body1">
                {item.data}
              </Typography>
            );
          }
          if (item.type === "list") {
            return (
              <ul>
                {Array.isArray(item.data) ? (
                  item.data.map((d) => (
                    <Typography component="li">{d}</Typography>
                  ))
                ) : (
                  <Typography component="li">{item.data}</Typography>
                )}
              </ul>
            );
          }
        })}
    </Box>
  );
};

interface Content {
  type: string;
  data: string | Array<string>;
}

export default TextFormatter;
