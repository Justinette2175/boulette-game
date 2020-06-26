import { FirebasePlayer, FirebaseGameWord } from "../types/firebaseTypes";

const getUserWords = (words: Array<FirebaseGameWord>, u: FirebasePlayer) =>
  u ? words.filter((w) => w.writtenBy?.id === u.id) || [] : [];

export default getUserWords;
