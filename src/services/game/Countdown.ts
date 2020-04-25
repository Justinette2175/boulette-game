import ReduxStore from "../../redux/store";
import { updateTimer, resetTimer } from "../../redux/computer";
import moment from "moment";
import { Time } from "../../types";

const COUNTDOWN_INTERVAL = 500;

class Countdown {
  endTime: string;
  interval: any;
  onEnd: () => void;

  constructor(endTime: string, onCountdownEnd: () => void) {
    this.endTime = endTime;
    this.onEnd = onCountdownEnd;
    this.start();
  }

  start = () => {
    this.interval = setInterval(() => {
      const callback = async () => {
        if (this.isFinished()) {
          this.onEnd();
        } else {
          this.updateLocally();
        }
      };
      callback();
    }, COUNTDOWN_INTERVAL);
  };

  updateLocally = () => {
    const differenceInMilliseconds = moment().diff(moment(this.endTime));
    const seconds = -moment.duration(differenceInMilliseconds).seconds();
    const minutes = -moment.duration(differenceInMilliseconds).minutes();
    ReduxStore.dispatch(
      updateTimer({ seconds: seconds > 0 ? seconds : 0, minutes })
    );
  };

  isFinished = (): boolean => {
    const differenceInMilliseconds = moment().diff(moment(this.endTime));
    const seconds = -moment.duration(differenceInMilliseconds).seconds();
    return seconds < 0;
  };

  reset = (remainingTimeForNextRound?: Time) => {
    clearInterval(this.interval);
    if (remainingTimeForNextRound) {
      ReduxStore.dispatch(updateTimer(remainingTimeForNextRound));
    } else {
      ReduxStore.dispatch(resetTimer());
    }
  };
}

export default Countdown;
