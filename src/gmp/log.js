/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import {isDefined, isString} from 'gmp/utils/identity';

export const DEFAULT_LOG_LEVEL = 'error';
export const LOG_LEVEL_DEBUG = 'debug';

const GREENBONE_GREEN = '#66c430';

export const LogLevels = {
  trace: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
  silent: 5,
};

const isValidLogLevel = level =>
  isString(level) && level.toLowerCase() in LogLevels;

const getLogLevel = logLevel =>
  isValidLogLevel(logLevel) ? LogLevels[logLevel.toLowerCase()] : undefined;

function noop() {}

class Logger {
  constructor(name, level = DEFAULT_LOG_LEVEL) {
    this.name = name;
    this.setDefaultLevel(level);
  }

  _updateLogging(newLogValue) {
    for (const [logName, logValue] of Object.entries(LogLevels)) {
      if (logValue === LogLevels.silent) {
        continue;
      }

      this[logName] =
        logValue < newLogValue
          ? noop
          : (...args) => {
              // eslint-disable-next-line no-console
              return console[logName](
                '%c' + this.name,
                'color: ' + GREENBONE_GREEN,
                ...args,
              );
            };
    }
  }

  setDefaultLevel(level) {
    let logValue = getLogLevel(level);

    if (!isDefined(logValue)) {
      console.error('Unknown logLevel ', level, ' for Logger ', this.name);
      logValue = LogLevels.silent;
    }

    this.defaultLogValue = logValue;

    if (!isDefined(this.logValue)) {
      this._updateLogging(logValue);
    }
  }

  setLevel(level) {
    let logValue = getLogLevel(level);

    if (!isDefined(logValue)) {
      console.error('Unknown logLevel ', level, ' for Logger ', this.name);
      logValue = LogLevels.silent;
    }

    this.logValue = logValue;

    this._updateLogging(logValue);
  }
}

export class RootLogger {
  constructor() {
    this.loggers = {};
    this.level = DEFAULT_LOG_LEVEL;
  }

  init({logLevel}) {
    return this.setDefaultLevel(logLevel);
  }

  setDefaultLevel(level) {
    if (isValidLogLevel(level)) {
      level = level.toLowerCase();
      this.level = level;
      for (const logger of Object.values(this.loggers)) {
        logger.setDefaultLevel(level);
      }
      return true;
    }
    return false;
  }

  getLogger(name) {
    name = isString(name) ? name : 'unknown';
    let logger = this.loggers[name];

    if (!isDefined(logger)) {
      logger = new Logger(name, this.level);
      this.loggers[name] = logger;
    }
    return logger;
  }
}

const logger = new RootLogger();

export default logger;
