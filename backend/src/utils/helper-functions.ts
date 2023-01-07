import moment from "moment";

export function formatDate(date: Date | string | undefined | null){
    if(!date) return null;

    return moment(date).add(1,'hour').toDate()
}