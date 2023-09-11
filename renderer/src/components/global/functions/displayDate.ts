import moment from 'moment-timezone';

const displayDate = (date: string, ) => {
    const userTzn = moment?.tz?.guess()
    const userTime = moment?.tz?.(date, userTzn);

    return userTime?.format?.('L @ h:mm a');    
} 

export default displayDate;