/**
 *
 * @param date 传入指定的日期对象
 * @returns {Array} 返回该周的日期对象 [周日，周一...周六]
 */
function getDatesofweek(date){
    date = date || new Date();
    var day = date.getDay(), /*周几*/
        timestamp = date.getTime(), /*改天的毫秒表示法*/
        dayMilliseconds = 1000 * 24 * 60 * 60, /*一天毫秒数*/
        dates = [],
        i = -day;

    for(i = -day; i < 7 - day; i++){
        dates.push(new Date(timestamp + dayMilliseconds * i));
    }

    return dates;
}


function getDatesofMonth(date, matrix){
    date = date || new Date();
    var day = date.getDay(), /*周几*/
        timestamp = date.getTime(), /*改天的毫秒表示法*/
        dayMilliseconds = 1000 * 24 * 60 * 60, /*一天毫秒数*/
        dates = [],
        tempDates = [],
        month = date.getMonth(),
        i = -5,
        j;

    //一月不可能超过6周
    for( ; i < 5; i++){
        tempDates =  getDatesofweek(new Date(timestamp + dayMilliseconds * i * 7));
        //只要有一天在当前月就算
        if(tempDates[0].getMonth() == month  || tempDates[6].getMonth() == month ){
            if(matrix){
                dates.push(tempDates);
            }else {
                for (j = 0; j < tempDates.length; j++) {
                    dates.push(tempDates[j]);
                }
            }
        }
    }
    return dates;
}

function logDates(dates){
    for(var i = 0 ; i < dates.length; i++){
        console.log(dates[i].toLocaleDateString());
    }
}