export const useDateElapsed = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
    );
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInMonths / 12);

    if (diffInMinutes < 60) {
        return `${diffInMinutes}分前`;
    } else if (diffInHours < 24) {
        return `${diffInHours}時間前`;
    } else if (diffInDays < 30) {
        return `${diffInDays}日前`;
    } else if (diffInMonths < 12) {
        return `${diffInMonths}ヶ月前`;
    } else {
        return `${diffInYears}年前`;
    }
};
