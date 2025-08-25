import { PluginFunc } from "dayjs";

const subtractOneHourPlugin: PluginFunc = (option, DayjsClass, dayjs) => {
  DayjsClass.prototype.subtractOneHour = function () {
    return this.subtract(1, "hour");
  };
};

export default subtractOneHourPlugin;
