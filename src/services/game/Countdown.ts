import ReduxStore from "../../redux/store";
import { updateTimer, resetTimer } from "../../redux/computer";
import moment from "moment";
import { Time } from "../../types";

const COUNTDOWN_INTERVAL = 1000;

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
          console.log("timer is finished, on end is", this.onEnd);
          this.onEnd();
          this.reset();
        } else {
          this.updateLocally();
        }
      };
      callback();
    }, COUNTDOWN_INTERVAL);
  };

  updateLocally = () => {
    const differenceInMilliseconds = moment().diff(moment(this.endTime));
    let seconds = -moment.duration(differenceInMilliseconds).seconds();
    let minutes = -moment.duration(differenceInMilliseconds).minutes();
    if (seconds < 0) {
      seconds = 0;
    }
    if (minutes < 0) {
      minutes = 0;
    }
    if (seconds < 0 && minutes < 0) {
      this.reset();
    }
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
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (remainingTimeForNextRound) {
      ReduxStore.dispatch(updateTimer(remainingTimeForNextRound));
    } else {
      ReduxStore.dispatch(resetTimer());
    }
  };
}

export default Countdown;
