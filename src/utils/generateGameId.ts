import randomString from "randomstring";

const generateGameId = () => {
  return randomString.generate({
    length: 5,
    charset: "alphabetic",
    capitalization: "uppercase",
  });
};

export default generateGameId;
