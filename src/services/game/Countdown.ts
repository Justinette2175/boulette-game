import ReduxStore from "../../redux/store";
import { updateTimer, resetTimer } from "../../redux/computer";
import moment from "moment";
import { Time } from "../../types";

const COUNTDOWN_INTERVAL = 1000;

class Countdown {
  endTime: string;
  interval: any;
  onEnd: () => void;
  running: boolean;
  constructor(remainingTimeForNextRound?: Time) {
    this.reset(remainingTimeForNextRound);
    this.running = false;
  }

  start = (endTime: string, onCountdownEnd?: () => void) => {
    if (!this.running) {
      this.onEnd = onCountdownEnd;
      this.endTime = endTime;
      this.running = true;
      this.interval = setInterval(() => {
        const callback = async () => {
          const finished = this._isFinished();
          this._updateLocally();
          if (finished) {
            this.onEnd();
            this._clearInterval();
          }
        };
        callback();
      }, COUNTDOWN_INTERVAL);
    }
  };

  _updateLocally = () => {
    const differenceInMilliseconds = moment().diff(moment(this.endTime));
    let seconds = -moment.duration(differenceInMilliseconds).seconds();
    let milliseconds = moment.duration(differenceInMilliseconds).milliseconds();
    let minutes = -moment.duration(differenceInMilliseconds).minutes();
    if (seconds < -1 || milliseconds > 0) {
      seconds = -1;
    }
    if (minutes < 0 || minutes === -0) {
      minutes = 0;
    }
    ReduxStore.dispatch(updateTimer({ seconds, minutes }));
  };

  _isFinished = (): boolean => {
    const differenceInMilliseconds = moment().diff(moment(this.endTime));
    const milliseconds = moment
      .duration(differenceInMilliseconds)
      .asMilliseconds();
    return milliseconds > 0;
  };

  _clearInterval = () => {
    if (this.interval) {
      clearInterval(this.interval);
    }
  };

  reset = (remainingTimeForNextRound?: Time) => {
    this.running = false;
    this._clearInterval();
    setTimeout(() => {
      if (remainingTimeForNextRound) {
        ReduxStore.dispatch(updateTimer(remainingTimeForNextRound));
      } else {
        ReduxStore.dispatch(resetTimer());
      }
    }, 1000);
  };
}

export default Countdown;
