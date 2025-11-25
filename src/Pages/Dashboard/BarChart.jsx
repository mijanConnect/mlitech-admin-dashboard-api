import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = () => {
  const [chartHeight, setChartHeight] = useState("200px");
  // responsive bar thickness so bars don't touch on small screens
  const [barThickness, setBarThickness] = useState(() => {
    // Start at 90 on very large screens and step down as viewport shrinks
    const w = typeof window !== "undefined" ? window.innerWidth : 1024;
    if (w < 480) return 14;
    if (w < 768) return 20;
    if (w < 900) return 30;
    if (w < 1024) return 40;
    if (w < 1280) return 50;
    if (w < 1600) return 60;
    if (w < 1920) return 80;
    return 90;
  });

  // Effect to update chart height based on screen size
  useEffect(() => {
    const updateChartHeight = () => {
      if (window.innerWidth < 768) setChartHeight("150px");
      else if (window.innerWidth < 1024) setChartHeight("200px");
      else setChartHeight("250px");
      // update bar thickness responsively
      const w = window.innerWidth;
      if (w < 480) setBarThickness(14);
      else if (w < 768) setBarThickness(20);
      else if (w < 900) setBarThickness(30);
      else if (w < 1024) setBarThickness(40);
      else if (w < 1280) setBarThickness(50);
      else if (w < 1600) setBarThickness(60);
      else if (w < 1920) setBarThickness(80);
      else setBarThickness(90);
    };

    updateChartHeight();
    window.addEventListener("resize", updateChartHeight);
    return () => window.removeEventListener("resize", updateChartHeight);
  }, []);

  // Sample monthly data for each year (replace with real data as needed)
  const monthlyDataByYear = {
    [new Date().getFullYear()]: [
      100, 90, 120, 110, 95, 105, 130, 125, 115, 140, 135, 145,
    ],
    [new Date().getFullYear() - 1]: [
      90, 80, 110, 100, 85, 95, 120, 115, 105, 130, 125, 135,
    ],
    [new Date().getFullYear() - 2]: [
      95, 85, 115, 105, 90, 100, 125, 120, 110, 135, 130, 140,
    ],
  };

  // Compute annual totals from monthly data
  const annualTotals = Object.keys(monthlyDataByYear).reduce((acc, y) => {
    const year = Number(y);
    const total = (monthlyDataByYear[year] || []).reduce(
      (s, v) => s + (Number(v) || 0),
      0
    );
    acc[year] = total;
    return acc;
  }, {});

  // Available years from the sample data (sorted ascending)
  const availableYears = Object.keys(annualTotals)
    .map(Number)
    .sort((a, b) => a - b);

  // Default start/end years (earliest -> latest available)
  const defaultStartYear = availableYears[0] ?? new Date().getFullYear();
  const defaultEndYear =
    availableYears[availableYears.length - 1] ?? new Date().getFullYear();

  // Start/End year state
  const [startYear, setStartYear] = useState(defaultStartYear);
  const [endYear, setEndYear] = useState(defaultEndYear);

  // Date range picker state (string format YYYY-MM-DD)
  const [rangeOpen, setRangeOpen] = useState(false);
  const [start, setStart] = useState(`${defaultStartYear}-01-01`);
  const [end, setEnd] = useState(`${defaultEndYear}-12-31`);

  // Sync date inputs to year values
  useEffect(() => {
    try {
      const sYear = start ? new Date(start).getFullYear() : defaultStartYear;
      const eYear = end ? new Date(end).getFullYear() : defaultEndYear;
      if (!Number.isNaN(sYear)) setStartYear(sYear);
      if (!Number.isNaN(eYear)) setEndYear(eYear);
    } catch (err) {
      // ignore invalid dates
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, end]);

  // Helper: inclusive year range array
  const makeYearRange = (s, e) => {
    const out = [];
    for (let y = s; y <= e; y++) out.push(y);
    return out;
  };

  // Ensure startYear <= endYear logically (if not, adjust)
  useEffect(() => {
    if (startYear > endYear) setEndYear(startYear);
    if (endYear < startYear) setStartYear(endYear);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startYear, endYear]);

  // Build chart data for the selected year range (one bar per year)
  const yearsInRange = makeYearRange(startYear, endYear);
  const chartData = {
    labels: yearsInRange.map(String),
    datasets: [
      {
        label: `Revenue (${startYear} - ${endYear})`,
        data: yearsInRange.map((y) => annualTotals[y] || 0),
        backgroundColor: "#3fae6a",
        borderRadius: 0,
        // increase computed thickness to make bars wider, but cap it
        // use a larger multiplier and higher cap for visibly wider bars
        barThickness: Math.min(barThickness * 4, 450),
        maxBarThickness: 450,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          // Show raw value only
          label: (context) => `${context.raw}`,
        },
        backgroundColor: "#3fae6a",
        titleColor: "#fff",
        bodyColor: "#fff",
        cornerRadius: 0,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        // Make bars wide but keep a small gap between them
        categoryPercentage: 0.95,
        barPercentage: 0.6,
        ticks: {
          color: "#181818",
          font: {
            size: window.innerWidth < 768 ? 10 : 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#eaeaea",
        },
        ticks: {
          color: "#181818",
        },
      },
    },
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 sm:mb-4 gap-2 sm:gap-0">
        <div className="flex justify-between items-center text-white w-full mb-6">
          <h2 className="text-secondary mt-4 text-[24px] font-bold">
            Yearly Revenue
          </h2>
          <div className="relative">
            <button
              onClick={() => setRangeOpen((v) => !v)}
              className="w-[230px] font-medium text-[14px] py-[10px] px-[12px] border border-primary text-secondary rounded-lg text-left flex justify-between items-center"
            >
              <span className="truncate">
                {start && !isNaN(new Date(start).getTime())
                  ? new Date(start).getFullYear()
                  : "-"}
                {" — "}
                {end && !isNaN(new Date(end).getTime())
                  ? new Date(end).getFullYear()
                  : "-"}
              </span>
              <span className="ml-2">📅</span>
            </button>

            {rangeOpen && (
              <div className="absolute right-0 z-10 mt-1 w-[280px] rounded-lg border border-primary bg-white p-3 shadow-lg text-black">
                <div className="space-y-2">
                  <label className="block text-xs text-gray-500">
                    Start date
                  </label>
                  <input
                    type="date"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    className="w-full rounded-md border px-2 py-2 text-sm text-black bg-white"
                    max={end}
                  />
                </div>
                <div className="space-y-2 mt-3">
                  <label className="block text-xs text-gray-500">
                    End date
                  </label>
                  <input
                    type="date"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    className="w-full rounded-md border px-2 py-2 text-sm text-black bg-white"
                    min={start}
                  />
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => setRangeOpen(false)}
                    className="px-3 py-1.5 text-sm rounded-md border text-black bg-white"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setRangeOpen(false)}
                    className="px-3 py-1.5 text-sm rounded-md bg-[#00bcd4] text-white hover:bg-[#00acc1]"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div style={{ width: "100%", height: chartHeight }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default BarChart;
