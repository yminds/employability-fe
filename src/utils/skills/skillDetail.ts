export const getRatingValue=(rating: "Low" | "Average" | "Good" | "Excellent"): number =>{
    switch (rating) {
      case "Low":
        return Math.floor(Math.random() * (40 - 10 + 1)) + 10;
      case "Average":
        return Math.floor(Math.random() * (60 - 40 + 1)) + 40;
      case "Good":
        return Math.floor(Math.random() * (80 - 60 + 1)) + 60;
      case "Excellent":
        return Math.floor(Math.random() * (100 - 80 + 1)) + 80;
      default:
        throw new Error("Invalid rating value");
    }
  }


    
export const getRatingColor = (rating: "Low" | "Average" | "Good" | "Excellent") => {
    switch (rating) {
      case "Low":
        return "yellow-500"
      case "Average":
        return "orange-500"
      case "Good":
        return "green-400"
      case "Excellent":
        return "green-700"
      default:
        throw new Error("Invalid rating value");
    }
  }


export const convertTimestamp=(timestamp: Date): string=> {
    const date = new Date(timestamp);
    const seconds = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
    const fractionOfDay = seconds / 86400;
    return fractionOfDay.toFixed(2);
  }