import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const LearningPlanSummary = () => {
    const [stats, setStats] = useState({
        urgentCount: 0,
        normalCount: 0,  // Added normal count
        busiestTime: 'Loading...',
        busiestDay: 'Loading...',
        busiestMonth: 'Loading...'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/learningPlan");
                const plans = response.data;
                
                // Calculate all statistics
                const calculatedStats = {
                    urgentCount: calculateUrgentCount(plans),
                    normalCount: calculateNormalCount(plans),  // Added normal count calculation
                    busiestTime: calculateBusiestTime(plans),
                    busiestDay: calculateBusiestDay(plans),
                    busiestMonth: calculateBusiestMonth(plans)
                };
                
                setStats(calculatedStats);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Calculate number of urgent items
    const calculateUrgentCount = (plans) => {
        return plans.filter(plan => plan.title === 'Urgent').length;
    };

    // Calculate number of normal items
    const calculateNormalCount = (plans) => {
        return plans.filter(plan => plan.title === 'Normal').length;
    };

    
      // Calculate busiest time slot (2-hour window)
      const calculateBusiestTime = (plans) => {
        const timeSlots = Array(12).fill(0).map((_, i) => {
          const startHour = 8 + i;
          return {
            range: `${startHour}:00 - ${startHour + 2}:00`,
            count: plans.filter(plan => {
              const planHour = parseInt(plan.startTime.split(':')[0]);
              return planHour >= startHour && planHour < startHour + 2;
            }).length
          };
        });
        
        const busiest = timeSlots.reduce((max, slot) => slot.count > max.count ? slot : max, {count: 0});
        return busiest.range;
      };
    
      // Calculate busiest day of week
      const calculateBusiestDay = (plans) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayCounts = days.map(day => ({
          day,
          count: plans.filter(plan => {
            const planDate = new Date(plan.date);
            return days[planDate.getDay()] === day;
          }).length
        }));
        
        const busiest = dayCounts.reduce((max, day) => day.count > max.count ? day : max, {count: 0});
        return busiest.day;
      };
    
      // Calculate busiest month
      const calculateBusiestMonth = (plans) => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
        const monthCounts = months.map(month => ({
          month,
          count: plans.filter(plan => {
            const planDate = new Date(plan.date);
            return months[planDate.getMonth()] === month;
          }).length
        }));
        
        const busiest = monthCounts.reduce((max, month) => month.count > max.count ? month : max, {count: 0});
        return busiest.month;
      };
    
  return (
    <div className="card mt-3">
            <div className="card-header bg-white">
                <h4 className="mb-0 text-center pt-3 pb-3">
                    Time Management
                </h4>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-borderless" style={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                        <tbody>
                            {/* Urgent Work Count */}
                            <tr style={{ verticalAlign: 'middle' }}>
                                <td style={{ paddingBottom: '12px', paddingTop: '12px' }}>
                                    <i className="bi bi-exclamation-triangle-fill  me-2"></i>
                                    Urgent Work count
                                </td>
                                <td className="text-end" style={{ paddingBottom: '12px', paddingTop: '12px' }}>
                                    <span className="badge bg-danger bg-opacity-10 text-dark px-3 py-2">
                                        {stats.urgentCount}
                                    </span>
                                </td>
                            </tr>
                            
                            {/* Normal Work Count */}
                            <tr style={{ verticalAlign: 'middle' }}>
                                <td style={{ paddingBottom: '12px', paddingTop: '12px' }}>
                                    <i className="bi bi-check-circle-fill me-2"></i>
                                    Normal Work count
                                </td>
                                <td className="text-end" style={{ paddingBottom: '12px', paddingTop: '12px' }}>
                                    <span className="badge bg-success bg-opacity-10 text-dark px-3 py-2">
                                        {stats.normalCount}
                                    </span>
                                </td>
                            </tr>
                            
                            {/* Busiest Time */}
                            <tr style={{ verticalAlign: 'middle' }}>
                                <td style={{ paddingBottom: '12px', paddingTop: '12px' }}>
                                    <i className="bi bi-clock-fill me-2"></i>
                                    Busiest time of day
                                </td>
                                <td className="text-end" style={{ paddingBottom: '12px', paddingTop: '12px' }}>
                                    <span className="badge bg-primary bg-opacity-10 text-dark px-3 py-2">
                                        {stats.busiestTime}
                                    </span>
                                </td>
                            </tr>
                            
                            {/* Busiest Day */}
                            <tr style={{ verticalAlign: 'middle' }}>
                                <td style={{ paddingBottom: '12px', paddingTop: '12px' }}>
                                    <i className="bi bi-calendar-week-fill me-2"></i>
                                    Busiest day of week
                                </td>
                                <td className="text-end" style={{ paddingBottom: '12px', paddingTop: '12px' }}>
                                    <span className="badge bg-info bg-opacity-10 text-dark px-3 py-2">
                                        {stats.busiestDay}
                                    </span>
                                </td>
                            </tr>
                            
                            {/* Busiest Month */}
                            <tr style={{ verticalAlign: 'middle' }}>
                                <td style={{ paddingBottom: '12px', paddingTop: '12px' }}>
                                    <i className="bi bi-calendar-month-fill me-2"></i>
                                    Busiest month
                                </td>
                                <td className="text-end" style={{ paddingBottom: '12px', paddingTop: '12px' }}>
                                    <span className="badge bg-warning bg-opacity-10 text-dark px-3 py-2">
                                        {stats.busiestMonth}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};