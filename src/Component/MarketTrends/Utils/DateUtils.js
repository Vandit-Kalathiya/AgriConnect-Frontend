export const getCurrentMonth = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const now = new Date();
    return months[now.getMonth()];
  };
  
  export const getCurrentYear = () => {
    return new Date().getFullYear();
  };
  
  export const getLastSixMonths = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const result = [];
    const now = new Date();
    const currentMonth = now.getMonth();
    
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      result.push(months[monthIndex]);
    }
    
    return result;
  };
  
  export const getNextSixMonths = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const result = [];
    const now = new Date();
    const currentMonth = now.getMonth();
    
    for (let i = 1; i <= 6; i++) {
      const monthIndex = (currentMonth + i) % 12;
      result.push(months[monthIndex]);
    }
    
    return result;
  };
  
  export const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };
  
  export const getFormattedCurrentDate = () => {
    return formatDate(new Date());
  };